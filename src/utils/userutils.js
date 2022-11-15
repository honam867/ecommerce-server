const crypto = require('crypto');
const setting = require('@config/setting');

const PasswordChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function md5Password(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function hashPassword(password) {
    return crypto.createHmac('sha256', setting.JWT_CONFIG.SECRET_KEY).update(password).digest('hex');
}

function validatePassword(password) {
    return true;
}

function generatePassword(length = 10) {
    let text = '';
    for (let i = 0; i < length; i++) {
        text += PasswordChars.charAt(Math.floor(Math.random() * PasswordChars.length));
    }
    return text;
}

module.exports = {
    hashPassword,
    validatePassword,
    generatePassword,
    md5Password,
};
