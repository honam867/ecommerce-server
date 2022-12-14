const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Room'];

const utilsParams = [
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
        name: 'ne_lat',
        type: 'number',
    },
    {
        in: 'query',
        name: 'ne_lng',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sw_lat',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sw_lng',
        type: 'number',
    },
];

const roomTypeParams = [
    ...utilsParams,
    {
        in: 'query',
        name: 'area',
        type: 'number',
    },
    {
        in: 'query',
        name: 'direction',
        type: 'string',
    },
    {
        in: 'query',
        name: 'min_price',
        type: 'number',
    },
    {
        in: 'query',
        name: 'max_price',
        type: 'number',
    },
    {
        in: 'query',
        name: 'bedroom',
        type: 'number',
    },
    {
        in: 'query',
        name: 'bed',
        type: 'number',
    },
    {
        in: 'query',
        name: 'businessServices',
        type: 'number',
    },
    {
        in: 'query',
        name: 'propertyTypes',
        type: 'number',
    },
    {
        in: 'query',
        name: 'tag',
        type: 'string',
    },
    {
        in: 'query',
        name: 'type',
        type: 'number',
    },
    {
        in: 'query',
        name: 'geohash',
        type: 'string',
    },
    {
        in: 'query',
        name: 'provinceId',
        type: 'number',
    },
    {
        in: 'query',
        name: 'districtId',
        type: 'number',
    },
    {
        in: 'query',
        name: 'wardId',
        type: 'number',
    },
    {
        in: 'query',
        name: 'streetId',
        type: 'number',
    },
    {
        in: 'query',
        name: 'sort',
        type: 'string',
        enum: ['newest', 'recommended', 'price'],
    },
    {
        in: 'query',
        name: 'sort_type',
        type: 'string',
        enum: ['asc', 'desc'],
    },
    {
        in: 'query',
        name: 'keyword',
        type: 'string',
    },
];

const blockParams = [
    ...utilsParams,
    {
        in: 'query',
        name: 'name',
        type: 'string',
    },
    {
        in: 'query',
        name: 'type',
        description: 'Lo???i nh?? (BlockType)',
        type: 'string',
    },
    {
        in: 'query',
        name: 'province',
        type: 'number',
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
        name: 'saleState',
        type: 'number',
    },
    {
        in: 'query',
        name: 'constructionState',
        type: 'number',
    },
    {
        in: 'query',
        name: 'approachState',
        type: 'number',
    },
    {
        in: 'query',
        name: 'digitizingState',
        type: 'number',
    },
    {
        in: 'query',
        name: 'createdBy',
        type: 'string',
    },
];

const docs = {
    '/listOTA': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch OTA',
            operationId: 'listOTA',
            responses: responses({}),
        },
    },
    '/block/map/geohash': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch point c???a nh??',
            operationId: 'blockGeoMap',
            parameters: blockParams,
            responses: responses({
                count: {
                    type: 'number',
                },
                lat: {
                    type: 'number',
                },
                lng: {
                    type: 'number',
                },
                geohash: {
                    type: 'string',
                },
            }),
        },
    },
    '/block/map/geohash/{id}': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch point nh?? c???a 1 geohash',
            operationId: 'blockGeoMap',
            responses: responses({}),
        },
    },
    '/block': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch nh??',
            operationId: 'getBlocks',
            parameters: [
                {
                    name: 'body',
                    in: 'body',
                    schema: {
                        $ref: SCHEMA$REF.BLOCK,
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    block: {
                        $ref: SCHEMA$REF.BLOCK,
                    },
                },
            }),
        },
        post: {
            tags: TAG,
            summary: 'T???o m???i 1 nh??',
            operationId: 'getBlocks',
            parameters: blockParams,
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.BLOCK,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/block/export': {
        get: {
            tags: TAG,
            summary: 'Export danh s??ch nh??',
            operationId: 'exportBlocks',
            parameters: blockParams,
            responses: responses({}),
        },
    },
    '/block/import': {
        get: {
            tags: TAG,
            summary: 'Import 1 nh??',
            operationId: 'importBlock',
            parameters: [
                {
                    in: 'query',
                    name: 'blockId',
                    type: 'string',
                },
                {
                    in: 'formData',
                    name: 'files',
                    type: 'file',
                    description: 'Excel file to upload.',
                },
            ],
            responses: responses({
                type: 'array',
                items: {
                    $ref: SCHEMA$REF.BLOCK,
                },
            }),
        },
    },
    '/block/import/googleSheet': {
        get: {
            tags: TAG,
            summary: 'Import 1 nh??',
            operationId: 'importGSheetBlock',
            parameters: [
                {
                    in: 'query',
                    name: 'blockId',
                    type: 'string',
                },
                {
                    in: 'body',
                    name: 'body',
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
            responses: responses({
                $ref: SCHEMA$REF.BLOCK,
            }),
        },
    },
    '/block/importUrl': {
        get: {
            tags: TAG,
            summary: 'Import 1 nh??',
            operationId: 'importBlock',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        properties: {
                            source: {
                                type: 'string',
                            },
                            urls: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            ],
            responses: responses({}),
        },
    },
    '/block/{id}': {
        get: {
            tags: TAG,
            summary: 'Th??ng tin 1 nh??',
            operationId: 'getBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    block: {
                        $ref: SCHEMA$REF.BLOCK,
                    },
                },
            }),
        },
        put: {
            tags: TAG,
            summary: 'Update th??ng tin 1 nh??',
            operationId: 'updateBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        $ref: SCHEMA$REF.BLOCK,
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    block: {
                        $ref: SCHEMA$REF.BLOCK,
                    },
                },
            }),
        },
        delete: {
            tags: TAG,
            summary: 'X??a 1 nh??',
            operationId: 'deleteBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
            ],
            responses: responses({}),
        },
    },
    '/block/{id}/image/download': {
        get: {
            tags: TAG,
            summary: 'T???i ???nh c???a 1 nh??',
            operationId: 'downloadBlockImage',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                },
            ],
            responses: responses({}),
        },
    },
    '/door/accessLog': {
        get: {
            tags: TAG,
            summary: 'L???ch s??? ra v??o c???a nh??',
            operationId: 'doorAccessLog',
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
                    name: 'from',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'to',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'blockId',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'roomId',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.DOOR_ACCESS_LOG,
                        },
                    },
                    total: {
                        type: 'number',
                    },
                },
            }),
        },
    },
    '/type/{blockId}': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch lo???i ph??ng c???a 1 nh??',
            operationId: 'roomTypesBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({}),
        },
        post: {
            tags: TAG,
            summary: 'T???o 1 lo???i ph??ng c???a nh??',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema: {
                        $ref: SCHEMA$REF.ROOM_TYPE,
                    },
                },
            ],
            operationId: 'createRoomTypeBlock',
            responses: responses({}),
        },
    },
    '/type/{blockId}/{roomTypeId}': {
        get: {
            tags: TAG,
            summary: 'Chi ti???t lo???i ph??ng c???a 1 nh??',
            operationId: 'roomTypeBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomTypeId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({}),
        },
        put: {
            tags: TAG,
            summary: 'Update lo???i ph??ng c???a nh??',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomTypeId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema: {
                        $ref: SCHEMA$REF.ROOM_TYPE,
                    },
                },
            ],
            operationId: 'roomTypeSaleGeo',
            responses: responses({}),
        },
        delete: {
            tags: TAG,
            summary: 'X??a 1 lo???i ph??ng c???a nh??',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomTypeId',
                    type: 'string',
                    required: true,
                },
            ],
            operationId: 'deleteRoomTypeBlock',
            responses: responses({}),
        },
    },
    '/type/{blockId}/{roomTypeId}/image/download': {
        get: {
            tags: TAG,
            summary: 'T???i ???nh c???a 1 ph??ng',
            operationId: 'downloadRoomTypeImage',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomTypeId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({}),
        },
    },
    '/type/sale': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch lo???i ph??ng',
            parameters: roomTypeParams,
            operationId: 'roomTypeSale',
            responses: responses({}),
        },
    },
    '/type/sale/geo': {
        get: {
            tags: TAG,
            summary: 'Danh s??ch lo???i ph??ng (map)',
            parameters: roomTypeParams,
            operationId: 'roomTypeSaleGeo',
            responses: responses({}),
        },
    },
    '/unit/{blockId}': {
        get: {
            tags: TAG,
            summary: 'Ds ph??ng c???a lo???i ph??ng',
            operationId: 'roomsList',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'query',
                    name: 'roomTypeId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.ROOM,
                        },
                    },
                },
            }),
        },
        post: {
            tags: TAG,
            summary: 'Ds ph??ng c???a lo???i ph??ng',
            operationId: 'createRoom',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        properties: {
                            roomTypeId: {
                                type: 'string',
                            },
                            roomNos: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                            roomInfo: {
                                type: 'object',
                            },
                        },
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            }),
        },
    },
    '/unit/{blockId}/{roomId}': {
        put: {
            tags: TAG,
            summary: 'c???p nh???t 1 ph??ng',
            operationId: 'updateRoom',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        $ref: SCHEMA$REF.ROOM,
                    },
                },
            ],
            responses: responses({}),
        },
        delete: {
            tags: TAG,
            summary: 'x??a 1 ph??ng',
            operationId: 'deleteRoom',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'path',
                    name: 'roomId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({}),
        },
    },
    '/layout/{blockId}': {
        get: {
            tags: TAG,
            summary: 'L???y layout c???a 1 nh??',
            operationId: 'getLayout',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
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
        post: {
            tags: TAG,
            summary: 'T???o layout c???a 1 nh??',
            operationId: 'createLayout',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                layout: {
                                    type: 'string',
                                    enum: ['layoutX', 'layoutY'],
                                },
                                action: {
                                    type: 'string',
                                    enum: ['create', 'update', 'delete'],
                                },
                                name: {
                                    type: 'string',
                                },
                                description: {
                                    type: 'string',
                                },
                                order: {
                                    type: 'number',
                                },
                                roomId: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            ],
            responses: responses({}),
        },
    },
    '/place/{blockId}': {
        get: {
            tags: TAG,
            summary: 'L???y danh s??ch ?????a ??i???m c???a nh??',
            operationId: 'getPlacesBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    places: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.BLOCK_PLACE,
                        },
                    },
                },
            }),
        },
        post: {
            tags: TAG,
            summary: 'T???o ?????a ??i???m c???a nh??',
            operationId: 'createPlacesBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        type: 'object',
                        properties: {
                            placeTypes: {
                                type: 'array',
                                items: 'string',
                            },
                            placeIds: {
                                type: 'array',
                                items: 'string',
                            },
                            distance: {
                                type: 'number',
                            },
                        },
                    },
                    required: true,
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    places: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            }),
        },
    },
    '/place/{blockId}/preview': {
        get: {
            tags: TAG,
            summary: 'Xem tr?????c ?????a ??i???m c???a nh??',
            operationId: 'previewPlacesBlock',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'query',
                    name: 'placeTypes',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'distance',
                    type: 'number',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    places: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.BLOCK_PLACE,
                        },
                    },
                },
            }),
        },
    },
    '/digitizing-approach/{blockId}': {
        get: {
            tags: TAG,
            summary: 'Note / tr???ng th??i s??? h??a',
            operationId: 'getdigiAppr',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
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
                    name: 'roomTypeId',
                    type: 'string',
                },
                {
                    in: 'query',
                    name: 'roomId',
                    type: 'string',
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.BLOCK_DIGITIZING_APPROACH,
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
            summary: 'T???o note / tt s??? h??a',
            operationId: 'createDipiAppr',
            parameters: [
                {
                    in: 'path',
                    name: 'blockId',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'body',
                    name: 'body',
                    schema: {
                        $ref: SCHEMA$REF.BLOCK_DIGITIZING_APPROACH,
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    data: {
                        $ref: SCHEMA$REF.BLOCK_DIGITIZING_APPROACH,
                    },
                },
            }),
        },
    },
};

module.exports = docs;
