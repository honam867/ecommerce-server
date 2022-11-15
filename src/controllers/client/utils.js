const _ = require('lodash');
const moment = require('moment');
const ThrowReturn = require('@core/throwreturn');
const { SALE_STATE } = require('@utils/blockState');
const { SERVICES } = require('@utils/const');

function parseSlug(slug) {
    const query = {};
    slug = slug || '';
    if (!slug.match(/\D/)) {
        query.id = parseInt(slug);
    } else {
        query.slug = slug;
    }
    return query;
}

function getPropertyPopulation() {
    return [
        {
            path: 'typeId operator services',
            select: '-_id',
        },
        {
            path: 'wardId provinceId districtId',
            select: 'id name prefix slug',
        },
    ];
}

function getServiceKey(service) {
    if (service === SERVICES.HOUR) return ['firstHour', 'availableTime'];
    if (service === SERVICES.DAY) return ['day', 'available'];
    if (service === SERVICES.NIGHT) return ['night', 'availableNight'];
    return ['monthly', 'available'];
}

const PROPERTY_TYPE = {
    SERVICE_APARTMENT: 1,
    CONDO: 2,
    HOTEL: 3,
    MOTEL: 4,
    DORMITORY: 5,
    HOMESTAY: 6,
    VILLA: 7,
    LIP_HOTEL: 8,
};

// const SERVICE_TYPE_MAPPER = {
//     [SERVICES.MONTH]: PROPERTY_TYPE.SERVICE_APARTMENT,
//     [SERVICES.DAY]: PROPERTY_TYPE.HOMESTAY,
//     [SERVICES.HOUR]: PROPERTY_TYPE.LIP_HOTEL,
//     [SERVICES.NIGHT]: PROPERTY_TYPE.HOTEL,
// };

function standardizeQuery(query) {
    const ne_lat = Number(query.ne_lat) || undefined;
    const ne_lng = Number(query.ne_lng) || undefined;
    const sw_lat = Number(query.sw_lat) || undefined;
    const sw_lng = Number(query.sw_lng) || undefined;
    const min_price = parseInt(query.min_price) || undefined;
    const max_price = parseInt(query.max_price) || undefined;
    const area = Number(query.area) || undefined;
    const locId = parseInt(query.locId) || undefined;
    const province = parseInt(query.province) || undefined;
    const district = parseInt(query.district) || undefined;
    const ward = parseInt(query.ward) || undefined;
    const businessService = parseInt(query.businessService) || SERVICES.MONTH;
    const type = parseInt(query.type) || undefined;
    const bedroom = parseInt(query.bedroom) || undefined;
    const bed = parseInt(query.bed) || undefined;
    const street = parseInt(query.street) || undefined;
    const zoom = parseInt(query.zoom) || undefined;

    const checkIn = query.checkIn ? new Date(query.checkIn) : moment().startOf('hour').toDate();
    const checkOut = query.checkOut
        ? new Date(query.checkOut)
        : moment(checkIn)
              .add(1, businessService === SERVICES.HOUR ? 'hour' : 'day')
              .toDate();

    if (businessService && !_.values(SERVICES).includes(businessService)) {
        throw new ThrowReturn('Invalid service!');
    }
    if (checkOut <= checkIn) {
        throw new ThrowReturn('Check-out time must be after check-in time!');
    }

    return {
        ...query,
        checkIn,
        checkOut,
        area,
        min_price,
        max_price,
        businessService,
        ne_lat,
        ne_lng,
        sw_lat,
        sw_lng,
        locId,
        province,
        district,
        ward,
        type,
        bedroom,
        bed,
        street,
        zoom,
    };
}

const DEFAULT_BLOCK_QUERY = {
    saleState: SALE_STATE.IN_SALE.id,
    deleted: false,
};
const DEFAULT_ROOM_QUERY = {
    status: SALE_STATE.IN_SALE.id,
    deleted: false,
};
const SORT = {
    RECOMMENED: 'recommended',
    NEWEST: 'newest',
    PRICE: 'price',
};
const SORT_TYPE = {
    ASC: 'asc',
    DESC: 'desc',
};
const MAP_ITEM_LIMIT = 2000;
const HOTEL_TYPE_IDS = [PROPERTY_TYPE.HOTEL, PROPERTY_TYPE.MOTEL, PROPERTY_TYPE.LIP_HOTEL];
const CARD_TYPE = {
    LARGE: 'card_large',
};

module.exports = {
    parseSlug,
    getPropertyPopulation,
    getServiceKey,
    standardizeQuery,
    DEFAULT_BLOCK_QUERY,
    DEFAULT_ROOM_QUERY,
    SORT,
    SORT_TYPE,
    MAP_ITEM_LIMIT,
    HOTEL_TYPE_IDS,
    PROPERTY_TYPE,
    CARD_TYPE,
};
