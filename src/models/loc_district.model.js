const _ = require('lodash');
const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        id: { type: Number, unique: true },
        provinceId: { type: Number, ref: MODELS.LOC_PROVINCE.name },
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

function replacePrefix(text, prefix) {
    prefix.forEach(k => {
        text = _.replace(text, new RegExp(k, 'i'), '').trim();
    });
    return text;
}

ModelSchema.virtual('wards', {
    ref: MODELS.LOC_WARD.name,
    localField: '_id',
    foreignField: 'districtId',
});

ModelSchema.statics = {
    async findByName(name, provinceId) {
        try {
            let formatedName = replacePrefix(name, ['quận', 'huyện']);
            if (+formatedName) {
                formatedName = name;
            }
            const district = await this.findOne({ provinceId, name: new RegExp(formatedName, 'i') });
            return district;
        } catch {
            return undefined;
        }
    },
};

module.exports = mongoose.model(MODELS.LOC_DISTRICT.name, ModelSchema, MODELS.LOC_DISTRICT.collection);
