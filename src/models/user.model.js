const mongoose = require('mongoose');
const _ = require('lodash');
const { v4: uuid } = require('uuid');

const ThrowReturn = require('@core/throwreturn');
const { hashPassword } = require('@utils/userutils');
const { USER_ROLES, USER_BOT } = require('@utils/const');
const { signToken } = require('@utils/token');
const { updateDoc } = require('@utils/schema');
const { nanoid } = require('@utils/generate');
const MODELS = require('./const');

const { Schema, Custom } = mongoose;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            index: true,
            unique: true,
            maxlength: 50,
            minlength: 4,
        },
        password: { type: String, minlength: 4 },
        role: String,
        enable: { type: Boolean, default: true },
        revokeKey: { type: String, default: uuid },
        name: String,
        address: String,
        refId: { type: String, default: () => nanoid(8).toLowerCase() },
        contact: {
            phone: String,
            email: String,
            zalo: String,
            whatsapp: String,
            messager: String,
        },
        avatar: Custom.Ref({ type: String, ref: MODELS.RESOURCE_UPLOADING.name }),
        isBot: {
            type: Boolean,
            default: false,
        },
        order: {
            monday: { type: Number, default: 0 },
            tuesday: { type: Number, default: 0 },
            wednesday: { type: Number, default: 0 },
            thursday: { type: Number, default: 0 },
            friday: { type: Number, default: 0 },
            saturday: { type: Number, default: 0 },
            sunday: { type: Number, default: 0 },
        },
        managerId: { type: Schema.Types.ObjectId, ref: MODELS.USER.name },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    },
);

UserSchema.methods = {
    generateToken() {
        const data = _.pick(this, ['_id', 'revokeKey']);
        return signToken({ user: data });
    },

    equals(field, data) {
        if (field === 'password') {
            data = hashPassword(data);
        }
        return this[field] === data;
    },

    revoke() {
        this.revokeKey = uuid();
        return this.revokeKey;
    },

    async changePassword(password) {
        this.password = hashPassword(password);
        this.revoke();
        await this.save();
    },
};

UserSchema.statics = {
    async createNewAccount(data, managerId) {
        data.password = hashPassword(data.password);
        data.role = data.role || USER_ROLES.ANONYMOUS;
        data.managerId = data.managerId || managerId;
        data.enable = true;
        return this.create(data);
    },

    async list(start, limit) {
        start = parseInt(start);
        limit = parseInt(limit);

        const users = await this.find().limit(limit).skip(start).select('-password');
        const total = await this.countDocuments();
        return { users, total };
    },

    async updateUserInfo(_id, data) {
        const dataUpdate = _.pick(data, ['name', 'address', 'avatar', 'contact']);

        const user = await this.findById(_id);
        if (!user) {
            throw new ThrowReturn('Tài khoản không tồn tại!');
        }

        return await updateDoc(user, dataUpdate);
    },

    async getManageUser(userId, userRole, findRoles, includeMe = true, blockIds = null) {
        let userIds = [];
        let roles = findRoles || (await this.model(MODELS.ROLE_GROUP.name).getUnderRoles(userRole, includeMe, true));
        const query = { enable: true, role: { $in: roles }, isBot: { $ne: true } };

        if (userRole !== USER_ROLES.ADMIN) {
            userIds = await this.model(MODELS.HOST.name).getAccountInBlocks(userId, blockIds);
            query._id = userIds;
        }

        return this.find(query).select('-password').populate('managerId', 'username name').populate('avatar');
    },

    async findByPermission({ permissions, blockId, ottPhone }) {
        const hostFilter = {};
        if (blockId) {
            hostFilter.blockIds = blockId;
        }
        if (ottPhone) {
            const otts = await this.model(MODELS.OTT.name).find({ phone: ottPhone }).select('_id');
            hostFilter.ottIds = { $in: otts.map(ott => ott._id) };
        }

        const hosts = await this.model(MODELS.HOST.name)
            .find(hostFilter)
            .select('_id')
            .then(res => res.map(host => host._id));

        const roles = await this.model(MODELS.ROLE_GROUP.name)
            .find(permissions ? { 'groups.name': { $all: permissions } } : {})
            .select('_id')
            .then(ro => ro.map(r => r._id));

        const users = await this.find({
            $or: [
                {
                    _id: { $in: hosts },
                    role: { $in: roles },
                },
                {
                    role: USER_ROLES.ADMIN,
                },
            ],
        })
            .select('_id')
            .then(res => res.map(host => host._id));

        return users;
    },

    async getEngineId() {
        const user = await this.findOne({ username: USER_BOT.ENGINE });
        return user && user._id;
    },
};

const ModalUser = mongoose.model(MODELS.USER.name, UserSchema, MODELS.USER.collection);

ModalUser.create({
    username: USER_BOT.ENGINE,
    name: 'Cozrum Engine',
    isBot: true,
}).catch(() => {});

module.exports = ModalUser;
