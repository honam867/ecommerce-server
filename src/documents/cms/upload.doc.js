const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Upload'];

const docs = {
    '/': {
        post: {
            tags: TAG,
            operationId: 'getBanners',
            summary: 'Uploads files',
            consumes: ['multipart/form-data'],
            parameters: [
                {
                    in: 'formData',
                    name: 'files',
                    type: 'file',
                    description: 'The file to upload.',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    resources: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                    },
                },
            }),
        },
    },
    '/origin': {
        post: {
            tags: TAG,
            operationId: 'uploadOrigin',
            summary: 'Uploads keep origin files',
            consumes: ['multipart/form-data'],
            parameters: [
                {
                    in: 'formData',
                    name: 'files',
                    type: 'file',
                    description: 'The file to upload.',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    resources: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                    },
                },
            }),
        },
    },
};

module.exports = docs;
