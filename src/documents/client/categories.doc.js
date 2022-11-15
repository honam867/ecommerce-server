const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Categories'];

const docs = {
    '/propertytype': {
        get: {
            tags: TAG,
            operationId: 'getPropertyType',
            summary: 'Danh sách loại nhà',
            description: 'Lấy danh sách loại nhà',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PROPERTY_TYPE,
                        },
                    },
                },
            }),
        },
    },
    '/facilities': {
        get: {
            tags: TAG,
            operationId: 'getFacilities',
            summary: 'Danh sách tiện ích',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.AMENITIES,
                        },
                    },
                },
            }),
        },
    },
    '/amenities': {
        get: {
            tags: TAG,
            operationId: 'getAmenities',
            summary: 'Danh sách tiện nghi',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.AMENITIES,
                        },
                    },
                },
            }),
        },
    },
    '/province': {
        get: {
            tags: TAG,
            operationId: 'getProvinces',
            summary: 'Danh sách tỉnh / tp',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PROVINCE,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/district': {
        get: {
            tags: TAG,
            operationId: 'getDistricts',
            summary: 'Danh sách quận huyện',
            parameters: [
                {
                    in: 'query',
                    name: 'province',
                    description: 'ID Tỉnh / Thành phố',
                    type: 'number',
                    default: 1,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.DISTRICT,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/ward': {
        get: {
            tags: TAG,
            operationId: 'getWards',
            summary: 'Danh sách xã / phường / thị trấn',
            parameters: [
                {
                    in: 'query',
                    name: 'district',
                    description: 'ID Quận / Huyện',
                    type: 'number',
                    required: true,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.WARD,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/street': {
        get: {
            tags: TAG,
            operationId: 'getStreets',
            summary: 'Danh sách đường trong quận',
            parameters: [
                {
                    in: 'query',
                    name: 'district',
                    description: 'ID Quận / Huyện',
                    type: 'number',
                    required: true,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.STREET,
                        },
                    },
                },
            }),
        },
    },
};

module.exports = docs;
