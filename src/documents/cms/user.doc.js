const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['User'];

const docs = {
    '/auth': {
        post: {
            tags: TAG,
            operationId: 'authenticate',
            summary: 'Đăng nhập',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
            responses: responses({
                user: {
                    $ref: SCHEMA$REF.USER,
                },
                token: {
                    type: 'string',
                },
            }),
        },
    },
    '/': {
        get: {
            tags: TAG,
            operationId: 'getUserInfo',
            summary: 'Lấy thông tin tài khoản',
            responses: responses({
                user: {
                    $ref: SCHEMA$REF.USER,
                },
            }),
        },
        put: {
            tags: TAG,
            operationId: 'updateUserInfo',
            summary: 'cập nhật thông tin user',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    description: 'body',
                    required: true,
                    schema: {
                        $ref: SCHEMA$REF.USER,
                    },
                },
            ],
            responses: responses({
                user: {
                    $ref: SCHEMA$REF.USER,
                },
            }),
        },
    },
    '/tabs': {
        get: {
            tags: TAG,
            operationId: 'getTabs',
            summary: 'Tabs UI',
            responses: responses({
                tabs: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                groups: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                            methods: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            }),
        },
    },
    '/changePassword': {
        post: {
            tags: TAG,
            operationId: 'changePassword',
            summary: 'Đổi mật khẩu',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    description: 'Account',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            oldPassword: {
                                type: 'string',
                                default: 'admin',
                            },
                            newPassword: {
                                type: 'string',
                                default: 'admin',
                            },
                        },
                    },
                },
            ],
            responses: responses({}),
        },
    },
    '/resetPassword/{userId}': {
        post: {
            tags: TAG,
            operationId: 'resetPassword',
            summary: 'Khôi phục mật khẩu',
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    description: 'User ID',
                    required: true,
                    type: 'string',
                },
            ],
            responses: responses({
                newPassword: {
                    type: 'string',
                },
            }),
        },
    },
    '/noti': {
        put: {
            tags: TAG,
            operationId: 'updateNotiKey',
            summary: 'Cập nhật notify key',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'query',
                    name: 'deviceName',
                    description: 'ios/android/web',
                    required: true,
                    type: 'string',
                    enum: ['ios', 'android', 'web'],
                },
                {
                    in: 'query',
                    name: 'notiId',
                    description: 'notiId',
                    required: true,
                    type: 'string',
                },
            ],
            responses: responses({}),
        },
    },
    '/getManageUser': {
        get: {
            tags: TAG,
            operationId: 'getManageUser',
            summary: 'getManageUser',
            produces: ['application/json'],
            responses: responses({}),
        },
    },
    '/calling': {
        get: {
            tags: TAG,
            operationId: 'getCallingUsers',
            summary: 'Danh sách users gọi điện',
            responses: responses(),
        },
    },
    '/calling/{userId}': {
        put: {
            tags: TAG,
            operationId: 'updateCallingUser',
            summary: 'Cập nhật user gọi điện',
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    required: true,
                    type: 'string',
                },
                {
                    in: 'body',
                    name: 'body',
                    description: 'ServiceStringeeUser',
                    required: true,
                    schema: {
                        type: 'object',
                        properties: {
                            order: {
                                type: 'object',
                                properties: {
                                    monday: {
                                        type: 'number',
                                    },
                                    tuesday: {
                                        type: 'number',
                                    },
                                    wednesday: {
                                        type: 'number',
                                    },
                                    thursday: {
                                        type: 'number',
                                    },
                                    friday: {
                                        type: 'number',
                                    },
                                    saturday: {
                                        type: 'number',
                                    },
                                    sunday: {
                                        type: 'number',
                                    },
                                },
                            },
                            days: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        time_start: {
                                            type: 'string',
                                        },
                                        time_end: {
                                            type: 'string',
                                        },
                                        disabled_calling: {
                                            type: 'boolean',
                                        },
                                        disabled_listening: {
                                            type: 'boolean',
                                        },
                                        day: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
            responses: responses({}),
        },
    },
};

module.exports = docs;
