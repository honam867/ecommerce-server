const SALE_STATE = {
    IN_CRAWLING: {
        name: 'In crawling',
        id: 1,
    },
    IN_CREATE: {
        name: 'In create',
        id: 2,
    },
    IN_REVIEW: {
        name: 'In review',
        id: 3,
    },
    IN_TEMPORARY: {
        name: 'In temporary',
        id: 4,
    },
    IN_SALE: {
        name: 'In sale',
        id: 5,
    },
};

const CONSTRUCTION_STATE = {
    NO_DESIGN: {
        name: 'Chưa xây dựng, chưa thiết kế',
        id: 1,
    },
    IN_DESIGN: {
        name: 'Chưa xây dựng, đang trong quá trình thiết kế',
        id: 2,
    },
    IN_PERMISSION: {
        name: 'Chưa xây dựng, đã xong thiết kế và trong quá trình xin giấy phép xây dựng',
        id: 3,
    },
    IN_FIND_CONTRACTOR: {
        name: 'Chưa xây dựng, đã xong thiế kế và giấy phép xây dựng, đang tìm bên thi công xây dựng',
        id: 4,
    },
    IN_BUILD_1: {
        name: 'Đang xây dựng phần thô, chưa đến giai đoạn làm nội thất',
        id: 5,
    },
    IN_BUILD_2: {
        name: 'Đang xây dựng phần thô, đến giai đoạn tìm nhà thầu thi công nội thất',
        id: 6,
    },
    IN_BUILD_3: {
        name: 'Đang xây dựng và chuyển sang giai đoạn thi công nội thất',
        id: 7,
    },
    IN_BUILD_4: {
        name: 'Hoàn thành xây dựng và thi công nội thất, quá trình vệ sinh công nghiệp và mua sắm thêm trang thiết bị',
        id: 8,
    },
    IN_BUILD_5: {
        name: 'Hoàn thành xây dựng, nhưng chưa hoàn công theo quy định của nhà nước và chuyển sang giai đoạn tìm kiếm đối tác quản lý/ cho thuê lại',
        id: 9,
    },
    IN_COMPLETION_1: {
        name: 'Hoàn thành xây dựng, chưa hoàn công, đã giao quản lý/ cho thuê lại',
        id: 10,
    },
    IN_COMPLETION_2: {
        name: 'Tạm dừng khai thác để hoàn công xây dựng theo quy định của nhà nước',
        id: 11,
    },
    IN_COMPLETION_3: {
        name: 'Xây dựng thêm phần lửng/ mái theo yêu cầu của chủ nhà',
        id: 12,
    },
    IN_COMPLETION_4: {
        name: 'Hoàn thành xây dựng tất cả, bàn giao cho bên Quản lý/ cho thuê lại',
        id: 13,
    },
    IN_SALE_1: {
        name: 'Hoàn thành xây dựng và trong quá trình khai thác cho thuê',
        id: 14,
    },
    IN_SALE_2: {
        name: 'Tạm dừng khai thác, bảo trì bảo dưỡng hoặc tu sửa các thành phần bị hỏng',
        id: 15,
    },
};

const CREATE_SOURCE = {
    AGODA: {
        name: 'Agoda',
        id: 'agoda',
    },
    GOOGLE_PLACE: {
        name: 'Google place',
        id: 'google_place',
    },
};

const DIGITIZING_APPROACH_STATE = {
    TYPE: {
        UPDATE_HOST_INFO: {
            id: 1,
            name: 'Cập nhật thông tin chủ nhà',
        },
        CONTACT_HOST_1: {
            id: 2,
            name: 'Liên hệ chủ nhà để hỏi thông tin gặp gỡ số hoá',
        },
        CONTACT_HOST_2: {
            id: 3,
            name: 'Liên hệ chủ nhà để hỏi thông tin giá phòng hoặc tình trạng trống phòng',
        },
        CONTACT_HOST_3: {
            id: 4,
            name: 'Liên hệ chủ nhà để hỏi các thông tin chung',
        },
        CONTACT_HOST_4: {
            id: 5,
            name: 'Liên hệ chủ nhà để dẫn khách đi xem nhà',
        },
        CONTACT_HOST_5: {
            id: 6,
            name: 'Liên hệ chủ nhà để confirm Booking',
        },
        CONTACT_HOST_6: {
            id: 7,
            name: 'Khác',
        },
    },
    CHANNEL: {
        DIRECT: {
            id: 1,
            name: 'Gặp gỡ trực tiếp',
        },
        PHONE: {
            id: 2,
            name: 'Gọi điện thoại',
        },
        SMS: {
            id: 3,
            name: 'Nhắn tin qua điện thoại',
        },
        ZALO: {
            id: 4,
            name: 'Nhắn tin qua Zalo',
        },
        MESSENGER: {
            id: 5,
            name: 'Nhắn tin qua Messenger',
        },
        WHATSAPP: {
            id: 6,
            name: 'Nhắn tin qua Whatsapp',
        },
        IMESSAGE: {
            id: 7,
            name: 'Nhắn tin qua iMessage',
        },
        PMS: {
            id: 8,
            name: 'Liên hệ qua Phần Mềm PMS Cozrum',
        },
        BOT_AUTO: {
            id: 9,
            name: 'Tiếp cận qua kênh Robot tự động',
        },
        OTHER: {
            id: 10,
            name: 'Các kênh khác',
        },
    },
    RESULT: {
        NO_RESPONSE: {
            id: 1,
            name: 'Không có phản hồi',
        },
        FAIL: {
            id: 2,
            name: 'Có phản hồi nhưng không đạt',
        },
        SUCCESS: {
            id: 3,
            name: 'Có phản hồi và đạt kết quả',
        },
    },
};

module.exports = {
    SALE_STATE,
    CONSTRUCTION_STATE,
    CREATE_SOURCE,
    DIGITIZING_APPROACH_STATE,
};
