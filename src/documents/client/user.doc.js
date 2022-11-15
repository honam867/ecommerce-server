const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['User'];

const docs = {
    '/session': {
        post: {
            tags: TAG,
            description: "Api trả về 1 client key lưu lại và gửi kèm với headers 'client-key' theo mọi request",
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: false,
                    schema: {
                        $ref: SCHEMA$REF.GUEST,
                    },
                },
            ],
            operationId: 'checkUserSession',
            summary: 'lấy thông tin session',
            responses: responses({
                type: 'object',
                properties: {
                    clientKey: {
                        type: 'string',
                    },
                },
            }),
        },
    },
    '/favorite': {
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
                    name: 'propertyType',
                    type: 'number',
                    description: 'ID loại nhà cần lọc',
                },
            ],
            operationId: 'getUserFavorites',
            summary: 'Lấy danh sách vị trí yêu thích',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
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
            description: 'Nếu nhà thì gửi lên trường `propertyId`, nếu phòng thì gửi `roomTypeId`',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: false,
                    schema: {
                        type: 'object',
                        properties: {
                            roomTypeId: {
                                type: 'number',
                            },
                            propertyId: {
                                type: 'number',
                            },
                        },
                    },
                },
            ],
            operationId: 'addUserFavorite',
            summary: 'Thêm địa điểm yêu thích',
            responses: responses({}),
        },
        delete: {
            tags: TAG,
            description: 'Nếu nhà thì gửi lên trường `propertyId`, nếu phòng thì gửi `roomTypeId`',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: false,
                    schema: {
                        type: 'object',
                        properties: {
                            roomTypeId: {
                                type: 'number',
                            },
                            propertyId: {
                                type: 'number',
                            },
                        },
                    },
                },
            ],
            operationId: 'removeUserFavorite',
            summary: 'Xóa địa điểm yêu thích',
            responses: responses({}),
        },
    },
};

module.exports = docs;
