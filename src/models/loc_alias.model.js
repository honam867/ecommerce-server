/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const _ = require('lodash');

const { removeAccents } = require('@utils/generate');
const { SUBDIVITION, SERVICES, LANGUAGE } = require('@utils/const');
const { SALE_STATE } = require('@utils/blockState');
const MODELS = require('./const');

const { Schema } = mongoose;

const ModelSchema = new Schema(
    {
        _id: { type: Number },
        id: { type: Number },
        displayText: {
            vi: String,
            en: String,
        },
        alias: String,
        count: { type: Number, default: 0 },
        roomCount: { type: Number, default: 0 },
        type: { type: String, enum: _.values(SUBDIVITION) },
        propertyType: { type: Schema.Types.Mixed },
        roomOfPropertyType: { type: Schema.Types.Mixed },
        businessService: { type: Schema.Types.Mixed },
        roomOfBusinessService: { type: Schema.Types.Mixed },
        locId: { type: Number },
        searchCount: { type: Number },
        province: { type: Number, ref: MODELS.LOC_PROVINCE.name },
        district: { type: Number, ref: MODELS.LOC_DISTRICT.name },
        ward: { type: Number, ref: MODELS.LOC_WARD.name },
        street: { type: Number, ref: MODELS.LOC_STREET.name },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

ModelSchema.index(
    {
        type: 1,
        locId: 1,
    },
    {
        unique: true,
    },
);
ModelSchema.index({
    'displayText.en': 'text',
    alias: 'text',
});

ModelSchema.pre('save', function (next) {
    if (!this._id) {
        LocModal.findOne()
            .select('_id')
            .sort({ _id: -1 })
            .then(last => {
                this._id = _.get(last, '_id', 0) + 1;
                this.id = this._id;
                next();
            });
    } else {
        next();
    }
});

ModelSchema.post('save', doc => {
    LocModal.updateCountOfLocation(doc);
});

// function getDisplayText(text) {
//     return {
//         vi: text,
//         en: removeAccents(text),
//     };
// }
function getCountProjection(propertyTypeId, businessService) {
    const byProperty = businessService === SERVICES.HOUR;
    return {
        countType: `$${
            propertyTypeId
                ? `${byProperty ? 'propertyType' : 'roomOfPropertyType'}.${propertyTypeId}`
                : byProperty
                ? 'count'
                : 'roomCount'
        }`,
        countService: `$${
            businessService
                ? `${byProperty ? 'businessService' : 'roomOfBusinessService'}.${businessService}`
                : byProperty
                ? 'count'
                : 'roomCount'
        }`,
    };
}

ModelSchema.statics = {
    async updateCountOfLocation(doc) {
        const properties = await this.model(MODELS.BLOCK.name)
            .aggregate()
            .match({
                [`${doc.type}Id`]: doc.locId,
                saleState: SALE_STATE.IN_SALE.id,
                deleted: false,
            })
            .project('typeId businessServices');

        const groupType = _.groupBy(_.flatten(_.map(properties, 'typeId')));
        const groupService = _.groupBy(_.flatten(_.map(properties, 'businessServices')));

        const propertyType = {};
        const businessService = {};
        const count = properties.length;

        _.forEach(groupType, (data, typeId) => {
            propertyType[typeId] = data.length;
        });
        _.forEach(groupService, (data, serviceId) => {
            businessService[serviceId] = data.length;
        });

        await this.updateOne({ _id: doc._id }, { count, propertyType, businessService });
    },

    async createLoc({ wardId, streetId }) {
        if (wardId) {
            const ward = await this.model(MODELS.LOC_WARD.name)
                .findById(wardId)
                .populate({
                    path: 'districtId',
                    select: '-boundaries -location',
                    populate: {
                        path: 'provinceId',
                        select: '-boundaries -location',
                    },
                });
            const province = _.get(ward, 'districtId.provinceId');
            if (province) {
                await this.createOrUpdate({
                    type: SUBDIVITION.PROVINCE,
                    locId: province._id,
                    province: province.id,
                    displayText: {
                        vi: province.name,
                        en: province.alias,
                    },
                });

                await this.createOrUpdate({
                    type: SUBDIVITION.DISTRICT,
                    locId: ward.districtId._id,
                    province: province.id,
                    district: ward.districtId._id,
                    displayText: {
                        vi: _.compact([ward.districtId.name, province.name]).join(', '),
                        en: _.compact([ward.districtId.alias, province.alias]).join(', '),
                    },
                });

                await this.createOrUpdate({
                    type: SUBDIVITION.WARD,
                    locId: wardId,
                    province: province.id,
                    district: ward.districtId._id,
                    ward: wardId,
                    displayText: {
                        vi: _.compact([ward.fullName, ward.districtId.name, province.name]).join(', '),
                        en: _.compact([ward.alias, ward.districtId.alias, province.alias]).join(', '),
                    },
                });
            }
        }
        if (streetId) {
            const street = await this.model(MODELS.LOC_STREET.name)
                .findById(streetId)
                .populate({
                    path: 'districtId',
                    select: '-boundaries -location',
                    populate: {
                        path: 'provinceId',
                        select: '-boundaries -location',
                    },
                });
            const province = _.get(street, 'districtId.provinceId');
            if (province) {
                await this.createOrUpdate({
                    type: SUBDIVITION.STREET,
                    locId: streetId,
                    district: street.districtId._id,
                    province: province._id,
                    street: street._id,
                    displayText: {
                        vi: _.compact([street.name, street.districtId.name, province.name]).join(', '),
                        en: _.compact([street.alias, street.districtId.alias, province.alias]).join(', '),
                    },
                });
            }
        }
    },

    async createOrUpdate(data) {
        const { type, locId } = data;
        // data.displayText = getDisplayText(data.displayText);
        data.alias = removeAccents(data.displayText.vi);
        const doc = (await this.findOne({ type, locId })) || new this();
        doc.set(data);
        await doc.save();
    },

    async getSEOLocations({ districtId, provinceId, propertyTypeId, businessService, language }) {
        const query = {
            count: { $gt: 0 },
        };
        if (districtId) {
            query.type = SUBDIVITION.WARD;
            query.district = districtId;
        } else if (provinceId) {
            query.type = SUBDIVITION.DISTRICT;
            query.province = provinceId;
        } else {
            query.type = SUBDIVITION.PROVINCE;
        }

        const locations = await this.aggregate()
            .match(query)
            .project({
                ...getCountProjection(propertyTypeId, businessService),
                type: 1,
                [query.type]: 1,
            })
            .addFields({
                count: { $min: ['$countType', '$countService'] },
            })
            .sort({ count: -1 })
            .limit(10);

        const isVi = language === LANGUAGE.VI;

        await this.populate(locations, {
            path: query.type,
            select: _.pickBy({
                id: 1,
                name: isVi ? 1 : '$alias',
                slug: 1,
                prefix: isVi ? 1 : null,
            }),
        });

        return locations.map(l => ({
            count: l.count,
            type: l.type,
            data: l[l.type],
        }));
    },

    async getSEOStreets({ districtId, propertyTypeId, businessService, language }) {
        const query = {
            type: SUBDIVITION.STREET,
            count: { $gt: 0 },
        };
        if (districtId) {
            query.district = districtId;
        }

        const locations = await this.aggregate()
            .match(query)
            .project({
                ...getCountProjection(propertyTypeId, businessService),
                type: 1,
                [query.type]: 1,
            })
            .addFields({
                count: { $min: ['$countType', '$countService'] },
            })
            .sort({ count: -1 })
            .limit(10);

        await this.populate(locations, {
            path: query.type,
            select: {
                id: 1,
                name: language === LANGUAGE.VI ? 1 : '$alias',
                slug: 1,
            },
        });

        return locations.map(l => ({
            count: l.count,
            type: l.type,
            data: l[l.type],
        }));
    },
};

const LocModal = mongoose.model(MODELS.LOC_ALIAS.name, ModelSchema, MODELS.LOC_ALIAS.collection);
module.exports = LocModal;
