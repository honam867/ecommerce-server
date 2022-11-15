const mongoose = require('mongoose');
const { USER_ROLES, USER_ROLES_PERMISSONS } = require('@utils/const');
const MODELS = require('./const');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Actions = ['allow', 'deny'];
const Methods = ['POST', 'GET', 'PUT', 'DELETE', '*'];

const RoleGroupSchema = new Schema({
    role: { type: String, unique: true, index: true },
    groups: [
        {
            name: String,
            methods: [{ type: String, require: true, enum: Methods }],
            action: { type: String, enum: Actions },
        },
    ],
    level: { type: Number, default: 1 },
    tabs: [String], // UI Tabs
    description: String,
});

RoleGroupSchema.methods = {
    getGroup(name) {
        for (const group of this.groups) {
            if (group.name === name) return group.toObject();
        }
        return {};
    },

    getPermission(permission) {
        return this.group.find(r => r.name === permission);
    },
};

RoleGroupSchema.statics = {
    async getRole(role) {
        const result = await this.findOne({ role });
        const policies = [];
        if (result) {
            const permissions = await this.model(MODELS.ROLE_PERMISSION.name).find({
                name: result.groups.map(g => g.name),
            });

            permissions.forEach(permission => {
                permission.permissions = permission.permissions.map(p => {
                    p = p.toObject();
                    const group = result.getGroup(permission.name);
                    p.methods = group.methods && group.methods.length > 0 ? group.methods : p.methods;
                    p.action = group.action || p.action;
                    return p;
                });
                policies.push(...permission.permissions);
            });
        }
        return policies;
    },

    async getUnderRoles(roleName, includeIt = true, minimize = false) {
        const role = await this.findOne({ role: roleName });
        if (!role) return [];

        const query = includeIt ? { level: { $gte: role.level } } : { level: { $gt: role.level } };
        if (minimize) {
            return this.find(query)
                .sort({ level: 1 })
                .select('role')
                .then(res => res.map(v => v.role));
        }
        return this.find(query).sort({ role: 1 });
    },

    async getHigherRoles(roleName, includeIt = true) {
        const role = await this.findOne({ role: roleName });
        if (!role) return [];
        const query = { level: { [includeIt ? '$lte' : '$lt']: role.level } };
        return this.find(query)
            .sort({ level: 1 })
            .select('role')
            .then(res => res.map(v => v.role));
    },

    async checkPermission(roleName, permissionName) {
        const rs = { exists: false };
        if (roleName === USER_ROLES.ADMIN) {
            rs.exists = USER_ROLES_PERMISSONS.INBOX_UNKNOWN_HIDDEN !== permissionName;
            rs.write = true;
            rs.read = true;
            return rs;
        }
        const role = await this.findOne({ role: roleName, 'groups.name': permissionName });
        if (!role) return rs;
        rs.exists = true;
        const permission = role.groups.find(g => g.name === permissionName);
        if (permission) {
            if (permission.methods.includes('*')) {
                rs.write = true;
                rs.read = true;
            } else if (permission.methods.includes('GET')) rs.read = true;
        }
        return rs;
    },
};

module.exports = mongoose.model(MODELS.ROLE_GROUP.name, RoleGroupSchema, MODELS.ROLE_GROUP.collection);
