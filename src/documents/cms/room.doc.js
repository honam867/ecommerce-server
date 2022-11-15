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
        description: 'Loại nhà (BlockType)',
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
            summary: 'Danh sách OTA',
            operationId: 'listOTA',
            responses: responses({}),
        },
    },
    '/block/map/geohash': {
        get: {
            tags: TAG,
            summary: 'Danh sách point của nhà',
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
            summary: 'Danh sách point nhà của 1 geohash',
            operationId: 'blockGeoMap',
            responses: responses({}),
        },
    },
    '/block': {
        get: {
            tags: TAG,
            summary: 'Danh sách nhà',
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
            summary: 'Tạo mới 1 nhà',
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
            summary: 'Export danh sách nhà',
            operationId: 'exportBlocks',
            parameters: blockParams,
            responses: responses({}),
        },
    },
    '/block/import': {
        get: {
            tags: TAG,
            summary: 'Import 1 nhà',
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
            summary: 'Import 1 nhà',
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
            summary: 'Import 1 nhà',
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
            summary: 'Thông tin 1 nhà',
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
            summary: 'Update thông tin 1 nhà',
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
            summary: 'Xóa 1 nhà',
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
            summary: 'Tải ảnh của 1 nhà',
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
            summary: 'Lịch sử ra vào cửa nhà',
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
            summary: 'Danh sách loại phòng của 1 nhà',
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
            summary: 'Tạo 1 loại phòng của nhà',
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
            summary: 'Chi tiết loại phòng của 1 nhà',
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
            summary: 'Update loại phòng của nhà',
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
            summary: 'Xóa 1 loại phòng của nhà',
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
            summary: 'Tải ảnh của 1 phòng',
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
            summary: 'Danh sách loại phòng',
            parameters: roomTypeParams,
            operationId: 'roomTypeSale',
            responses: responses({}),
        },
    },
    '/type/sale/geo': {
        get: {
            tags: TAG,
            summary: 'Danh sách loại phòng (map)',
            parameters: roomTypeParams,
            operationId: 'roomTypeSaleGeo',
            responses: responses({}),
        },
    },
    '/unit/{blockId}': {
        get: {
            tags: TAG,
            summary: 'Ds phòng của loại phòng',
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
            summary: 'Ds phòng của loại phòng',
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
            summary: 'cập nhật 1 phòng',
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
            summary: 'xóa 1 phòng',
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
            summary: 'Lấy layout của 1 nhà',
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
            summary: 'Tạo layout của 1 nhà',
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
            summary: 'Lấy danh sách địa điểm của nhà',
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
            summary: 'Tạo địa điểm của nhà',
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
            summary: 'Xem trước địa điểm của nhà',
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
            summary: 'Note / trạng thái số hóa',
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
            summary: 'Tạo note / tt số hóa',
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
