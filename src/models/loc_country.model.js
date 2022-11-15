const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        id: { type: Number, unique: true },
        name: String,
        code: String,
        description: String,
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

ModelSchema.statics = {
    async findByName(name) {
        try {
            const doc = await this.findOne({ name: new RegExp(name, 'i') });
            return doc;
        } catch {
            return undefined;
        }
    },
};

module.exports = mongoose.model(MODELS.LOC_COUNTRY.name, ModelSchema, MODELS.LOC_COUNTRY.collection);
