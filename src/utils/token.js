const jwt = require('jsonwebtoken');
const setting = require('@config/setting');

function signToken(data) {
    return jwt.sign(data, setting.JWT_CONFIG.SECRET_KEY, {
        expiresIn: setting.JWT_CONFIG.EXPIRE,
    });
}

function validToken(token) {
    return jwt.verify(token, setting.JWT_CONFIG.SECRET_KEY);
}

module.exports = {
    signToken,
    validToken,
};
