const AsyncLock = require('async-lock');
const model = require('@models');
const { ONE_MINUTE, OTAs } = require('./const');

const OTAsName = Object.values(OTAs);
let OTAAccounts;
let OTAsLockKeys;
let OTAAccountsLockKeys;
let AllSyncLockKeys;

const SyncLock = new AsyncLock({ timeout: ONE_MINUTE * 2, maxPending: 1000 });
const OtaHeaderLock = new AsyncLock({ timeout: ONE_MINUTE * 1, maxPending: 1000 });
const CrawlerLock = new AsyncLock({ timeout: ONE_MINUTE * 1, maxPending: 1000 });
const PromotionLock = new AsyncLock({ timeout: ONE_MINUTE * 5, maxPending: 1000 });
const DefaultLock = new AsyncLock({ timeout: ONE_MINUTE * 10, maxPending: 10000 });

function lock(timeout = ONE_MINUTE * 10, maxPending = 5) {
    return new AsyncLock({ timeout, maxPending });
}

function printBusy() {
    Object.keys(OTAsLockKeys).forEach(ota =>
        Object.keys(OTAsLockKeys[ota]).forEach(account => {
            const isBusy = SyncLock.isBusy(OTAsLockKeys[ota][account]);
            console.log(OTAsLockKeys[ota][account], '\t', isBusy);
        }),
    );
}

function getSynchronizeLockKeys(otas) {
    if (!otas || !Array.isArray(otas) || otas.length === 0) {
        return AllSyncLockKeys;
    }

    if (typeof otas[0] === 'string') {
        otas = [...new Set(otas)];
        return otas
            .map(ota => OTAAccountsLockKeys[ota])
            .filter(o => o)
            .reduce((arr, v) => arr.concat(v));
    }

    return otas
        .map(({ otaName, account }) => {
            if (account) {
                return OTAsLockKeys[otaName] && OTAsLockKeys[otaName][account];
            }

            return OTAAccountsLockKeys[otaName];
        })
        .filter(o => o)
        .reduce((arr, v) => arr.concat(v), []);
}

function isSyncLockBusy(otas) {
    return getSynchronizeLockKeys(otas).some(key => SyncLock.isBusy(key));
}

async function onUpdateLock(force = false) {
    if (!force && OTAAccounts) {
        return;
    }

    const allOtas = await model.OTA_MANAGER.find({ active: true }).select('name account');

    OTAAccounts = allOtas.reduce((obj, ota) => {
        if (!obj[ota.name]) obj[ota.name] = [];

        obj[ota.name].push(ota.account);
        return obj;
    }, {});

    OTAAccountsLockKeys = OTAsName.reduce((obj, ota) => {
        obj[ota] = OTAAccounts[ota] && OTAAccounts[ota].map(account => `synchronize_${ota}_${account}`, {});

        return obj;
    }, {});

    OTAsLockKeys = OTAsName.reduce((obj, ota) => {
        if (!OTAAccounts[ota]) {
            return obj;
        }

        obj[ota] = OTAAccounts[ota].reduce((acc, account) => {
            acc[account] = `synchronize_${ota}_${account}`;
            return acc;
        }, {});
        return obj;
    }, {});

    AllSyncLockKeys = Object.values(OTAAccountsLockKeys)
        .reduce((arr, acc) => arr.concat(acc), [])
        .filter(k => k);

    return OTAAccounts;
}

function getCrawlerLockKeys(otas) {
    const pre = 'CRAWLER_';
    if (Array.isArray(otas)) {
        return otas.map(ota => `${pre}${ota}`);
    }
    return pre + otas;
}

module.exports = {
    SyncLock,
    OtaHeaderLock,
    CrawlerLock,
    PromotionLock,

    lock,
    DefaultLock,
    getSynchronizeLockKeys,
    isSyncLockBusy,
    onUpdateLock,
    printBusy,
    getCrawlerLockKeys,
};
