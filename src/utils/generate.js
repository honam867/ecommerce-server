const { customAlphabet } = require('nanoid');
const mongoose = require('mongoose');
const _ = require('lodash');
const MODELS = require('@models/const');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const nanoid4 = customAlphabet('0123456789', 5);

async function genBookingCode(func) {
    const code = nanoid();
    const otaBookingId = func ? func(code) : code;
    if (await mongoose.model(MODELS.BOOKING.name).findOne({ otaBookingId }).select('_id')) {
        return genBookingCode(func);
    }

    return otaBookingId;
}

function removeSpecialChars(txt) {
    return txt.replace(/[^a-zA-Z0-9]/g, ' ');
}

function removeAccents(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function getSlug(name, affix = true) {
    if (!name) return name;
    name = removeAccents(name);
    name = removeSpecialChars(name);
    return `${_.kebabCase(name)}${affix ? `-${nanoid4()}` : ''}`;
}

function getAlias(name, removeAccent = true, lowerCase = true) {
    if (!name) return name;
    if (removeAccent) name = removeAccents(name);
    // const decoded = removeSpecialChars(name);
    let url = '';
    for (let c of name) {
        if (c !== ' ' || url[url.length - 1] !== ' ') {
            url += c;
        }
    }
    if (url[url.length - 1] === ' ') {
        url = url.slice(0, url.length - 1);
    }
    return lowerCase ? url.toLowerCase() : url;
}

function isSlug(slug) {
    if (!slug) return false;
    const matched = slug.match(/[a-zA-Z0-9]|-/g);
    return matched.length === slug.length;
}

module.exports = {
    genBookingCode,
    nanoid,
    removeAccents,
    getSlug,
    getAlias,
    isSlug,
};
