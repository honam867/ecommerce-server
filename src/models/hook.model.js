const mongoose = require('mongoose');
const MODELS = require('./const');

const { Schema } = mongoose;

const HookSchema = new Schema(
    {
        from: { type: String, enum: ['mail'], default: 'mail' },
        done: { type: Boolean, default: false },
        data: Schema.Types.Mixed,
    },
    { timestamps: true },
);

module.exports = mongoose.model(MODELS.HOOK.name, HookSchema, MODELS.HOOK.collection);
