const _ = require('lodash');

const { SERVICES, SERVICES_SLUG, LANGUAGE } = require('@utils/const');
const { getSEO } = require('@services/adapter');
const models = require('@models');

const SERVICE_KEYS = {};
_.entries(SERVICES_SLUG).forEach(([k, slug]) => {
    SERVICE_KEYS[slug] = SERVICES[k];
});
const LOCATION_KEYS = {};
const PROPERTY_TYPES = [];

(async function init() {
    const provinces = await models.LOC_PROVINCE.aggregate().match({}).project('_id slug');
    provinces.forEach(province => {
        LOCATION_KEYS[province.slug] = { province: province._id };
    });
    const provinceObj = _.keyBy(provinces, '_id');

    const districts = await models.LOC_DISTRICT.aggregate().match({}).project('_id slug provinceId');
    districts.forEach(district => {
        LOCATION_KEYS[district.slug] = {
            province: _.get(provinceObj, [district.provinceId, '_id']),
            district: district._id,
        };
    });
    const districtsObj = _.keyBy(districts, '_id');

    const wards = await models.LOC_WARD.aggregate().match({}).project('_id slug districtId');
    wards.forEach(ward => {
        const district = districtsObj[ward.districtId];
        if (!district) return;
        const province = _.get(provinceObj, [district.provinceId, '_id']);
        if (!province) return;

        LOCATION_KEYS[ward.slug] = {
            ward: ward._id,
            district: district._id,
            province,
        };
    });

    const streets = await models.LOC_STREET.aggregate().match({}).project('_id slug districtId');
    streets.forEach(street => {
        const district = districtsObj[street.districtId];
        if (!district) return;
        const province = _.get(provinceObj, [district.provinceId, '_id']);
        if (!province) return;

        LOCATION_KEYS[street.slug] = {
            street: street._id,
            district: district._id,
            province,
        };
    });

    const propertyTypes = await models.BLOCK_TYPE.aggregate()
        .match({ disabled: false })
        .project('id name subTitle slug defaultService');
    propertyTypes.sort((a, b) => b.slug.length - a.slug.length);
    PROPERTY_TYPES.push(...propertyTypes);
})();

async function populateLocation(location, language) {
    const isVi = language === LANGUAGE.VI;
    const selection = {
        id: 1,
        name: isVi ? 1 : '$alias',
        slug: 1,
        location: 1,
        boundaries: 1,
    };
    if (isVi) selection.prefix = 1;

    [location.province, location.district, location.ward, location.street] = await Promise.all([
        location.province && models.LOC_PROVINCE.findById(location.province).select(selection),
        location.district && models.LOC_DISTRICT.findById(location.district).select(selection),
        location.ward && models.LOC_WARD.findById(location.ward).select(selection),
        location.street && models.LOC_STREET.findById(location.street).select(selection),
    ]);

    return location;
}

async function resolveUrl(req, res) {
    let { url, tag } = req.body;
    let { language } = req;

    const serviceSlug = _.keys(SERVICE_KEYS).find(key => url.includes(key));
    const urlWithoutService = url.replace(serviceSlug, '').substr(1);
    const businessService = SERVICE_KEYS[serviceSlug];

    const propertyType = PROPERTY_TYPES.find(p => urlWithoutService.includes(p.slug));
    const urlWithLocationOnly = urlWithoutService.replace(_.get(propertyType, 'slug'), '').substr(1);
    const location = _.clone(LOCATION_KEYS[urlWithLocationOnly]);
    const districtId = _.get(location, 'district');
    const provinceId = _.get(location, 'province');
    const wardId = _.get(location, 'ward');
    const propertyTypeId = _.get(propertyType, 'id');

    const isSMonth = businessService === SERVICES.MONTH;
    const isNotSDay = businessService !== SERVICES.DAY;
    const currentTag = tag && (await models.CTG_TAG.findOne({ slug: tag }));

    const SEOLink = {};
    if (isNotSDay) {
        [SEOLink.tags, SEOLink.types, SEOLink.locations, SEOLink.streets] = await Promise.all([
            isSMonth
                ? models.ROOM_TYPE.getSEOTags(
                      _.pickBy({
                          propertyTypes: propertyTypeId,
                          provinceId,
                          districtId,
                          wardId,
                          businessServices: businessService,
                          tag: currentTag,
                          language,
                      }),
                  )
                : [],
            models.CTG_ROOM_TYPE.find(),
            models.LOC_ALIAS.getSEOLocations({
                districtId,
                provinceId,
                propertyTypeId,
                businessService,
                language,
            }),
            models.LOC_ALIAS.getSEOStreets({
                districtId,
                propertyTypeId,
                businessService,
                language,
            }),
        ]);
    } else {
        ({ locations: SEOLink.locations, streets: SEOLink.streets } = await getSEO({
            districtId,
            provinceId,
            wardId,
            language,
        }));
    }

    const rs = {
        businessService,
        propertyType,
        propertyTypes: PROPERTY_TYPES,
        location: location ? { ...(await populateLocation(location, language)), slug: urlWithLocationOnly } : null,
        seo: {
            link: SEOLink,
        },
        tag: currentTag,
    };

    res.sendData(rs);
}

module.exports = {
    resolveUrl,
    LOCATION_KEYS,
};
