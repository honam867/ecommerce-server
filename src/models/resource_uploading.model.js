const mongoose = require('mongoose');
const _ = require('lodash');
const { URL_CONFIG, UPLOAD_CONFIG } = require('@config/setting');
const { checkExists } = require('@utils/fs');
const MODELS = require('./const');

const ImageSchema = new mongoose.Schema(
    {
        _id: { type: String },
        path: String,
        originPath: String,
        screen: [String],
        screenWidth: [Number],
        originWidth: Number,
        originHeight: Number,
        originName: String,
        originSize: Number,
        mimetype: {
            type: String,
            // enum: ['image/png', 'image/jpeg', 'video/mp4'],
        },
    },
    {
        timestamps: {
            updatedAt: false,
        },
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        versionKey: false,
        id: false,
    },
);

ImageSchema.virtual('url').get(function () {
    const urls = {
        origin: URL_CONFIG.STATIC + (this.originPath || this.path),
    };
    _.forEach(this.screen, key => {
        urls[key] = `${URL_CONFIG.STATIC}${key}/${this.path}`;
    });
    return urls;
});
ImageSchema.virtual('ratio').get(function () {
    return +Number(this.originWidth / this.originHeight).toFixed(2);
});

ImageSchema.methods = {
    getRelativePath() {
        return `${UPLOAD_CONFIG.FOLDER}/${this.originPath || this.path}`;
    },
    async getExistsRelativePath(sizes) {
        if (sizes && sizes.length === 0) return false;

        const dirPath = `${UPLOAD_CONFIG.FOLDER}/${sizes ? `${_.last(sizes)}/` : ''}${
            sizes ? this.path : this.originPath || this.path
        }`;
        const exists = await checkExists(dirPath);
        if (exists) return dirPath;

        if (sizes) sizes.pop();
        return this.getExistsRelativePath(sizes || this.screen);
    },
};

module.exports = mongoose.model(MODELS.RESOURCE_UPLOADING.name, ImageSchema, MODELS.RESOURCE_UPLOADING.collection);
