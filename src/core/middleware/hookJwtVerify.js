const jwt = require('jsonwebtoken');
const config = require('@config/setting');
const { logger } = require('@utils/logger');
const ThrowReturn = require('../throwreturn');

module.exports = function (req, res, next) {
    const token = req.headers['x-access-token'] || req.query['x-access-token'];

    jwt.verify(token, config.HOOK_CONFIG.SECRET_KEY, (err, decoded) => {
        if (err) {
            logger.error(err);
            throw new ThrowReturn().status(401);
        }
        req.decoded = decoded;
        next();
    });
};
