const _ = require('lodash');

const { validatePage } = require('@utils/validate');
const { DATA_TYPE } = require('@utils/const');
const ThrowReturn = require('@core/throwreturn');
const models = require('@models');
const MODEL = require('@models/const');

async function checkSession(req, res) {
    const { guest } = req.decoded;

    const fields = ['name', 'phone', 'email', 'gender', 'passportNumber', 'dayOfBirth', 'momoId'];

    res.sendData({
        clientKey: guest && guest.clientKey,
        guest: _.pick(guest, fields),
    });
}

async function getFavorites(req, res) {
    const { guest } = req.decoded;

    if (!guest) {
        return res.sendData({
            data: [],
            total: 0,
        });
    }

    let { propertyType, start, limit } = validatePage(req.query);
    propertyType = parseInt(propertyType);

    const pipeline = [
        {
            $match: {
                guestId: guest._id,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $lookup: {
                from: MODEL.BLOCK.collection,
                foreignField: '_id',
                localField: 'propertyId',
                as: 'property',
            },
        },
        {
            $lookup: {
                from: MODEL.ROOM_TYPE.collection,
                foreignField: '_id',
                localField: 'roomTypeId',
                as: 'roomType',
            },
        },
    ];

    if (propertyType) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        'property.typeId': propertyType,
                    },
                    {
                        'roomType.propertyTypes': propertyType,
                    },
                ],
            },
        });
    }

    const [data, total] = await Promise.all([
        models.GUEST_ROOM_FAVORITE.aggregate([
            ...pipeline,
            {
                $unwind: {
                    path: '$property',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$roomType',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    createdAt: 1,
                    type: 1,
                    'property.images': { $slice: ['$property.images', 1] },
                    'property.address': 1,
                    'property.name': 1,
                    'property.id': 1,
                    'property.typeId': 1,
                    'property.wardId': 1,
                    'property.provinceId': 1,
                    'property.districtId': 1,
                    'property.slug': 1,
                    'roomType.images': { $slice: ['$roomType.images', 1] },
                    'roomType.blockId': 1,
                    'roomType.displayName': 1,
                    'roomType.id': 1,
                    'roomType.propertyTypes': 1,
                    'roomType.wardId': 1,
                    'roomType.provinceId': 1,
                    'roomType.districtId': 1,
                    'roomType.slug': 1,
                },
            },
            {
                $skip: start,
            },
            {
                $limit: limit,
            },
        ]),
        models.GUEST_ROOM_FAVORITE.aggregate([
            ...pipeline,
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                },
            },
        ]).then(rs => _.get(rs, '[0].total', 0)),
    ]);

    const population = [
        {
            path: 'wardId provinceId districtId',
            select: 'id name fullName',
        },
        {
            path: 'images.source',
        },
    ];

    await Promise.all([
        models.ROOM_TYPE.populate(
            data.map(item => item.roomType),
            [
                ...population,
                {
                    path: 'propertyTypes',
                    select: 'id name slug',
                },
                {
                    path: 'blockId',
                    select: 'address',
                },
            ],
        ),
        models.BLOCK.populate(
            data.map(item => item.property),
            [
                ...population,
                {
                    path: 'typeId',
                    select: 'id name slug',
                },
            ],
        ),
    ]);

    data.forEach(item => {
        _.unset(item, item.type === DATA_TYPE.ROOM ? 'property' : 'roomType');

        if (item.property) {
            item.property.cover = _.get(item.property, 'images[0].source');
            _.unset(item.property, 'images');
        } else if (item.roomType) {
            item.roomType.cover = _.get(item.roomType, 'images[0].source');
            item.roomType.address = _.get(item.roomType, 'blockId.address');

            _.unset(item.roomType, 'images');
            _.unset(item.roomType, 'blockId');
        }
    });

    res.sendData({
        data,
        total,
        start,
        limit,
    });
}

async function getDataFromBody(data) {
    let doc;

    if (data.roomTypeId) {
        doc = await models.ROOM_TYPE.findOne({ id: data.roomTypeId }).select('_id');
        data.roomTypeId = doc && doc._id;
    } else if (data.propertyId) {
        doc = await models.BLOCK.findOne({ id: data.propertyId }).select('_id');
        data.propertyId = doc && doc._id;
    }

    return doc;
}

async function addFavorite(req, res) {
    const { guest } = req.decoded;
    if (!guest) {
        throw new ThrowReturn('Missing client key!');
    }

    req.body.guestId = guest._id;
    const doc = await getDataFromBody(req.body);

    if (!doc) {
        throw new ThrowReturn('Not found data!');
    }

    await models.GUEST_ROOM_FAVORITE.create(req.body);

    res.sendData();
}

async function removeFavorite(req, res) {
    const { guest } = req.decoded;
    if (!guest) {
        throw new ThrowReturn('Missing client key!');
    }

    req.body.guestId = guest._id;
    const doc = await getDataFromBody(req.body);

    if (!doc) {
        throw new ThrowReturn('Not found data!');
    }

    await models.GUEST_ROOM_FAVORITE.deleteOne(req.body);

    res.sendData();
}

module.exports = {
    checkSession,
    getFavorites,
    addFavorite,
    removeFavorite,
};
