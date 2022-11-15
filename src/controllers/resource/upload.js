const path = require('path');
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const sharp = require('sharp');
const fs = require('fs');

const { UPLOAD_CONFIG } = require('@config/setting');
const { logger } = require('@utils/logger');
const { fork } = require('@utils/childProcess');
const ThrowReturn = require('@core/throwreturn');
const models = require('@models');

sharp.cache({ files: 0 });

const MAX_IMAGE_FILE_SIZE = UPLOAD_CONFIG.MAX_IMAGE_SIZE * 1024 * 1024;

function isImage(file) {
    return file.mimetype.includes('image');
}

function validateFiles(files) {
    const notValidSize = files.some(file => isImage(file) && file.size > MAX_IMAGE_FILE_SIZE);
    if (notValidSize) {
        files.forEach(file => {
            fs.unlink(file.tempFilePath, () => {});
        });
        throw new ThrowReturn(`Kích thước ảnh không được vượt quá ${UPLOAD_CONFIG.MAX_IMAGE_SIZE}MB!`);
    }
}

async function upload(files, { keepOriginFile = false } = {}) {
    files = files || [];
    validateFiles(files);

    const filePath = path.resolve(__dirname, 'processFile.js');
    const resources = await fork(filePath, { files, keepOriginFile });

    return resources.asyncMap(resource => models.RESOURCE_UPLOADING.create(resource));
}

async function uploadOrigin(files) {
    files = files || [];
    const today = moment();
    const folder = `${today.format('Y-MM')}/${today.format('DD')}`;

    validateFiles(files);

    const resources = await files
        .asyncMap(async file => {
            let uid = uuid();
            let { mimetype } = file;
            let filePath = file.tempFilePath;
            let fileName = file.name;
            let fileSize = file.size;

            const meta = await sharp(filePath).metadata();

            const dirPath = `${folder}/${uid}${path.extname(fileName)}`;
            await file.mv(`${UPLOAD_CONFIG.FOLDER}/${dirPath}`);

            return models.RESOURCE_UPLOADING.create({
                _id: uid,
                path: dirPath,
                originPath: dirPath,
                originWidth: _.get(meta, 'width'),
                originHeight: _.get(meta, 'height'),
                originName: fileName,
                originSize: fileSize,
                mimetype,
            });
        })
        .catch(e => {
            logger.error(e);
            throw new ThrowReturn(e);
        });

    return resources;
}

module.exports = { upload, uploadOrigin };
