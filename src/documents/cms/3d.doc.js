const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['3D'];

const docs = {
    '/vr': {
        get: {
            tags: TAG,
            parameters: [
                {
                    in: 'query',
                    name: 'start',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'limit',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'searchKey',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'blocks',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'roomTypes',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'status',
                    type: 'number',
                    enum: [0, 1, 2, 3],
                },
                {
                    in: 'query',
                    name: 'propertyType',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'createTime',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'camera',
                    type: 'string',
                },
            ],
            operationId: 'get3DList',
            summary: 'Danh sách 3d',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.VR,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
};

module.exports = docs;
