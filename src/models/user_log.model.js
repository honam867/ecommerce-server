const mongoose = require('mongoose');
const _ = require('lodash');
const MODELS = require('./const');

const { Schema } = mongoose;

const UserLogSchema = new Schema(
    {
        username: String,
        method: String,
        action: String,
        data: String,
        type: String,
        response: Schema.Types.Mixed,
        // {
        // 	error_code: Number,
        // 	error_msg: String,
        // 	data: Schema.Types.Mixed,
        // },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
        versionKey: false,
    },
);

UserLogSchema.index({ type: 1, username: 1, createdAt: -1 });

UserLogSchema.statics = {
    async addLog(username, method, action, data, type, response) {
        await this.create({ username, method, action, data, type, response });
    },

    async getLogV2({ username, start, limit, from, to, type }) {
        start = parseInt(start) || 0;
        limit = parseInt(limit) || 20;
        const query = {};

        query.type = type || { $ne: null };
        query.username = username || { $ne: null };

        if (from) {
            from = new Date(from);
            from.minTimes();
            _.set(query, ['createdAt', '$gte'], from);
        }
        if (to) {
            to = new Date(to);
            to.maxTimes();
            _.set(query, ['createdAt', '$lte'], to);
        }

        let [data, total] = await Promise.all([
            this.find(query).sort({ createdAt: -1 }).skip(start).limit(limit),
            this.countDocuments(query),
        ]);

        const inboxIds = [];
        data = data.map(doc => {
            doc = doc.toObject();
            try {
                doc.data = JSON.parse(doc.data);
                if (doc.type === 'INBOX_READ') {
                    const paths = doc.action.split('/');
                    doc.inboxId = paths[paths.length - 1];
                    inboxIds.push(doc.inboxId);
                }
            } catch (e) {
                console.error(e);
            }
            return doc;
        });

        if (inboxIds.size) {
            const inboxData = await this.model(MODELS.BLOCK_INBOX.name)
                .find({ _id: inboxIds })
                .select('messageId')
                .then(doc => doc.reduce((acc, curr) => Object.assign(acc, { [curr._id]: curr.messageId }), {}));
            data.forEach(doc => {
                doc.messageId = inboxData[doc.inboxId];
            });
        }

        return {
            data,
            total,
        };
    },
};

module.exports = mongoose.model(MODELS.USER_LOG.name, UserLogSchema, MODELS.USER_LOG.collection);
