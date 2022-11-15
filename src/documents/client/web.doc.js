const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Web'];

const docs = {
    '/url/resolver': {
        post: {
            tags: TAG,
            description: 'Phân giải url',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: false,
                    schema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
            operationId: 'urlResolve',
            summary: 'Phân giải url',
            responses: responses({
                type: 'object',
                properties: {
                    businessService: {
                        type: 'number',
                    },
                    propertyType: {
                        $ref: SCHEMA$REF.PROPERTY_TYPE,
                    },
                    propertyTypes: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PROPERTY_TYPE,
                        },
                    },
                    location: {
                        type: 'object',
                        properties: {
                            province: {
                                $ref: SCHEMA$REF.PROVINCE,
                            },
                            district: {
                                $ref: SCHEMA$REF.DISTRICT,
                            },
                            ward: {
                                $ref: SCHEMA$REF.WARD,
                            },
                        },
                    },
                    seo: {
                        $ref: SCHEMA$REF.SEO,
                    },
                },
            }),
        },
    },
};

module.exports = docs;
