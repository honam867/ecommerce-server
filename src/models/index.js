const mongoose = require('mongoose');
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
// const { logger } = require('@utils/logger');
require('@utils/mongoose');
const MODELS = require('./const');

function loadModels(folder) {
    // all models
    function models(MODEL, ...args) {
        return mongoose.model(typeof MODEL === 'string' ? MODEL : MODEL.name, ...args);
    }

    const baseFolder = path.join(__dirname, folder);
    const modelFiles = glob(`${baseFolder}/**/*.model.js`, {
        sync: true,
        matchBase: true,
    });

    modelFiles.forEach(modelFile => {
        // const relativePath = path.relative(baseFolder, modelFile);
        const loadedModel = require(modelFile);
        models[loadedModel.modelName] = loadedModel;
        // logger.info(`loading model ${loadedModel.modelName} -> ${relativePath}`);
    });

    _.forEach(MODELS, (v, k) => {
        models[k] = models(v);
    });

    return models;
}

module.exports = loadModels('.');
