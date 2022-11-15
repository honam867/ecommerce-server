const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Search'];

const docs = {
    '/suggestion': {
        get: {
            tags: TAG,
            operationId: 'searchRooms',
            summary: 'Tìm kiếm danh sách phòng',
            parameters: [
                {
                    in: 'query',
                    name: 'businessService',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'keyword',
                    description: 'keyword',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'type',
                    description: 'ID loại nhà',
                    type: 'number',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    bestMatch: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.SEARCH_RESULT,
                        },
                    },
                },
            }),
        },
    },
    '/suggestion/property': {
        get: {
            tags: TAG,
            operationId: 'searchProperties',
            summary: 'Tìm kiếm danh sách nhà',
            parameters: [
                {
                    in: 'query',
                    name: 'keyword',
                    description: 'keyword',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'type',
                    description: 'ID loại nhà',
                    type: 'number',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    bestMatch: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.SEARCH_RESULT,
                        },
                    },
                },
            }),
        },
    },
    '/mostsearched': {
        get: {
            tags: TAG,
            operationId: 'mostsearched',
            summary: 'Danh sách địa điểm tìm kiếm nhiều nhất',
            description: 'Danh sách địa điểm tìm kiếm nhiều nhất theo loại nhà hoặc tất cả',
            parameters: [
                {
                    in: 'query',
                    name: 'type',
                    description: 'ID Loại nhà',
                    type: 'number',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    mostSearched: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.SEARCH_RESULT,
                        },
                    },
                },
            }),
        },
    },
    '/tag/{slug}': {
        get: {
            tags: TAG,
            operationId: 'searchTag',
            summary: 'Tìm tag',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    tag: {
                        $ref: SCHEMA$REF.TAG,
                    },
                },
            }),
        },
    },
};

module.exports = docs;
