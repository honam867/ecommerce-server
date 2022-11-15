const sharp = require('sharp');
const { logger } = require('./logger');

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const QUALITY = 75; // 75%

async function compressImage(fileData, dpath) {
    try {
        const image = sharp(fileData.data);
        const meta = await image.metadata();

        if (meta.width > MAX_WIDTH) {
            image.resize({
                width: MAX_WIDTH,
            });
        }
        if (meta.height > MAX_HEIGHT) {
            image.resize({
                height: MAX_HEIGHT,
            });
        }

        const nameWithoutExt = fileData.name.replace(/\.[a-zA-z]+$/, '');
        const newName = `${nameWithoutExt}.jpg`;

        await image
            .jpeg({
                quality: QUALITY,
            })
            .toFile(`${dpath}/${newName}`);
        return newName;
    } catch (e) {
        logger.error(e);
    }
}

module.exports = {
    compressImage,
};
