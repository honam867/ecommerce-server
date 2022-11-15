module.exports = function (uri, params) {
    params = params || {};

    const appends = Object.keys(params)
        .filter(k => params[k])
        .map(key => `${key}=${encodeURIComponent(params[key])}`);

    return `${uri}?${appends.join('&')}`;
};
