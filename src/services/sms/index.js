const { customAlphabet } = require('nanoid');

async function sendSMS(phone, text) {
    return true;
}

function generateCode(length = 4) {
    return customAlphabet('0123456789', length)();
}

module.exports = {
    sendSMS,
    generateCode,
};
