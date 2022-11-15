const { definitions, SCHEMA$REF } = require('./def');
const { loadPaths } = require('../utils');

function loadDoc() {
    return {
        swagger: '2.0',
        info: {
            title: 'CMS',
            version: '1',
            description: `Response format: ${SCHEMA$REF.RESPONSE}`,
        },
        basePath: '/api/v1',
        consumes: ['application/json'],
        produces: ['application/json'],
        security: [
            {
                JWT: [],
            },
        ],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'x-access-token',
            },
        },
        paths: loadPaths(__dirname),
        definitions,
    };
}

module.exports = loadDoc();
