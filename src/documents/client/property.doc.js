const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Property'];

const utilParams = [
    {
        in: 'query',
        name: 'start',
        default: 0,
        type: 'number',
    },
    {
        in: 'query',
        name: 'limit',
        type: 'number',
        default: 10,
    },
    {
        in: 'query',
        name: 'min_price',
        description: 'Giá tối thiểu',
        type: 'number',
    },
    {
        in: 'query',
        name: 'max_price',
        description: 'Giá tối đa',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sort',
        description: 'Sắp xếp',
        type: 'string',
        enum: ['newest', 'recommended'],
    },
    {
        in: 'query',
        name: 'sort_type',
        description: 'Kiểu sắp xếp',
        type: 'string',
        enum: ['asc', 'desc'],
    },
    {
        in: 'query',
        name: 'ne_lng',
        description: 'longitude northeast',
        type: 'number',
    },
    {
        in: 'query',
        name: 'ne_lat',
        description: 'latitude northeast',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sw_lng',
        description: 'longitude southwest',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sw_lat',
        description: 'latitude southwest',
        type: 'number',
    },
    {
        in: 'query',
        name: 'geohash',
        type: 'string',
    },
];

const propertiesParameters = [
    ...utilParams,
    {
        in: 'query',
        name: 'locId',
        description: 'Id để xác định khu vực từ danh sách tìm kiếm phía trên',
        type: 'number',
    },
    {
        in: 'query',
        name: 'facilities',
        description: 'Danh sách Id các tiện ích cần lọc',
        type: 'array',
        items: {
            type: 'number',
        },
    },
    {
        in: 'query',
        name: 'type',
        description: 'Loại nhà cần lọc vd chung cư hay CHDV',
        type: 'number',
        enum: [1, 2],
    },
    {
        in: 'query',
        name: 'area',
        description: 'Diện tích',
        type: 'number',
    },
    {
        in: 'query',
        name: 'media',
        description: 'Dữ liệu có thể xem vr, images, videos',
        type: 'string',
        enum: ['vr', 'images', 'videos'],
    },
    {
        in: 'query',
        name: 'businessService',
        description: 'Loại dịch vụ bán giờ, ngày...',
        type: 'number',
        enum: [1, 2, 3, 4],
    },
];

const roomParams = [
    ...utilParams,
    {
        in: 'query',
        name: 'checkIn',
        description: 'Ngày định dạng ISOString',
        type: 'string',
    },
    {
        in: 'query',
        name: 'checkOut',
        description: 'Ngày định dạng ISOString',
        type: 'string',
    },
    {
        in: 'query',
        name: 'locId',
        description: 'Id để xác định khu vực từ danh sách tìm kiếm phía trên',
        type: 'number',
    },
    {
        in: 'query',
        name: 'property',
        description: 'Id nhà',
        type: 'string',
    },
    {
        in: 'query',
        name: 'district',
        type: 'number',
    },
    {
        in: 'query',
        name: 'ward',
        type: 'number',
    },
    {
        in: 'query',
        name: 'street',
        type: 'number',
    },
    {
        in: 'query',
        name: 'amenities',
        description: 'Danh sách Id các tiện nghi cần lọc',
        type: 'array',
        items: {
            type: 'number',
        },
    },
    {
        in: 'query',
        name: 'type',
        description: 'Loại nhà cần lọc vd chung cư hay CHDV',
        type: 'number',
        enum: [1, 2],
    },
    {
        in: 'query',
        name: 'direction',
        type: 'string',
        enum: ['south', 'west', 'north', 'east', 'northeast', 'northwest', 'southeast', 'southwest'],
    },
    {
        in: 'query',
        name: 'area',
        description: 'Diện tích',
        type: 'number',
    },
    {
        in: 'query',
        name: 'media',
        description: 'Dữ liệu có thể xem vr, images, videos',
        type: 'string',
        enum: ['vr', 'images', 'videos'],
    },

    {
        in: 'query',
        name: 'bedroom',
        description: 'phòng ngủ',
        type: 'number',
    },
    {
        in: 'query',
        name: 'bed',
        description: 'giường ngủ',
        type: 'number',
    },
    {
        in: 'query',
        name: 'businessService',
        description: 'Loại dịch vụ bán giờ, ngày...',
        type: 'number',
        enum: [1, 2, 3, 4],
    },
    {
        in: 'query',
        name: 'tag',
        type: 'string',
    },
    {
        in: 'query',
        name: 'bedType',
        type: {
            oneOf: ['string', 'number'],
        },
    },
];

const docs = {
    '/': {
        get: {
            tags: TAG,
            operationId: 'getProperties',
            summary: 'Lấy danh sách nhà',
            parameters: propertiesParameters,
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PROPERTY,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/location': {
        get: {
            tags: TAG,
            operationId: 'getPropertiesLocation',
            summary: 'Lấy danh sách tọa độ nhà',
            parameters: propertiesParameters,
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {},
                        },
                    },
                },
            }),
        },
    },
    '/branch': {
        get: {
            tags: TAG,
            operationId: 'getPropertiesBranch',
            summary: 'Lấy danh sách các chi nhánh',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        $ref: SCHEMA$REF.PROPERTY,
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/{slug}': {
        get: {
            tags: TAG,
            operationId: 'getProperty',
            summary: 'Chi tiết nhà',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 property',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'checkIn',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'checkOut',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'businessService',
                    type: 'number',
                },
                {
                    in: 'query',
                    name: 'seoLink',
                    type: 'boolean',
                },
            ],
            responses: responses({
                allOf: [
                    {
                        $ref: SCHEMA$REF.PROPERTY,
                    },
                    {
                        type: 'object',
                        properties: {
                            seo: {
                                $ref: SCHEMA$REF.SEO,
                            },
                        },
                    },
                ],
            }),
        },
    },
    '/{slug}/suggestion': {
        get: {
            tags: TAG,
            operationId: 'getPropertySuggestions',
            summary: 'Danh sách nhà gợi ý',
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
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 property',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PROPERTY,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/{slug}/place': {
        get: {
            tags: TAG,
            operationId: 'getPropertyPlace',
            summary: 'Danh sách địa điểm gần nhà',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug or id của 1 property',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    places: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.PLACE,
                        },
                    },
                },
            }),
        },
    },
    '/{slug}/layout': {
        get: {
            tags: TAG,
            operationId: 'getPropertyLayout',
            summary: 'Layout nhà',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug or id của 1 property',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    layout: {
                        $ref: SCHEMA$REF.LAYOUT,
                    },
                },
            }),
        },
    },
    '/{slug}/agent': {
        get: {
            tags: TAG,
            operationId: 'getPropertyAgents',
            summary: 'Danh sách môi giới',
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
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 property',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    agents: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.USER,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/room': {
        get: {
            tags: TAG,
            operationId: 'getRooms',
            summary: 'Lấy danh sách phòng',
            parameters: roomParams,
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.ROOM_TYPE,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/room/location': {
        get: {
            tags: TAG,
            operationId: 'getRoomsMap',
            summary: 'Lấy danh sách vị trí phòng',
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {},
                        },
                    },
                },
            }),
        },
    },
    '/room/geo': {
        get: {
            tags: TAG,
            operationId: 'getRoomsMapGeoHash',
            summary: 'Lấy danh sách vị trí phòng (clustering)',
            parameters: roomParams,
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                lat: {
                                    type: 'number',
                                },
                                lng: {
                                    type: 'number',
                                },
                                count: {
                                    type: 'number',
                                },
                                dataType: {
                                    type: 'string',
                                },
                                geohash: {
                                    type: 'string',
                                },
                                firstItem: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            }),
        },
    },
    '/room/{slug}': {
        get: {
            tags: TAG,
            operationId: 'getRoom',
            summary: 'Chi tiết phòng',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 phòng',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'businessService',
                    description: 'Loại dịch vụ bán giờ, ngày...',
                    type: 'number',
                    enum: [1, 2, 3, 4],
                },
                {
                    in: 'query',
                    name: 'seoLink',
                    type: 'boolean',
                },
            ],
            responses: responses({
                allOf: [
                    {
                        $ref: SCHEMA$REF.ROOM_TYPE,
                    },
                    {
                        type: 'object',
                        properties: {
                            seo: {
                                $ref: SCHEMA$REF.SEO,
                            },
                        },
                    },
                ],
            }),
        },
    },
    '/room/{slug}/suggestion': {
        get: {
            tags: TAG,
            operationId: 'getRoomSuggestions',
            summary: 'Danh sách phòng gợi ý',
            parameters: [
                {
                    in: 'path',
                    name: 'start',
                    type: 'number',
                },
                {
                    in: 'path',
                    name: 'limit',
                    type: 'number',
                },
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 phòng',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.ROOM_TYPE,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/room/{slug}/price': {
        get: {
            tags: TAG,
            operationId: 'getRoomPrice',
            summary: 'Giá phòng',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 phòng',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'businessService',
                    type: 'number',
                    enum: [1, 2, 3, 4],
                },
                {
                    in: 'query',
                    name: 'checkIn',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'checkOut',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'rooms',
                    type: 'number',
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.ROOM_PRICE,
            }),
        },
    },
    '/room/{slug}/available': {
        get: {
            tags: TAG,
            operationId: 'getRoomAvailable',
            summary: 'Trạng thái phòng',
            parameters: [
                {
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 phòng',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'businessService',
                    type: 'number',
                    enum: [1, 2, 3, 4],
                },
                {
                    in: 'query',
                    name: 'checkIn',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'checkOut',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    available: {
                        $ref: SCHEMA$REF.ROOM_AVAILABLE,
                    },
                },
            }),
        },
    },
    '/room/{slug}/agent': {
        get: {
            tags: TAG,
            operationId: 'getRoomAgents',
            summary: 'Danh sách môi giới',
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
                    in: 'path',
                    name: 'slug',
                    description: 'slug của 1 phòng',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    agents: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.AGENT,
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
