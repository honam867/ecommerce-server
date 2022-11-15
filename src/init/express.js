const cors = require('cors');
const log4js = require('log4js');
const express = require('express');
const device = require('express-device');
const fileUpload = require('express-fileupload');
const httpLib = require('http');
const compression = require('compression');
const helmet = require('helmet');
const _ = require('lodash');
const cookieParser = require('cookie-parser');

const config = require('@config/setting');
const { logger } = require('@utils/logger');
const { LANGUAGE } = require('@utils/const');

const { SERVER_CONFIG } = config;

function captureIP() {
    return (req, res, next) => {
        req.clientIp =
            req.headers['x-client-ip'] || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;

        const lang = req.headers.lang || req.query.lang || req.body.lang;
        req.language = _.values(LANGUAGE).includes(lang) ? lang : LANGUAGE.VI;

        next();
    };
}

function initExpress() {
    const app = express();

    // start server
    const server = httpLib.createServer(app);
    server.listen(SERVER_CONFIG.PORT);
    logger.info('Server is running at port:', SERVER_CONFIG.PORT);

    app.use(helmet());
    app.use(cors({ exposedHeaders: 'Content-Disposition' }));
    app.use(express.json({ limit: '50mb', extended: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(device.capture());
    app.use(compression());
    app.use(fileUpload(config.UPLOAD_CONFIG.OPTIONS));
    app.use(captureIP());

    // logger middleware
    app.use(
        log4js.connectLogger(logger, {
            level: log4js.levels.INFO,
            nolog: ['otaHeader?', '/v1/chat/', '/v1/events', SERVER_CONFIG.STATIC.URI],
        }),
    );

    return {
        app,
        server,
    };
}

module.exports = initExpress;
