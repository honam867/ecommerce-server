const jwt = require('jsonwebtoken');
const config = require('@config/setting');
const { logger } = require('@utils/logger');
const model = require('@models');
const ThrowReturn = require('../throwreturn');

function unauthorized() {
    throw new ThrowReturn().status(401);
}

module.exports = function verify(req, res, next) {
    const token = req.headers['x-access-token'] || req.query['x-access-token'];

    jwt.verify(token, config.JWT_CLIENT_CONFIG.SECRET_KEY, (err, decoded) => {
        if (err || !decoded || !decoded._id) {
            logger.error(err);
            return unauthorized(res);
        }

        // check enable or revoke
        model.GUEST_ACCOUNT.findById(decoded._id)
            .then(user => {
                if (!user || !user.active || user.revokeKey !== decoded.revokeKey) {
                    logger.error(user, decoded.revokeKey);
                    return unauthorized(res);
                }
                req.decoded = { user };
                next();
            })
            .catch(_err => {
                logger.error(_err);
                unauthorized(res);
            });
    });
};
