const _ = require('lodash');
const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        id: { type: Number, unique: true },
        districtId: { type: Number, ref: MODELS.LOC_DISTRICT.name },
        name: String,
        code: String,
        alias: String,
        prefix: String,
        slug: { type: String, unique: true },
        description: String,
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

ModelSchema.virtual('fullName').get(function () {
    return `${this.prefix ? `${this.prefix} ` : ''}${this.name}`;
});

function replacePrefix(text, prefix) {
    prefix.forEach(k => {
        text = _.replace(text, new RegExp(k, 'i'), '').trim();
    });
    return text;
}

ModelSchema.statics = {
    async findByName(name, districtId) {
        try {
            const keyWords = ['phường', 'xã', 'thị trấn'];
            name = _.startCase(replacePrefix(name, keyWords));
            const ward = await this.findOne({ districtId, name });
            return ward;
        } catch {
            return undefined;
        }
    },
};

module.exports = mongoose.model(MODELS.LOC_WARD.name, ModelSchema, MODELS.LOC_WARD.collection);
