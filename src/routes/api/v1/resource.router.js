const router = require('@core/router').Router();
const file = require('@controllers/resource/file');

router.getS('/file', file.getFiles);
router.getS('/file/download', file.download);

router.postS('/file', file.createFile);
router.postS('/file/upload', file.uploadFile);
router.postS('/file/uploaddir', file.uploadFolder);

router.putS('/file/:id', file.updateFile);
router.deleteS('/file/:id', file.deleteFile);

const activity = {
    RESOURCE_FILE_CREATE: {
        key: '/file',
        exact: true,
    },
    RESOURCE_FILE_UPDATE: {
        key: 'file/{id}',
        method: 'PUT',
    },
    RESOURCE_FILE_DELETE: {
        key: 'file/{id}',
        method: 'DELETE',
    },
    RESOURCE_FOLDER_UPLOAD: {
        key: '/file/uploaddir',
        exact: true,
    },
};

module.exports = { router, activity };
