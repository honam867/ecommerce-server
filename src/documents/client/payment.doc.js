const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Payment'];

const docs = {
    '/bankInfo': {
        get: {
            tags: TAG,
            operationId: 'bankInfo',
            summary: 'Lấy thông tin tài khoản ngân hàng',
            responses: responses({
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        bank: {
                            type: 'string',
                        },
                        company_name: {
                            type: 'string',
                        },
                        bank_account: {
                            type: 'string',
                        },
                        branch: {
                            type: 'string',
                        },
                        content: {
                            type: 'string',
                        },
                        note: {
                            type: 'string',
                        },
                    },
                },
            }),
        },
    },
    '/serviceFee': {
        get: {
            tags: TAG,
            operationId: 'serviceFee',
            summary: 'Lấy thông tin phí dịch vụ',
            responses: responses({
                type: 'object',
                properties: {
                    pay_at_property: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'number',
                            },
                            type: {
                                type: 'string',
                            },
                            currency: {
                                type: 'string',
                            },
                            description: {
                                type: 'number',
                            },
                            businessServices: {
                                type: 'array',
                                items: {
                                    $ref: SCHEMA$REF.BUSINESS_SERVICE,
                                },
                            },
                        },
                    },
                },
            }),
        },
    },
    '/status': {
        get: {
            tags: TAG,
            operationId: 'getPaymentStatus',
            summary: 'Lấy thông tin trạng thái thanh toán',
            parameters: [
                {
                    in: 'query',
                    name: 'orderId',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'vnp_TxnRef',
                    type: 'string',
                },
            ],
            responses: responses({}),
        },
    },
    '/': {
        post: {
            tags: TAG,
            operationId: 'createPayment',
            summary: 'Tạo 1 đường dẫn thanh toán',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    description: 'guestId: ID khách hàng\n guestData: Thông tin khách hàng điền',
                    schema: {
                        type: 'object',
                        properties: {
                            otaBookingId: {
                                type: 'string',
                            },
                            otaName: {
                                type: 'string',
                            },
                            bankCode: {
                                type: 'string',
                            },
                            method: {
                                type: 'string',
                                enum: ['vnpay', 'momo'],
                            },
                            platform: {
                                type: 'string',
                                enum: ['app', 'web'],
                            },
                        },
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                    },
                },
            }),
        },
    },
};

module.exports = docs;
