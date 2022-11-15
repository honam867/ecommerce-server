const _ = require('lodash');
const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserGroupSchema = new Schema(
    {
        name: { type: String, unique: true },
        member: Number,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: {
            type: ObjectId,
            ref: MODELS.USER.name,
        },
        createdBy: {
            type: ObjectId,
            ref: MODELS.USER.name,
        },
        users: [
            {
                _id: false,
                userId: {
                    type: ObjectId,
                    ref: MODELS.USER.name,
                },
                joinAt: { type: Date, default: () => new Date() },
                acceptedBy: {
                    type: ObjectId,
                    ref: MODELS.USER.name,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

UserGroupSchema.pre('save', function (next) {
    if (this.users) {
        this.member = this.users.length;
    }
    next();
});

UserGroupSchema.statics = {
    getSameGroupUsers(userId) {
        return this.aggregate()
            .match({ 'users.userId': userId })
            .unwind('$users')
            .group({ _id: null, users: { $addToSet: '$users.userId' } })
            .then(rs => _.get(rs, [0, 'users'], []));
    },
};

module.exports = mongoose.model(MODELS.USER_GROUP.name, UserGroupSchema, MODELS.USER_GROUP.collection);
