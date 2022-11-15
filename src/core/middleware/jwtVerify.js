const jwt = require('jsonwebtoken');
const config = require('@config/setting');
const model = require('@models');
const ThrowReturn = require('../throwreturn');

function unauthorized() {
    throw new ThrowReturn().status(401);
}

module.exports = function (req, res, next) {
    if (!req.validateToken || !config.ENVIRONMENT.REQUIRE_TOKEN) {
        return next();
    }

    const token = req.headers['x-access-token'] || req.query['x-access-token'];

    jwt.verify(token, config.JWT_CONFIG.SECRET_KEY, (err, decoded) => {
        if (err) {
            return unauthorized();
        }

        // check enable or revoke
        model.USER.findById(decoded.user && decoded.user._id)
            .then(user => {
                if (!user || !user.enable || user.revokeKey !== decoded.user.revokeKey) {
                    return unauthorized();
                }
                req.decoded = { user };
                next();
            })
            .catch(unauthorized);
    });
};
