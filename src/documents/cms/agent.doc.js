const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Agent'];

const docs = {
    '/url': {
        get: {
            tags: TAG,
            operationId: 'getAgentUrls',
            summary: 'Danh sách Url',
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
                    name: 'label',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'createdAt',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'createdBy',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'source',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'title',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'active',
                    type: 'bloean',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.AGENT_URL,
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
            operationId: 'createAgentUrl',
            summary: 'Tạo 1 Url',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    type: 'object',
                    schema: {
                        $ref: SCHEMA$REF.AGENT_URL,
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.AGENT_URL,
            }),
        },
    },
    '/url/{id}': {
        get: {
            tags: TAG,
            operationId: 'getAgentUrl',
            summary: 'Chi tiết Url',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'number',
                    required: true,
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.AGENT_URL,
            }),
        },
        put: {
            tags: TAG,
            operationId: 'updateAgentUrl',
            summary: 'Cập nhật 1 Url',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'number',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    type: 'object',
                    schema: {
                        $ref: SCHEMA$REF.AGENT_URL,
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.AGENT_URL,
            }),
        },
        delete: {
            tags: TAG,
            operationId: 'deleteAgentUrl',
            summary: 'Xóa 1 Url',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'number',
                    required: true,
                },
            ],
            responses: responses({}),
        },
    },
};

module.exports = docs;
