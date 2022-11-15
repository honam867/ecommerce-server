const _ = require('lodash');

const SCHEMA = {
    RESPONSE: 'Response',
    BUSINESS_SERVICE: 'BusinessService',
    SEARCH_RESULT: 'SearchResult',
    ROOM_TYPE: 'RoomType',
    ROOM_PRICE: 'RoomPrice',
    ROOM_AVAILABLE: 'RoomAvailable',
    ROOM_BED_TYPE: 'RoomBedType',
    PROPERTY: 'Property',
    PROPERTY_TYPE: 'PropertyType',
    REVIEW: 'Review',
    INQUIRY: 'Inquiry',
    AMENITIES: 'Amenities',
    LANGUAGE_TEXT: 'LanguageText',
    DIRECTION: 'Direction',
    RESOURCE: 'Resource',
    PLACE: 'Place',
    LAYOUT: 'Layout',
    GUEST: 'Guest',
    BOOKING: 'Booking',
    BOOKING_GUIDE: 'BookingGuide',
    GEO_POINT: 'GeoPoint',
    GEO_POLYGON: 'GeoPolygon',
    LOCATION: 'Location',
    PROVINCE: 'Province',
    DISTRICT: 'District',
    WARD: 'Ward',
    STREET: 'Street',
    TAG: 'Tag',
    GEO_HASH: 'GeoHash',
    SEO: 'SEO',
    AGENT: 'AGENT',
    URL_3D: 'URL_3D',
};

const SCHEMA$REF = _.reduce(_.entries(SCHEMA), (acc, [key, sch]) => ({ ...acc, [key]: `#/definitions/${sch}` }), {});

const definitions = {
    [SCHEMA.RESPONSE]: {
        type: 'object',
        properties: {
            error_code: {
                type: 'integer',
            },
            error_msg: {
                type: 'string',
            },
            data: {
                type: 'object',
            },
        },
    },
    [SCHEMA.BUSINESS_SERVICE]: {
        type: 'number',
        description: '1: hour, 2: night, 3: day. 4: month',
        enum: [1, 2, 3, 4],
    },
    [SCHEMA.SEARCH_RESULT]: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: ['property', 'room', 'ward', 'province', 'district'],
            },
            displayText: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            meta: {
                type: 'object',
                properties: {
                    address: {
                        $ref: SCHEMA$REF.LANGUAGE_TEXT,
                    },
                    cover: {
                        type: 'string',
                    },
                    displayName: {
                        type: 'string',
                    },
                    slug: {
                        type: 'string',
                    },
                },
            },
        },
    },
    [SCHEMA.ROOM_TYPE]: {
        type: 'object',
        properties: {
            available: {
                type: 'number',
            },
            description: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            displayName: {
                type: 'string',
            },
            slug: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            direction: {
                $ref: SCHEMA$REF.DIRECTION,
            },
            occupancy: {
                type: 'object',
                properties: {
                    maxGuest: {
                        type: 'number',
                    },
                    numberOfAdults: {
                        type: 'number',
                    },
                    numberOfChildren: {
                        type: 'number',
                    },
                    numberOfInfants: {
                        type: 'number',
                    },
                    standardGuest: {
                        type: 'number',
                    },
                },
            },
            price: {
                type: 'object',
                properties: {
                    currency: {
                        type: 'string',
                    },
                    max: {
                        type: 'number',
                    },
                    min: {
                        type: 'number',
                    },
                    monthly: {
                        type: 'number',
                    },
                },
            },
            info: {
                type: 'object',
                properties: {
                    area: {
                        type: 'number',
                    },
                    bathroom: {
                        type: 'number',
                    },
                    bed: {
                        type: 'number',
                    },
                    bedroom: {
                        type: 'number',
                    },
                    kitchen: {
                        type: 'number',
                    },
                },
            },
            property: {
                $ref: SCHEMA$REF.PROPERTY,
            },
            tags: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            images: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        tag: {
                            type: 'string',
                        },
                    },
                },
            },
            videos: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        cover: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        tag: {
                            type: 'string',
                        },
                    },
                },
            },
            vr: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        url: {
                            type: 'string',
                        },
                        type: {
                            type: 'number',
                            enum: [1, 2],
                        },
                    },
                },
            },
            amenities: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        images: {
                            type: 'array',
                            items: {
                                $ref: SCHEMA$REF.RESOURCE,
                            },
                        },
                        id: {
                            $ref: SCHEMA$REF.AMENITIES,
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.ROOM_BED_TYPE]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            slug: {
                type: 'number',
            },
            name: {
                $ref: '#/definitions/LanguageText',
            },
        },
    },
    [SCHEMA.PROPERTY]: {
        type: 'object',
        properties: {
            location: {
                $ref: SCHEMA$REF.GEO_POINT,
            },
            typeId: {
                type: 'array',
                items: {
                    $ref: SCHEMA$REF.PROPERTY_TYPE,
                },
            },
            name: {
                type: 'string',
            },
            description: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            owner: {
                type: 'string',
            },
            totalFloor: {
                type: 'number',
            },
            totalRoom: {
                type: 'number',
            },
            area: {
                type: 'number',
            },
            address: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            completionTime: {
                type: 'string',
            },
            slug: {
                type: 'string',
            },
            operator: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                    },
                    logo: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                },
            },
            userInCharge: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                    phone: {
                        type: 'string',
                    },
                    avatar: {
                        $ref: SCHEMA$REF.RESOURCE,
                    },
                },
            },
            images: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        tag: {
                            type: 'string',
                        },
                    },
                },
            },
            videos: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        cover: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        tag: {
                            type: 'string',
                        },
                    },
                },
            },
            vr: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        source: {
                            $ref: SCHEMA$REF.RESOURCE,
                        },
                        url: {
                            type: 'string',
                        },
                        type: {
                            type: 'number',
                            enum: [1, 2],
                        },
                    },
                },
            },
            facilities: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        images: {
                            type: 'array',
                            items: {
                                $ref: SCHEMA$REF.RESOURCE,
                            },
                        },
                        id: {
                            $ref: SCHEMA$REF.AMENITIES,
                        },
                    },
                },
            },
            roomTypes: {
                type: 'array',
                items: {
                    $ref: SCHEMA$REF.ROOM_TYPE,
                },
            },
        },
    },
    [SCHEMA.PROPERTY_TYPE]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            name: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            subTitle: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            defaultService: {
                type: 'number',
            },
            slug: {
                type: 'string',
            },
            cover: {
                $ref: SCHEMA$REF.RESOURCE,
            },
        },
    },
    [SCHEMA.REVIEW]: {
        type: 'object',
        properties: {
            scores: {
                type: 'string',
            },
            rating: {
                type: 'number',
            },
            comments: {
                type: 'string',
            },
            createdAt: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            fullName: {
                type: 'string',
            },
        },
    },
    [SCHEMA.INQUIRY]: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                required: true,
            },
            lastName: {
                type: 'string',
                required: true,
            },
            phone: {
                type: 'string',
                required: true,
            },
            email: {
                type: 'string',
            },
            message: {
                type: 'string',
            },
            time: {
                type: 'string',
                description: 'Buổi sáng / trưa / tối (chỉ nhập nếu là đặt tháng)',
                enum: ['morning', 'noon', 'evening'],
            },
            checkIn: {
                required: true,
                description: 'Ngày định dạng ISOString',
                type: 'string',
            },
            checkOut: {
                description: 'Ngày định dạng ISOString',
                type: 'string',
            },
            guests: {
                type: 'number',
                description: 'Số lượng khách',
            },
            rooms: {
                type: 'number',
                description: 'Số lượng phòng',
            },
            businessService: {
                type: 'number',
                enum: [1, 2, 3, 4],
            },
            paymentValue: {
                type: 'string',
                description: 'Loại phí dịch vụ (nếu có)',
            },
            slug: {
                description: 'Slug của phòng / nhà',
                required: true,
                type: 'string',
            },
            type: {
                description: 'Loại nhà / phòng (áp dụng cho đặt tháng)',
                type: 'string',
                enum: ['room', 'property'],
            },
        },
    },
    [SCHEMA.AMENITIES]: {
        type: 'object',
        properties: {
            groupId: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                    },
                    name: {
                        $ref: SCHEMA$REF.LANGUAGE_TEXT,
                    },
                },
            },
            id: {
                type: 'number',
            },
            name: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
        },
    },
    [SCHEMA.LANGUAGE_TEXT]: {
        type: 'object',
        properties: {
            vi: {
                type: 'string',
            },
            en: {
                type: 'string',
            },
            ko: {
                type: 'string',
            },
            zh: {
                type: 'string',
            },
            ja: {
                type: 'string',
            },
        },
    },
    [SCHEMA.DIRECTION]: {
        type: 'string',
        enum: ['south', 'west', 'north', 'east', 'northeast', 'northwest', 'southeast', 'southwest'],
    },
    [SCHEMA.RESOURCE]: {
        type: 'object',
        properties: {
            path: {
                type: 'string',
            },
            _id: {
                type: 'string',
            },
            screen: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['small', 'medium', 'large', 'x_large'],
                },
            },
            url: {
                type: 'object',
                properties: {
                    origin: {
                        type: 'string',
                    },
                    large: {
                        type: 'string',
                    },
                    medium: {
                        type: 'string',
                    },
                    small: {
                        type: 'string',
                    },
                },
            },
        },
    },
    [SCHEMA.PLACE]: {
        type: 'object',
        properties: {
            description: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            _id: {
                type: 'string',
            },
            placeId: {
                type: 'object',
                properties: {
                    name: {
                        $ref: SCHEMA$REF.LANGUAGE_TEXT,
                    },
                    location: {
                        $ref: SCHEMA$REF.GEO_POINT,
                    },
                    type: {
                        type: 'object',
                        properties: {
                            name: {
                                $ref: SCHEMA$REF.LANGUAGE_TEXT,
                            },
                            id: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.LAYOUT]: {
        type: 'object',
        properties: {
            description: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            name: {
                type: 'string',
            },
            layoutY: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        layoutX: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    roomId: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'number',
                                            },
                                            info: {
                                                type: 'object',
                                                properties: {
                                                    roomNo: {
                                                        type: 'string',
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.GUEST]: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            fullName: {
                type: 'string',
            },
            phone: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            address: {
                type: 'string',
            },
            passportNumber: {
                type: 'string',
            },
            dayOfBirth: {
                type: 'string',
            },
            momoId: {
                type: 'string',
            },
            gender: {
                type: 'string',
                enum: ['male', 'female', 'other'],
            },
        },
    },
    [SCHEMA.BOOKING]: {
        type: 'object',
        properties: {
            otaName: {
                type: 'string',
            },
            from: {
                type: 'string',
            },
            to: {
                type: 'string',
            },
            price: {
                type: 'string',
            },
            currency: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            numberAdults: {
                type: 'string',
            },
            numberChilden: {
                type: 'string',
            },
            guestId: {
                $ref: SCHEMA$REF.GUEST,
            },
            roomTypeId: {
                $ref: SCHEMA$REF.ROOM_TYPE,
            },
            propertyId: {
                $ref: SCHEMA$REF.PROPERTY,
            },
            payment: {
                type: 'object',
                properties: {
                    amount: {
                        type: 'number',
                    },
                    totalPaid: {
                        type: 'number',
                    },
                    totalPrice: {
                        type: 'number',
                    },
                },
            },
        },
    },
    [SCHEMA.BOOKING_GUIDE]: {
        type: 'object',
        properties: {
            bookingId: {
                type: 'string',
            },
            checkPassport: {
                type: 'boolean',
            },
            guest: {
                $ref: SCHEMA$REF.GUEST,
            },
            property: {
                $ref: SCHEMA$REF.PROPERTY,
            },
            roomType: {
                $ref: SCHEMA$REF.ROOM_TYPE,
            },
            checkin: {
                type: 'string',
            },
            checkout: {
                type: 'string',
            },
            payment: {
                type: 'object',
                properties: {
                    amount: {
                        type: 'number',
                    },
                    totalPaid: {
                        type: 'number',
                    },
                    totalPrice: {
                        type: 'number',
                    },
                },
            },
            otaBookingId: {
                type: 'string',
            },
            otaName: {
                type: 'string',
            },
            newGuide: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        vi: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        en: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.ROOM_PRICE]: {
        type: 'object',
        properties: {
            VAT: {
                type: 'number',
            },
            noVATPrice: {
                type: 'number',
            },
            noVATPromoPrice: {
                type: 'number',
            },
            price: {
                type: 'number',
            },
            promotionPrice: {
                type: 'number',
            },
        },
    },
    [SCHEMA.ROOM_AVAILABLE]: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                date: {
                    type: 'number',
                },
                available: {
                    type: 'number',
                },
                availableTime: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            },
        },
    },
    [SCHEMA.GEO_POINT]: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: ['Point'],
            },
            coordinates: {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
        },
    },
    [SCHEMA.GEO_POLYGON]: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: ['Point'],
            },
            coordinates: {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                            type: 'number',
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.LOCATION]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            name: {
                type: 'string',
            },
        },
    },
    [SCHEMA.PROVINCE]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOCATION,
            },
            {
                type: 'object',
                properties: {
                    countryId: {
                        type: 'string',
                    },
                },
            },
        ],
    },
    [SCHEMA.DISTRICT]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOCATION,
            },
            {
                type: 'object',
                properties: {
                    provinceId: {
                        type: 'string',
                    },
                },
            },
        ],
    },
    [SCHEMA.WARD]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOCATION,
            },
            {
                type: 'object',
                properties: {
                    districId: {
                        type: 'string',
                    },
                    fullName: {
                        type: 'string',
                    },
                    prefix: {
                        type: 'string',
                    },
                },
            },
        ],
    },
    [SCHEMA.STREET]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOCATION,
            },
            {
                type: 'object',
                properties: {
                    districId: {
                        type: 'string',
                    },
                },
            },
        ],
    },
    [SCHEMA.TAG]: {
        type: 'object',
        properties: {
            label: {
                type: 'string',
            },
            slug: {
                type: 'string',
            },
        },
    },
    [SCHEMA.GEO_HASH]: {
        type: 'object',
        properties: {
            lat: {
                type: 'string',
            },
            lng: {
                type: 'string',
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
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        slug: {
                            type: 'string',
                        },
                        price: {
                            type: 'number',
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.SEO]: {
        type: 'object',
        properties: {
            link: {
                type: 'object',
                properties: {
                    tags: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.TAG,
                        },
                    },
                    types: {
                        type: 'array',
                        items: {
                            $ref: SCHEMA$REF.ROOM_BED_TYPE,
                        },
                    },
                    locations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                count: {
                                    type: 'number',
                                },
                                type: {
                                    type: 'string',
                                },
                                data: {
                                    type: 'array',
                                    items: {
                                        oneOf: [
                                            {
                                                $ref: SCHEMA$REF.PROVINCE,
                                            },
                                            {
                                                $ref: SCHEMA$REF.DISTRICT,
                                            },
                                            {
                                                $ref: SCHEMA$REF.WARD,
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    streets: {
                        type: 'array',
                        items: {
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        amount: {
                                            type: 'string',
                                        },
                                    },
                                },
                                {
                                    $ref: SCHEMA$REF.STREET,
                                },
                            ],
                        },
                    },
                },
            },
            faqs: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string',
                        },
                        anwser: {
                            type: 'string',
                        },
                    },
                },
            },
            review: {
                type: 'object',
                properties: {
                    total: {
                        type: 'number',
                    },
                    rating: {
                        type: 'number',
                    },
                },
            },
        },
    },
    [SCHEMA.AGENT]: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            avatar: {
                $ref: SCHEMA$REF.RESOURCE,
            },
            contact: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'number',
                    },
                    email: {
                        type: 'number',
                    },
                    whatsapp: {
                        type: 'number',
                    },
                    zalo: {
                        type: 'number',
                    },
                    messager: {
                        type: 'number',
                    },
                },
            },
        },
    },
    [SCHEMA.URL_3D]: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            label: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            source: {
                type: 'object',
                properties: {
                    webSite: {
                        type: 'string',
                    },
                    num: {
                        type: 'string',
                    },
                },
            },
            template: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
            roomType: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                    },
                    slug: {
                        type: 'string',
                    },
                },
            },
            contact: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'string',
                    },
                    zalo: {
                        type: 'string',
                    },
                    whatsapp: {
                        type: 'string',
                    },
                    messager: {
                        type: 'string',
                    },
                    sms: {
                        type: 'string',
                    },
                },
            },
            activeContact: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'boolean',
                    },
                    zalo: {
                        type: 'boolean',
                    },
                    whatsapp: {
                        type: 'boolean',
                    },
                    messager: {
                        type: 'boolean',
                    },
                    sms: {
                        type: 'boolean',
                    },
                },
            },
            logo: {
                $ref: SCHEMA$REF.RESOURCE,
            },
            cover: {
                $ref: SCHEMA$REF.RESOURCE,
            },
        },
    },
};

module.exports = {
    definitions,
    SCHEMA,
    SCHEMA$REF,
};
