const fs = require('fs');
const fetch = require('node-fetch');
const _ = require('lodash');
const path = require('path');
const { v4: uuid } = require('uuid');
const isBase64 = require('is-base64');
const urlRegex = require('url-regex');
const piexif = require('piexifjs');

const { TMP_FOLDER } = require('@config/setting');
const { createFolder } = require('@utils/fs');

async function getFileByUrl(url, ext) {
    try {
        await createFolder(TMP_FOLDER);
        const file = await fetch(urlRegex({ exact: true }).test(url) ? url : `https:${url}`).then(
            res =>
                new Promise((resolve, reject) => {
                    const tempFilePath = path.resolve(`${TMP_FOLDER}/${uuid()}${ext || ''}`);
                    const dest = fs.createWriteStream(tempFilePath);
                    dest.on('error', e => reject(e));
                    dest.on('finish', () => {
                        resolve({
                            name: _.last(_.split(url, '/')),
                            size: res.headers.get('content-length'),
                            mimetype: res.headers.get('content-type'),
                            tempFilePath,
                        });
                    });

                    res.body.pipe(dest);
                    res.body.on('error', e => reject(e));
                }),
        );
        return file;
    } catch (e) {
        return null;
    }
}

async function getFileByBase64(inputData) {
    try {
        if (!isBase64(inputData, { allowMime: true, mimeRequired: true, allowEmpty: false })) {
            return null;
        }

        const base64Data = inputData.replace(/^data:image\/(jpeg|png);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const name = `${uuid()}.jpg`;
        const tempFilePath = path.resolve(`${TMP_FOLDER}/${name}`);

        await createFolder(TMP_FOLDER);
        await fs.promises.writeFile(tempFilePath, buffer);

        return {
            name,
            size: buffer.length,
            mimetype: 'image/jpeg',
            tempFilePath,
        };
    } catch (e) {
        return null;
    }
}

async function jpegTo360(filename, title = 'Nhà đẹp Cozrum') {
    const data = (await fs.promises.readFile(filename)).toString('binary');
    const exifObj = piexif.load(data);
    exifObj['0th'] = {
        ...exifObj['0th'],
        270: title,
        315: 'Cozrum',
        271: 'RICOH',
        272: 'RICOH THETA S',
    };
    const exifbytes = piexif.dump(exifObj);
    const newData = piexif.insert(exifbytes, data);

    const newJpeg = Buffer.from(newData, 'binary');
    await fs.promises.writeFile(filename, newJpeg);
}

module.exports = {
    // saveImages,
    getFileByUrl,
    getFileByBase64,
    jpegTo360,
};
