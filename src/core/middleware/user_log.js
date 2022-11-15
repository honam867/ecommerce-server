const _ = require('lodash');
const isBase64 = require('is-base64');
const model = require('@models');

function getActivity(req) {
    const url = req.baseUrl;
    const activityMethods = req.app.get('activityMethods');
    return activityMethods[url];
}

function getLogType(req) {
    const types = getActivity(req);
    if (types) {
        const { pathname } = req._parsedUrl;

        const acType = _.keys(types).find(type => {
            const { method = 'POST', key, exact } = types[type];
            if (key.includes('{id}')) {
                const paths = pathname.split('/');
                const trans = key
                    .split('/')
                    .map((k, i) => (k === '{id}' ? paths[i] : k))
                    .join('/');
                return req.method === method && trans === pathname;
            }

            return req.method === method && (exact ? pathname === key : pathname.includes(key));
        });

        return acType;
    }
}

function removeBase64InJSON(json) {
    _.forOwn(json, (value, key) => {
        if (!value || !Object.prototype.hasOwnProperty.call(value, key)) return;
        if (typeof value === 'string' && isBase64(value, { mimeRequired: true, allowEmpty: false })) {
            json[key] = 'base64';
        } else if (typeof value === 'object') {
            json[key] = removeBase64InJSON(value);
        }
    });

    return json;
}

module.exports = function (req, res, next) {
    if (req.method === 'GET' || !req.decoded) return next();

    const oldWrite = res.send;
    const chunks = [];

    res.send = function (chunk, ...args) {
        if (typeof chunk === 'object' && !(chunk instanceof Buffer)) chunk = JSON.stringify(chunk);

        chunks.push(Buffer.from(chunk));
        oldWrite.apply(res, [chunk, ...args]);
    };

    res.on('finish', () => {
        try {
            const logType = getLogType(req);
            if (!logType) return;

            const body = Buffer.concat(chunks).toString('utf8');
            const responseData = JSON.parse(body);
            if (responseData && responseData.error_code) return;

            const data = JSON.stringify(removeBase64InJSON(req.body));

            model.USER_LOG.addLog(
                _.get(req, 'decoded.user.username'),
                req.method,
                req.originalUrl,
                data,
                logType,
                responseData,
            );
        } catch (err) {
            console.log('TCL: err', err);
        }
    });
    next();
};
