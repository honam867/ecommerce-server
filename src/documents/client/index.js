const { definitions, SCHEMA$REF } = require('./def');
const { loadPaths } = require('../utils');

function loadDoc() {
    return {
        swagger: '2.0',
        info: {
            title: 'Client',
            version: '1',
            description: `Response format: ${SCHEMA$REF.RESPONSE}`,
        },
        basePath: '/api/client',
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {},
        paths: loadPaths(__dirname),
        definitions,
    };
}

module.exports = loadDoc();
