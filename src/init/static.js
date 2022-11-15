const express = require('express');
const { SERVER_CONFIG } = require('@config/setting');
const useDocs = require('../documents');

function initStatic({ app }) {
    useDocs(app);

    // set static folder
    app.use(SERVER_CONFIG.STATIC.URI, express.static(SERVER_CONFIG.STATIC.PATH, SERVER_CONFIG.STATIC.OPTIONS));
    // fallback url
    app.use('*', (req, res) => res.status(404).json({ error_code: 1, error_msg: 'Resource not found!' }));
}

module.exports = initStatic;
