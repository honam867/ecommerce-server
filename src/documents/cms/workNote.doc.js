const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['WorkNote'];

const docs = {
    '/': {
        get: {
            tags: TAG,
            operationId: 'getNotes',
            summary: 'Danh sách note',
            parameters: [
                {
                    in: 'query',
                    name: 'blockId',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'roomTypeId',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'status',
                    type: 'string',
                },
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
                    name: 'from',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'to',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.WORK_NOTE,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
        post: {
            tags: TAG,
            operationId: 'createNote',
            summary: 'Tạo note',
            params: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        $ref: SCHEMA$REF.WORK_NOTE,
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.WORK_NOTE,
            }),
        },
    },
    '/:id': {
        get: {
            tags: TAG,
            operationId: 'getNote',
            summary: 'Chi tiết note',
            responses: responses({
                $ref: SCHEMA$REF.WORK_NOTE,
            }),
        },
        put: {
            tags: TAG,
            operationId: 'updateNote',
            summary: 'Cập nhật note',
            params: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        $ref: SCHEMA$REF.WORK_NOTE,
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.WORK_NOTE,
            }),
        },
    },
};

module.exports = docs;
