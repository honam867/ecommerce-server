const mongoose = require('mongoose');
const { TYPE_UI } = require('@utils/UIconst');
const MODELS = require('./const');

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const UISchema = new Schema(
    {
        title: Mixed,
        subTitle: Mixed,
        link: String,
        params: Mixed,
        cover: {
            type: String,
            ref: MODELS.RESOURCE_UPLOADING.name,
        },
        icon: {
            type: String,
            ref: MODELS.RESOURCE_UPLOADING.name,
        },
        type: {
            type: String,
            enum: TYPE_UI,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(MODELS.UI_CLIENT.name, UISchema, MODELS.UI_CLIENT.collection);
