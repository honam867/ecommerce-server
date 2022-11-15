const mongoose = require('mongoose');
// const _ = require('lodash');
const MODELS = require('./const');

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        parent: { type: ObjectId, ref: MODELS.RESOURCE_FILE.name },
        resource: {
            type: String,
            ref: MODELS.RESOURCE_UPLOADING.name,
        },
        isFolder: { type: Boolean, default: false },
        createdBy: { type: ObjectId, ref: MODELS.USER.name },
        deletedBy: { type: ObjectId, ref: MODELS.USER.name },
        deleted: { type: Boolean, default: false },
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

Schema.path('parent').validate(function (value) {
    return !value || !this._id.equals(value);
}, `Parent can't is itself`);

Schema.virtual('children', {
    ref: MODELS.RESOURCE_FILE.name,
    localField: '_id',
    foreignField: 'parent',
});

Schema.pre('save', function (next) {
    this.isFolder = !this.resource;
    next();
});

Schema.index({ parent: 1 });

Schema.statics = {
    async findOrCreate(query) {
        return (await this.findOne(query)) || (await this.create(query));
    },
};

module.exports = mongoose.model(MODELS.RESOURCE_FILE.name, Schema, MODELS.RESOURCE_FILE.collection);
