const urlRegex = require('url-regex');

const validators = {
    Date: {
        validator(v) {
            return /\d{4}-\d{2}-\d{2}/.test(v);
        },
        message: props => `${props.value} is not valid date with format 'YYYY-MM-DD'`,
    },

    DateTime: {
        validator(v) {
            return /\d{4}-\d{2}-\d{2} \d{2}:\d{2}[:\d{2}]/.test(v);
        },
        message: props => `${props.value} is not valid time with format 'YYYY-MM-DD hh:mm:ss'`,
    },

    Time: {
        validator(v) {
            return /\d{2}:\d{2}[:\d{2}]/.test(v);
        },
        message: props => `${props.value} is not valid time with format 'hh:mm[:ss]'`,
    },

    Url: {
        validator(v) {
            return urlRegex().test(v);
        },
        message: props => `${props.value} is not valid url`,
    },
};

const Types = {
    Date: {
        type: String,
        validate: validators.Date,
    },
    DateTime: {
        type: String,
        validate: validators.DateTime,
    },
    Time: {
        type: String,
        validate: validators.Time,
    },
    Url: {
        type: String,
        validate: validators.Url,
    },
};

Types.validators = validators;

module.exports = Types;
