const _ = require('lodash');
const { ONE_MINUTE } = require('@utils/const');

const USER_IPS = {};
const TIME_DELAY = ONE_MINUTE * 5;

async function updateViewCount(req, Model, ids) {
    // console.log(Model.collection.collectionName);
    if (!ids || !ids.length) return;

    // const lastUpdated = _.get(USER_IPS, [req.clientIP, 'lastUpdated']);
    const now = new Date();

    // if (lastUpdated && now.getTime() - lastUpdated < TIME_DELAY) {
    //     return;
    // }

    // _.set(lastUpdated, [req.clientIP, 'lastUpdated'], now.getTime());
    await Model.updateMany({ id: { $in: ids } }, { $inc: { view: 1 }, $set: { updatedAt: now } });
}

module.exports = {
    updateViewCount,
};
