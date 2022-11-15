const mongoose = require('mongoose');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const libphonenumber = require('libphonenumber-js');

const { convert11To10, generatePhoneList } = require('@utils/phone');
const { getFileByUrl } = require('@utils/file');
const ThrowReturn = require('@core/throwreturn');
const { GENDER, GUEST_TYPE } = require('@utils/const');
const MODELS = require('./const');

const { Schema, Custom } = mongoose;
const { ObjectId } = Schema.Types;

const GuestSchema = new Schema(
    {
        displayName: String,
        name: String,
        fullName: String,
        email: String,
        phone: String,
        country: String,
        ota: String,
        otaId: String,
        avatar: Custom.Ref({ type: String, ref: MODELS.RESOURCE_UPLOADING.name }),
        genius: Boolean,
        tags: [String],
        passport: [{ type: String, ref: MODELS.RESOURCE_UPLOADING.name }],
        passportNumber: String,
        address: String,
        gender: { type: String, enum: _.values(GENDER) },
        dayOfBirth: Date,
        active: { type: Boolean, default: true },
        linkedId: ObjectId,
        userId: { type: ObjectId, ref: MODELS.USER.name },
        clientKey: { type: String },
        momoId: { type: String },
        type: { type: String, enum: _.values(GUEST_TYPE), default: GUEST_TYPE.NORMAL },
        ip: { type: String },
        ottIds: {
            whatsapp: String,
            imessage: String,
            zalo: String,
            facebook: String,
        },
        histories: [
            {
                description: String,
                images: [{ type: String, ref: MODELS.RESOURCE_UPLOADING.name }],
                createdAt: Date,
                by: { type: ObjectId, ref: MODELS.USER.name },
                removedBy: { type: ObjectId, ref: MODELS.USER.name },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

function parsePhoneNumber(number, country = 'VN') {
    try {
        return libphonenumber.parsePhoneNumber(convert11To10(number), country);
    } catch {
        return { number };
    }
}

GuestSchema.pre('save', function (next) {
    if (!this.fullName && this.name) this.fullName = this.name;
    if (!this.displayName && this.fullName) this.displayName = this.fullName;
    next();
});

GuestSchema.methods = {
    async setAvatar(avatar) {
        if (this.avatar && mongoose.Types.ObjectId.isValid(this.avatar)) return;

        const file = await getFileByUrl(avatar);
        const [source] = await require('@controllers/resource/upload').upload(_.compact([file]));

        this.avatar = source;
        await this.save();
    },
};

GuestSchema.statics = {
    /**
     * Find or create new user
     * @param {Object} data
     */
    async findGuest(data, isUpdate) {
        data.otaId = data.otaId || uuid();

        const guest = (await this.findOne({ otaId: data.otaId, active: { $ne: false } })) || new this(data);

        const copy = _.pickBy(data, (value, key) => !['_id', 'messages'].includes(key));
        _.forEach(copy, (value, key) => {
            if (isUpdate) {
                guest[key] = value || guest[key];
            } else {
                guest[key] = guest[key] || value;
            }
        });

        if (guest.phone) {
            guest.phone = guest.phone.replace(/\D/g, '').replace(/^840/, '84');
        }
        if (!guest.country && guest.phone) {
            const phoneNumber = parsePhoneNumber(guest.phone);
            guest.country = phoneNumber.country;
            guest.phone = phoneNumber.number;
        }

        await guest.save();
        return guest;
    },

    findByPhone(phone) {
        phone = phone.replace(/\+/g, '');
        const phoneList = generatePhoneList(phone);

        return this.findOne({
            $or: [
                { phone: phoneList },
                { 'ottIds.whatsapp': phone },
                { 'ottIds.zalo': phone },
                { 'ottIds.imessage': phone },
                { 'ottIds.facebook': phone },
            ],
            active: { $ne: false },
        })
            .select('name fullName messages phone ottIds')
            .sort({ updatedAt: -1 });
    },

    async updateAvatar(id, avatar) {
        const guest = await this.findById(id);
        if (!guest) return;

        await guest.setAvatar(avatar);
    },

    async list(start, limit, ota, name, phone, trim) {
        const query = { active: { $ne: false } };
        if (ota) {
            query.ota = ota;
        }
        if (name) {
            const regex = new RegExp(name, 'i');
            query.$or = [{ displayName: regex }, { fullName: regex }, { name: regex }];
        }
        if (phone) {
            query.phone = new RegExp(phone, 'i');
        }
        const guests = await this.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(start)
            .select(trim === 'true' || trim === true ? '-genius -messages -__v -createdAt -updatedAt' : '-__v')
            .populate('avatar passport');

        const total = await this.countDocuments(query);
        return { guests, total };
    },

    getHistories(guestId) {
        return this.findById(guestId)
            .select('histories')
            .populate('histories.by', 'username name role')
            .populate('histories.images')
            .populate('histories.removedBy', 'username name role');
    },

    async addHistory(guestId, userId, description, images = null) {
        if (!description && !images) {
            throw new ThrowReturn('Content must not be empty');
        }

        await this.updateOne(
            { _id: guestId },
            {
                $push: {
                    histories: {
                        by: userId,
                        description,
                        images,
                        createdAt: new Date(),
                    },
                },
            },
            {
                new: true,
            },
        );
        return this.getHistories(guestId);
    },

    async updateHistory(userId, guestId, id, data) {
        const guest = await this.findById(guestId);
        if (guest) {
            const history = guest.histories.find(h => h._id.toString() === id);
            if (history) {
                if (history.by && history.by.toString() !== userId.toString()) {
                    throw new ThrowReturn('You do not have permission to change this resources');
                }

                Object.keys(data).forEach(k => {
                    history[k] = data[k];
                });
                await this.updateOne({ _id: guestId }, { histories: guest.histories });
            }
        }
        return await this.getHistories(guestId);
    },

    async removedHistory(userId, guestId, id) {
        const guest = await this.findById(guestId);
        if (guest) {
            const history = guest.histories.find(h => h._id.toString() === id);
            if (history) {
                if (history.by && history.by.toString() !== userId.toString()) {
                    throw new ThrowReturn('You do not have permission to change this resources');
                }
                await this.updateOne(
                    { _id: guestId },
                    {
                        histories: guest.histories.filter(h => h._id.toString() !== history._id.toString()),
                    },
                );
            }
        }
        return await this.getHistories(guestId);
    },

    async createAnonymous(data) {
        data = data || {};
        let guest;

        if (data.momoId) {
            guest = await this.findOne({ momoId: data.momoId });
        }
        if (!guest && data.phone) {
            guest = await this.findByPhone(data.phone);
        }
        if (!guest) {
            const total = await this.countDocuments();
            guest = await this.create({
                name: `Guest_${total + 1}`,
                type: GUEST_TYPE.ANONYMOUS,
                clientKey: uuid(),
                ...data,
            });
        }
        if (!guest.clientKey) {
            guest.clientKey = uuid();
            await guest.save();
        }

        return guest;
    },
};

module.exports = mongoose.model(MODELS.GUEST.name, GuestSchema, MODELS.GUEST.collection);
