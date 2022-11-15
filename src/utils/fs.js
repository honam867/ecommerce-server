const fs = require('fs');
const path = require('path');

function checkExists(dir) {
    return fs.promises
        .access(dir, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

async function createFolder(dir) {
    dir = path.resolve(dir);

    const isExists = await checkExists(dir);
    if (!isExists) {
        await fs.promises.mkdir(dir, { recursive: true });
    }

    return dir;
}

module.exports = {
    createFolder,
    checkExists,
};
