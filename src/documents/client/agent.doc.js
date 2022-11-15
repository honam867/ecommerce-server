const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Agent'];

const docs = {
    '/3dUrl/{id}': {
        get: {
            tags: TAG,
            operationId: 'getAgent3dUrl',
            summary: 'Thông tin url 3d',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                    require: true,
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.URL_3D,
            }),
        },
    },
};

module.exports = docs;
