const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Categories'];

const docs = {
    '/template-url': {
        get: {
            tags: TAG,
            operationId: 'getTemplateUrls',
            summary: 'Danh sách template Urls',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.CTG_TEMPLATE_URL,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/country': {
        get: {
            tags: TAG,
            operationId: 'getCountries',
            summary: 'Danh sách quốc gia',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.LOC_COUNTRY,
                        },
                    },
                    total: {
                        type: 'number',
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
                            $ref: SCHEMA$REF.CTG_AMENITIES,
                        },
                    },
                    total: {
                        type: 'number',
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
                            $ref: SCHEMA$REF.CTG_FACILITIES,
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
