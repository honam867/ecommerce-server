const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Location'];

const docs = {
    '/': {
        get: {
            tags: TAG,
            parameters: [
                {
                    in: 'query',
                    name: 'lat',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'lng',
                    type: 'number',
                },
            ],
            operationId: 'getGeolocation',
            summary: 'lấy thông tin vị trí qua ip',
            responses: responses({
                type: 'object',
                properties: {
                    lng: {
                        type: 'number',
                    },
                    lat: {
                        type: 'number',
                    },
                    province: {
                        $ref: SCHEMA$REF.PROVINCE,
                    },
                },
            }),
        },
    },
};

module.exports = docs;
