const _ = require('lodash');
const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        id: { type: Number, unique: true },
        countryId: { type: Number, ref: MODELS.LOC_COUNTRY.name },
        name: String,
        alias: String,
        code: String,
        description: String,
        slug: { type: String, unique: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: [Number],
        },
        boundaries: {
            type: {
                type: String,
                enum: ['Polygon'],
            },
            coordinates: [[[Number, Number]]],
        },
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

ModelSchema.index({
    location: '2dsphere',
});
ModelSchema.index({
    boundaries: '2dsphere',
});

ModelSchema.virtual('districts', {
    ref: MODELS.LOC_DISTRICT.name,
    localField: '_id',
    foreignField: 'provinceId',
});

ModelSchema.statics = {
    async findByName(name, countryId) {
        try {
            const keyWords = ['tỉnh', 'thành phố'];
            keyWords.forEach(k => {
                name = _.replace(name, new RegExp(k, 'i'), '').trim();
            });
            const doc = await this.findOne({ name: new RegExp(name, 'i'), countryId });
            return doc;
        } catch {
            return undefined;
        }
    },
};

module.exports = mongoose.model(MODELS.LOC_PROVINCE.name, ModelSchema, MODELS.LOC_PROVINCE.collection);
