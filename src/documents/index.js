const _ = require('lodash');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

function findDocs(dirPath) {
    return fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter(f => f.isDirectory())
        .map(file => require(`./${file.name}`))
        .filter(f => !_.isEmpty(f));
}

function useDocs(app) {
    const docs = findDocs(__dirname);

    const options = {
        explorer: true,
    };

    docs.forEach(doc => {
        app.use(
            `/api-doc/${doc.info.title.toLowerCase()}`,
            swaggerUi.serveFiles(doc, options),
            swaggerUi.setup(doc, options),
        );
    });
}

module.exports = useDocs;
