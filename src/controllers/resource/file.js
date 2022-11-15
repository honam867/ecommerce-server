const archiver = require('archiver');
const _ = require('lodash');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const { logger } = require('@utils/logger');
const models = require('@models');
const { upload } = require('@controllers/resource/upload');

async function getBreadCrumb(parent) {
    if (!parent) return [];

    const folder = await models.RESOURCE_FILE.findOne({
        _id: parent,
        deleted: false,
        isFolder: true,
    });
    if (folder) {
        if (folder.parent) {
            return [folder, ...(await getBreadCrumb(folder.parent))];
        }
        return [folder];
    }

    return [];
}

async function getFiles(req, res) {
    const { folder, isFolder, getBreadcrumb } = req.query;

    const query = {
        parent: folder || null,
        deleted: false,
    };
    if (isFolder) {
        query.isFolder = isFolder === 'true';
    }

    const data = await models.RESOURCE_FILE.find(query).populate('resource');
    let breadcrumb;

    if (getBreadcrumb !== 'false') {
        breadcrumb = await getBreadCrumb(folder);
        breadcrumb.reverse();
    }

    res.sendData({
        data,
        breadcrumb,
    });
}

async function createFile(req, res) {
    const { user } = req.decoded;

    const folder = await models.RESOURCE_FILE.create({ ...req.body, createdBy: user._id });

    res.sendData({
        folder,
    });
}

async function updateFile(req, res) {
    const { id } = req.params;

    const folder = await models.RESOURCE_FILE.findById(id);
    Object.assign(folder, req.body);

    await folder.save();

    res.sendData({
        folder,
    });
}

// Delete File and Folder
async function deleteWithRecursive(fileId, data) {
    const doc = await models.RESOURCE_FILE.findByIdAndUpdate(fileId, data);

    if (doc && doc.isFolder) {
        const children = await models.RESOURCE_FILE.find({ parent: doc._id });
        children.forEach(child => deleteWithRecursive(child._id, data));
    }
}

async function deleteFile(req, res) {
    const { id } = req.params;
    const { user } = req.decoded;

    await deleteWithRecursive(id, { deletedBy: user._id, deleted: true });
    res.sendData();
}

// For archive and download
async function getArchiveFiles(folderId, parent, resursive) {
    const ffs = await models.RESOURCE_FILE.find({
        deleted: false,
        parent: folderId,
    }).populate('resource');

    const files = await ffs
        .filter(f => !f.isFolder)
        .asyncMap(async file => {
            const fullPath = await file.resource.getExistsRelativePath();
            const ext = path.extname(file.resource.originName);
            return {
                fullPath,
                relativePath: `/${parent}/${file.name.replace(ext, '')}${ext}`,
            };
        });

    if (resursive && folderId) {
        const folders = ffs.filter(f => f.isFolder);
        if (folders.length) {
            const arcFiles = await folders.asyncMap(f =>
                getArchiveFiles(f._id, `${parent}/${f.name.replace(/\//g, '|')}`, resursive),
            );
            return [...files, ...arcFiles];
        }
    }

    return files;
}

async function download(req, res) {
    let { folder, fileonly } = req.query;
    folder = folder && mongoose.Types.ObjectId.isValid(folder) ? folder : null;

    const parent = folder && (await models.RESOURCE_FILE.findById(folder));

    const archive = archiver('zip', {
        zlib: { level: 9 },
    });
    archive.on('error', err => {
        res.end();
        logger.error(err);
    });
    archive.on('end', () => {
        res.end();
    });

    const files = _.flattenDeep(await getArchiveFiles(folder, parent ? parent.name : 'Root', fileonly !== 'true'));

    files.forEach(file => {
        if (!file.fullPath) return;
        const stream = fs.createReadStream(file.fullPath);
        stream.on('error', e => {
            logger.error(e);
        });
        archive.append(stream, {
            name: file.relativePath,
        });
    });

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent(parent ? parent.name : 'Root')}.zip`,
    );
    res.setHeader('Content-Type', 'application/x-zip-compressed');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept-Ranges', 'bytes');

    archive.pipe(res);
    archive.finalize();
}

// Upload folder

function saveFolder(data, parent, userId) {
    return _.entries(data).asyncMap(async ([folderName, item]) => {
        let folder;
        if (folderName) {
            folder = await models.RESOURCE_FILE.create({ name: folderName, createdBy: userId, parent });
        }
        if (!folder || !item) return;

        if (item.files) {
            const resources = await upload(_.isArray(item.files) ? item.files : [item.files], { keepOriginFile: true });
            await resources.asyncMap(r =>
                models.RESOURCE_FILE.create({
                    name: r.originName,
                    createdBy: userId,
                    parent: folder._id,
                    resource: r._id,
                }),
            );
        }

        if (item.folders) {
            return saveFolder(item.folders, folder._id, userId);
        }
    });
}

async function uploadFolder(req, res) {
    req.setTimeout(0);
    res.setHeader('Cache-Control', 'no-cache');

    const userId = req.decoded.user._id;
    const parent = mongoose.Types.ObjectId.isValid(req.body.parent) ? req.body.parent : null;

    const data = {};
    _.forEach(req.files, (files, relativePath) => {
        _.setWith(
            data,
            [...relativePath.split('////').reduce((a, c) => [...a, 'folders', c], []), 'files'],
            files,
            Object,
        );
    });

    if (data.folders) {
        await saveFolder(data.folders, parent, userId);
    }

    res.sendData();
}

async function uploadFile(req, res) {
    req.setTimeout(0);
    res.setHeader('Cache-Control', 'no-cache');

    const resources = await upload(_.flatten(_.values(req.files)), { keepOriginFile: true });

    res.sendData({ resources });
}

async function createFolderByProperty({ blockId, roomTypeId, resources }) {
    const home = await models.BLOCK.findById(blockId).populate('provinceId districtId wardId');
    if (!home || !home.wardId || !home.provinceId || !home.districtId) return;

    const FOLDER_CRAWLER = 'Crawler';

    const crawlerFolder = await models.RESOURCE_FILE.findOrCreate({
        name: FOLDER_CRAWLER,
        parent: null,
        isFolder: true,
    });
    const provinceFolder = await models.RESOURCE_FILE.findOrCreate({
        name: home.provinceId.name,
        parent: crawlerFolder._id,
        isFolder: true,
    });
    const disctrictFolder = await models.RESOURCE_FILE.findOrCreate({
        name: home.districtId.name,
        parent: provinceFolder._id,
        isFolder: true,
    });
    const wardFolder = await models.RESOURCE_FILE.findOrCreate({
        name: home.wardId.fullName,
        parent: disctrictFolder._id,
        isFolder: true,
    });
    const address = _.get(home, 'address.vi');
    const homeFolderName = (address && _.split(address, ',')[0]) || home.name;

    const homeFolder = await models.RESOURCE_FILE.findOrCreate({
        name: homeFolderName,
        parent: wardFolder._id,
        isFolder: true,
    });

    let parent = homeFolder._id;
    if (roomTypeId) {
        const roomType = await models.ROOM_TYPE.findById(roomTypeId).select('name images videos');
        if (roomType) {
            const roomFolder = await models.RESOURCE_FILE.findOrCreate({
                name: roomType.name,
                parent: homeFolder._id,
                isFolder: true,
            });
            parent = roomFolder._id;
        }
    }

    await resources.asyncMap(resource =>
        models.RESOURCE_FILE.findOrCreate({
            resource: resource._id,
            name: resource.originName,
            parent,
        }),
    );
}

module.exports = {
    getFiles,
    createFile,
    updateFile,
    deleteFile,
    download,
    uploadFolder,
    uploadFile,
    createFolderByProperty,
};
