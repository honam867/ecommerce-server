const _ = require('lodash');
const models = require('@models');
const { TYPE_UI } = require('@utils/UIconst');
// const validate = require('@utils/validate');

async function getBanners(req, res) {
    const banners = await models.UI_CLIENT.find({ type: TYPE_UI.BANNER, active: true }).populate([
        { path: 'cover' },
        { path: 'icon' },
    ]);

    res.sendData({ banners });
}

async function getHomePages(req, res) {
    let { propertyType } = req.query;
    propertyType = parseInt(propertyType);

    const query = {
        type: { $in: [TYPE_UI.HOME_PAGE_INFO, TYPE_UI.HOME_PAGE_LOCATION] },
        active: true,
    };
    if (_.isNaN(propertyType)) {
        const doc = await models.BLOCK_TYPE.findOne({ slug: req.query.propertyType });
        query.propertyType = doc && doc.id;
    } else {
        query.propertyType = propertyType;
    }

    const pages = await models.UI_CLIENT.find(query).populate([{ path: 'cover' }, { path: 'icon' }]);

    res.sendData({ pages });
}

module.exports = {
    getBanners,
    getHomePages,
};
