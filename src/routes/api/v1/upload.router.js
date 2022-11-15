const _ = require('lodash');
const router = require('@core/router').Router();
const controller = require('@controllers/resource/upload');

async function uploadCompress(req, res) {
    req.setTimeout(0);
    res.setHeader('Cache-Control', 'no-cache');

    const resources = await controller.upload(_.flatten(_.values(req.files)));

    res.sendData({ resources });
}

async function uploadOrigin(req, res) {
    req.setTimeout(0);
    res.setHeader('Cache-Control', 'no-cache');

    const resources = await controller.uploadOrigin(_.flatten(_.values(req.files)));

    res.sendData({ resources });
}

router.postS('/', uploadCompress);
router.postS('/origin', uploadOrigin);

module.exports = { router };
