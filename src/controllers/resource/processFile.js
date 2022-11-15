// require('module-alias/register');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const { UPLOAD_CONFIG } = require('../../../config/setting.production');
const { createFolder } = require('../../utils/fs');

sharp.cache({ files: 0 });

const SIZE = [
    {
        width: 130,
        name: 'small',
    },
    {
        width: 600,
        name: 'medium',
    },
    {
        width: 1024,
        name: 'large',
    },
    {
        width: 1440,
        name: 'x_large',
    },
];
const SIZE_EXT = [
    {
        width: 180,
        name: 'small',
    },
    {
        width: 650,
        name: 'medium',
    },
    {
        width: 1280,
        name: 'large',
    },
    {
        width: 1600,
        name: 'x_large',
    },
];

const MAX_SIZE = 1200;
const MAX_SIZE_EXT = 1400;
const RATIO_THRESHOLD_EXT = 1.7;
// const MAX_IMAGE_FILE_SIZE_MB = 50;
// const MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;
const QUALITY = 80;

async function processFile(filePath, folder, fileName) {
    try {
        const image = sharp(filePath);
        const meta = await image.metadata();
        if (meta.format === 'svg') {
            return {};
        }

        const jpegImage = image.jpeg({
            quality: QUALITY,
        });
        const ratio = meta.width / meta.height;
        const maxSize = ratio >= RATIO_THRESHOLD_EXT ? MAX_SIZE_EXT : MAX_SIZE;
        const size = ratio >= RATIO_THRESHOLD_EXT ? SIZE_EXT : SIZE;

        const defaultImg = jpegImage.clone();
        if (meta.width > maxSize) {
            defaultImg.resize({
                width: maxSize,
            });
        }
        const originDir = path.resolve(`${UPLOAD_CONFIG.FOLDER}/${folder}`);
        await createFolder(originDir);
        await defaultImg.toFile(`${originDir}/${fileName}.jpg`);

        await Promise.all(
            size.map(async s => {
                const dir = path.resolve(`${UPLOAD_CONFIG.FOLDER}/${s.name}/${folder}`);
                await createFolder(dir);
                return jpegImage
                    .clone()
                    .resize({
                        width: s.width,
                    })
                    .toFile(`${dir}/${fileName}.jpg`);
            }),
        );

        return {
            meta,
            supportedSize: size,
        };
    } catch (e) {
        console.error('processFile error', filePath, fileName, e);
        return {};
    }
}

async function processFiles({ files, keepOriginFile }) {
    files = files || [];
    const today = moment();
    const folder = `${today.format('Y-MM')}/${today.format('DD')}`;

    const resources = await Promise.all(
        files.map(async file => {
            let dirPath;
            let originPath;
            let uid = uuid();
            let { mimetype } = file;
            let filePath = file.tempFilePath;
            let fileName = _.split(file.name, '?')[0];
            let fileSize = file.size;

            let { meta, supportedSize } = await processFile(filePath, folder, uid);

            if (meta) {
                dirPath = `${folder}/${uid}.jpg`;
                mimetype = 'image/jpeg';
                if (keepOriginFile) {
                    originPath = `${folder}/${uuid()}${path.extname(fileName)}`;
                }
            } else {
                dirPath = `${folder}/${uid}${path.extname(fileName)}`;
                originPath = dirPath;
                keepOriginFile = true;
            }

            if (keepOriginFile) {
                const destination = `${UPLOAD_CONFIG.FOLDER}/${originPath}`;
                if (typeof file.mv === 'function') await file.mv(destination);
                else {
                    await createFolder(`${UPLOAD_CONFIG.FOLDER}/${folder}`);
                    if (typeof filePath === 'string') {
                        await fs.promises.copyFile(filePath, destination);
                    } else {
                        await fs.promises.writeFile(destination, filePath);
                    }
                }
            }

            return {
                _id: uid,
                path: dirPath,
                originPath,
                screen: _.map(supportedSize, 'name'),
                screenWidth: _.map(supportedSize, 'width'),
                originWidth: _.get(meta, 'width'),
                originHeight: _.get(meta, 'height'),
                originName: fileName,
                originSize: fileSize,
                mimetype,
            };
        }),
    )
        .catch(e => {
            console.error(e);
            throw new Error(e);
        })
        .finally(() => {
            files.forEach(file => {
                if (typeof file.tempFilePath === 'string') {
                    fs.unlink(file.tempFilePath, () => {});
                }
            });
        });

    return resources;
}

process.on('message', async data => {
    const result = await processFiles(data);
    process.send(result);
});

process.on('exit', code => {
    console.log(`Exit processCheckImage ${code}`);
});
