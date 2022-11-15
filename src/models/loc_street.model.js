// const _ = require('lodash');
const mongoose = require('mongoose');
// const { getAlias, getSlug } = require('@utils/generate');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        districtId: { type: Number, ref: MODELS.LOC_DISTRICT.name, required: true, index: true },
        name: { type: String, required: true },
        slug: { type: String, unique: true, required: true },
        alias: String,
        description: String,
        // createdBy: { type: Schema.Types.ObjectId, ref: MODELS.USER.name },
    },
    {
        timestamps: false,
        versionKey: false,
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    },
);

// ModelSchema.pre('save', function (next) {
//     if (this.isModified('name')) {
//         this.alias = getAlias(this.name);
//         this.slug = getSlug(this.name);
//     }
//     next();
// });

ModelSchema.statics = {};

module.exports = mongoose.model(MODELS.LOC_STREET.name, ModelSchema, MODELS.LOC_STREET.collection);
