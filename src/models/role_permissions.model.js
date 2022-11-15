const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const Methods = ['POST', 'GET', 'PUT', 'DELETE', '*'];
const Actions = ['allow', 'deny'];

const RolePermissionsSchema = new Schema({
    name: { type: String, unique: true, index: true },
    permissions: [
        {
            resource: String,
            methods: [{ type: String, require: true, enum: Methods }],
            action: { type: String, require: true, enum: Actions },
            subRoutes: [
                {
                    resource: String,
                    methods: [{ type: String, require: true, enum: Methods }],
                    action: { type: String, require: true, enum: Actions },
                },
            ],
            prefix: String,
        },
    ],
    description: String,
});

module.exports = mongoose.model(MODELS.ROLE_PERMISSION.name, RolePermissionsSchema, MODELS.ROLE_PERMISSION.collection);
