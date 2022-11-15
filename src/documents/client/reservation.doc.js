const { SCHEMA$REF } = require('./def');
const { responses } = require('../utils');

const TAG = ['Reservation'];

const docs = {
    '/inquiry': {
        post: {
            tags: TAG,
            operationId: 'postInquiry',
            summary: 'Tạo đặt phòng, gửi yêu cầu xem nhà / phòng',
            description: 'Đặt lịch xem phòng (nếu là book tháng) / đặt phòng (book ngày, giờ...)',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema: {
                        $ref: SCHEMA$REF.INQUIRY,
                    },
                },
            ],
            responses: responses({
                type: 'object',
                properties: {
                    otaBookingId: {
                        type: 'string',
                    },
                    otaName: {
                        type: 'string',
                    },
                },
            }),
        },
    },
    '/inquiry/{id}': {
        get: {
            tags: TAG,
            operationId: 'getInquiryDetail',
            summary: 'xem thông tin đặt phòng',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                    required: true,
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.BOOKING,
            }),
        },
    },
    '/guide/{id}': {
        get: {
            tags: TAG,
            operationId: 'getBookingGuide',
            summary: 'xem thông tin checkin guide',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    type: 'string',
                    required: true,
                },
                {
                    in: 'query',
                    name: 'roomId',
                    type: 'string',
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.BOOKING_GUIDE,
            }),
        },
    },
    '/passport/validation': {
        post: {
            tags: TAG,
            operationId: 'validatePassport',
            summary: 'Kiểm tra thông tin passport / cccd / cmnd',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    description:
                        'guestId: ID khách hàng\n front: Ảnh mặt trước (định dạng base64) \n back: Ảnh mặt sau',
                    schema: {
                        type: 'object',
                        properties: {
                            guestId: {
                                name: 'guestId',
                            },
                            front: {
                                name: 'front',
                            },
                            back: {
                                name: 'back',
                            },
                        },
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.GUEST,
            }),
        },
    },
    '/checkinData': {
        post: {
            tags: TAG,
            operationId: 'checkinData',
            summary: 'Gửi thông tin checkin',
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    required: true,
                    description: 'guestId: ID khách hàng\n guestData: Thông tin khách hàng điền',
                    schema: {
                        type: 'object',
                        properties: {
                            guestId: {
                                type: 'string',
                            },
                            guestData: {
                                $ref: SCHEMA$REF.GUEST,
                            },
                        },
                    },
                },
            ],
            responses: responses({
                $ref: SCHEMA$REF.GUEST,
            }),
        },
    },
};

module.exports = docs;
