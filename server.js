require('module-alias/register');
require('gf-js');
require('dnscache')({
    enable: true,
    ttl: 300,
    cachesize: 1000,
});
require('./src/utils/ext');

global.isDev = process.env.NODE_ENV !== 'production';

const initExpress = require('./src/init/express');
const initStatic = require('./src/init/static');
const { initDB } = require('./src/init/db');
const initRouter = require('./src/init/router');

(async function init() {
    const express = initExpress();
    await initDB(express);
    initRouter(express);
    initStatic(express);
})();
