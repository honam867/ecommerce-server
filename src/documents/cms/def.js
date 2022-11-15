const _ = require('lodash');

const SCHEMA = {
    RESPONSE: 'Response',
    BUSINESS_SERVICE: 'BusinessService',
    DIRECTION: 'Direction',
    GEO_POINT: 'GeoPoint',
    LANGUAGE_TEXT: 'LanguageText',

    AGENT_URL: 'AgentUrl',
    AGENT_URL_STATS: 'AgentUrlStats',

    BLOCK: 'Block',
    BLOCK_TYPE: 'BlockType',
    BLOCK_PLACE: 'BlockPlace',
    BLOCK_DIGITIZING_APPROACH: 'BlockDigitizingApproach',
    ROOM_TYPE: 'RoomType',
    ROOM: 'Room',
    LAYOUT: 'Layout',
    RESOURCE: 'Resource',

    VR: 'VR',
    VR_ACCOUNT: 'VRAccount',
    VR_CAMERA: 'VRCamera',
    VR_CONFIG: 'VRConfig',

    BOOKING: 'Booking',
    REVIEW: 'Review',
    GUEST: 'Guest',
    USER: 'User',
    DOOR_ACCESS_LOG: 'DoorAccessLog',
    WORK_NOTE: 'WorkNote',

    CTG_PLACE: 'CtgPlace',
    CTG_AMENITIES: 'CtgAmenities',
    CTG_AMENITIES_GROUP: 'CtgAmenitiesGroup',
    CTG_FACILITIES: 'CtgFacilities',
    CTG_FACILITIES_GROUP: 'CtgFacilitiesGroup',
    CTG_ROOM_TYPE: 'CtgRoomType',
    CTG_TAG: 'CtgTag',
    CTG_TEMPLATE_URL: 'CtgTemplateUrl',
    LOC_COUNTRY: 'LocCountry',
    LOC_PROVINCE: 'LocProvince',
    LOC_DISTRICT: 'LocDistrict',
    LOC_WARD: 'LocWard',
    LOC_STREET: 'LocStreet',
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
    [SCHEMA.DIRECTION]: {
        type: 'string',
        enum: ['south', 'west', 'north', 'east', 'northeast', 'northwest', 'southeast', 'southwest'],
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
    [SCHEMA.CTG_AMENITIES]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            name: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            groupId: {
                $ref: SCHEMA$REF.CTG_AMENITIES_GROUP,
            },
        },
    },
    [SCHEMA.CTG_FACILITIES_GROUP]: {
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
    [SCHEMA.CTG_FACILITIES]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            name: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            groupId: {
                $ref: SCHEMA$REF.CTG_FACILITIES_GROUP,
            },
        },
    },
    [SCHEMA.CTG_AMENITIES_GROUP]: {
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
    [SCHEMA.CTG_ROOM_TYPE]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            slug: {
                type: 'number',
            },
            name: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
        },
    },
    [SCHEMA.CTG_PLACE]: {
        type: 'object',
        properties: {
            description: {
                $ref: SCHEMA$REF.LANGUAGE_TEXT,
            },
            name: {
                type: 'string',
            },
            address: {
                type: 'string',
            },
            location: {
                $ref: SCHEMA$REF.GEO_POINT,
            },
            type: {
                type: 'number',
            },
            createdBy: {
                type: 'string',
            },
        },
    },
    [SCHEMA.LOC_COUNTRY]: {
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
    [SCHEMA.LOC_PROVINCE]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOC_COUNTRY,
            },
            {
                type: 'object',
                properties: {
                    countryId: {
                        $ref: SCHEMA$REF.LOC_COUNTRY,
                    },
                    location: {
                        $ref: SCHEMA$REF.GEO_POINT,
                    },
                },
            },
        ],
    },
    [SCHEMA.LOC_DISTRICT]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOC_COUNTRY,
            },
            {
                type: 'object',
                properties: {
                    provinceId: {
                        $ref: SCHEMA$REF.LOC_PROVINCE,
                    },
                    location: {
                        $ref: SCHEMA$REF.GEO_POINT,
                    },
                },
            },
        ],
    },
    [SCHEMA.LOC_WARD]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOC_COUNTRY,
            },
            {
                type: 'object',
                properties: {
                    districId: {
                        $ref: SCHEMA$REF.LOC_DISTRICT,
                    },
                    fullName: {
                        type: 'string',
                    },
                    prefix: {
                        type: 'string',
                    },
                    location: {
                        $ref: SCHEMA$REF.GEO_POINT,
                    },
                },
            },
        ],
    },
    [SCHEMA.LOC_STREET]: {
        allOf: [
            {
                $ref: SCHEMA$REF.LOC_COUNTRY,
            },
            {
                type: 'object',
                properties: {
                    districId: {
                        $ref: SCHEMA$REF.LOC_DISTRICT,
                    },
                },
            },
        ],
    },
    [SCHEMA.CTG_TAG]: {
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
    [SCHEMA.BLOCK_TYPE]: {
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
    [SCHEMA.BLOCK_PLACE]: {
        type: 'object',
        properties: {
            placeId: {
                type: 'string',
            },
            blockId: {
                type: 'string',
            },
            createdBy: {
                type: 'string',
            },
            direction: {
                type: 'string',
            },
            distance: {
                type: 'number',
            },
        },
    },
    [SCHEMA.BLOCK_DIGITIZING_APPROACH]: {
        type: 'object',
        properties: {
            type: {
                type: 'number',
            },
            channel: {
                type: 'number',
            },
            result: {
                type: 'number',
            },
            content: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            blockId: {
                type: 'string',
            },
            roomId: {
                type: 'string',
            },
            roomTypeId: {
                type: 'string',
            },
            createdBy: {
                type: 'string',
            },
        },
    },
    [SCHEMA.USER]: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
            group: {
                type: 'string',
            },
            enable: {
                type: 'boolean',
            },
            name: {
                type: 'string',
            },
            address: {
                type: 'string',
            },
            avatar: {
                type: 'string',
            },
            contact: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'string',
                    },
                    email: {
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
                },
            },
        },
    },
    [SCHEMA.ROOM_TYPE]: {
        type: 'object',
        properties: {
            id: {
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
            blockId: {
                $ref: SCHEMA$REF.BLOCK,
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
    [SCHEMA.ROOM]: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            info: {
                properties: {
                    roomNo: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    wifi: {
                        type: 'string',
                    },
                    wifiPassword: {
                        type: 'string',
                    },
                },
            },
            active: {
                type: 'boolean',
            },
            blockId: {
                type: 'string',
            },
            roomTypeId: {
                type: 'string',
            },
            createdBy: {
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
                        en: {
                            type: 'array',
                            items: 'string',
                        },
                        vi: {
                            type: 'array',
                            items: 'string',
                        },
                        images: {
                            type: 'array',
                            items: 'string',
                        },
                    },
                },
            },
        },
    },
    [SCHEMA.BLOCK]: {
        type: 'object',
        properties: {
            location: {
                $ref: SCHEMA$REF.GEO_POINT,
            },
            typeId: {
                type: 'array',
                items: {
                    $ref: SCHEMA$REF.BLOCK_TYPE,
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
            blockId: {
                $ref: SCHEMA$REF.PROPERTY,
            },
        },
    },
    [SCHEMA.DOOR_ACCESS_LOG]: {
        type: 'object',
        properties: {
            blockId: {
                type: 'string',
            },
            roomId: {
                type: 'string',
            },
            bookingId: {
                type: 'string',
            },
            userId: {
                type: 'string',
            },
            time: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
        },
    },
    [SCHEMA.WORK_NOTE]: {
        type: 'object',
        properties: {
            blockId: {
                type: 'string',
            },
            roomTypeId: {
                type: 'string',
            },
            bookingId: {
                type: 'string',
            },
            note: {
                type: 'string',
            },
            images: {
                type: 'array',
                items: {
                    $ref: SCHEMA$REF.RESOURCE,
                },
            },
            status: {
                type: 'string',
                enum: ['doing', 'done', 'closed'],
                default: 'doing',
            },
            createdBy: {
                $ref: SCHEMA$REF.USER,
            },
            type: {
                type: 'string',
                enum: [1, 2],
                description: '1 normal note, 2 host only',
            },
        },
    },
    [SCHEMA.VR]: {
        type: 'object',
        properties: {
            num: {
                type: 'string',
            },
            title: {
                type: 'string',
            },
            blocks: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            roomTypes: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            propertyType: {
                type: 'number',
            },
            totalFileCache: {
                type: 'number',
            },
            updated: {
                type: 'boolean',
            },
            locked: {
                type: 'boolean',
            },
            cacheUpdated: {
                type: 'boolean',
            },
            upstreamData: {
                type: 'object',
            },
        },
    },
    [SCHEMA.VR_ACCOUNT]: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
            token: {
                type: 'string',
            },
        },
    },
    [SCHEMA.VR_CAMERA]: {
        type: 'object',
        properties: {
            snCode: {
                type: 'string',
            },
            upstreamData: {
                type: 'object',
            },
        },
    },
    [SCHEMA.VR_CONFIG]: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            photo: {
                type: 'string',
            },
            spotPhoto: {
                type: 'string',
            },
            spotPhotoSize: {
                type: 'number',
            },
        },
    },
    [SCHEMA.CTG_TEMPLATE_URL]: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
        },
    },
    [SCHEMA.AGENT_URL]: {
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
                type: 'string',
            },
            template: {
                type: 'string',
            },
            blockId: {
                type: 'string',
            },
            roomTypeId: {
                type: 'string',
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
                type: 'string',
            },
            cover: {
                type: 'string',
            },
            active: {
                type: 'boolean',
            },
        },
    },
};

module.exports = {
    definitions,
    SCHEMA,
    SCHEMA$REF,
};
