const jwt = require('jsonwebtoken');
const _ = require('lodash');
const isbot = require('isbot');

const config = require('@config/setting');
const models = require('@models');

isbot.exclude(['cozrum-mobile-app']);

function checkToken(req) {
    const token = req.headers['x-access-token'] || req.query['x-access-token'];
    if (!token) return null;

    return new Promise(rs => {
        jwt.verify(token, config.JWT_CLIENT_CONFIG.SECRET_KEY, (err, decoded) => {
            if (err || !decoded || !decoded._id) {
                rs();
            }

            models.GUEST_ACCOUNT.findById(decoded._id)
                .then(user => {
                    if (user && user.active) {
                        rs(user);
                    } else rs();
                })
                .catch(() => rs());
        });
    });
}

function needNewGuest(req) {
    const baseAccept = ['/api/client/property', '/api/client/web', '/api/client/user'];
    if (!baseAccept.includes(req.baseUrl)) return false;

    const accepted = ['/room', '/room/:slug', '/', '/:slug', '/url/resolver', '/session'];
    return accepted.includes(req.route.path);
}

async function checkClientKey(req, res) {
    let clientKey = req.cookies.anonymous_id || req.headers['client-key'];
    let guest = clientKey && (await models.GUEST.findOne({ clientKey }));

    if (!guest && needNewGuest(req)) {
        const fields = ['name', 'phone', 'email', 'gender', 'passportNumber', 'dayOfBirth', 'momoId'];
        guest = await models.GUEST.createAnonymous({
            ..._.pick(req.body, fields),
            ip: req.clientIp,
        });
    }
    if (guest) {
        res.cookie('anonymous_id', guest.clientKey, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 360, // 360 day
        });
    }

    return guest;
}

module.exports = function verify(req, res, next) {
    req.decoded = req.decoded || {};

    if (isbot(req.get('user-agent'))) {
        return next();
    }

    // console.log(req.baseUrl, req.headers, req.cookies);

    Promise.all([checkToken(req, res), checkClientKey(req, res)]).then(([user, guest]) => {
        if (user) _.set(req, 'decoded.user', user);
        if (guest) _.set(req, 'decoded.guest', guest);
        next();
    });
};
