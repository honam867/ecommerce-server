const { responses } = require('../utils');

const TAG = ['UI'];

const docs = {
    '/banner': {
        get: {
            tags: TAG,
            operationId: 'getBanners',
            summary: 'lấy danh sách banner',
            responses: responses({}),
        },
    },
    '/homePage': {
        get: {
            tags: TAG,
            parameters: [
                {
                    in: 'query',
                    name: 'propertyType',
                    description: 'ID loại nhà',
                    type: 'number',
                    required: true,
                },
            ],
            operationId: 'getHomepages',
            summary: 'lấy danh sách home page cần hiển thị',
            responses: responses({}),
        },
    },
};

module.exports = docs;
