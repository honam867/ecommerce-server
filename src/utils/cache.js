const ONE_HOUR = 60 * 60 * 1000;
const TIME_EXPIRED = 3 * ONE_HOUR;

class Cache {
    constructor() {
        this.cacheData = {};
        this.timer = {};
    }

    checkTimeout(uid) {
        this.timer[uid] = setTimeout(() => {
            delete this.cacheData[uid];
        }, TIME_EXPIRED);
    }

    add(uid) {
        if (!this.cacheData[uid]) {
            this.cacheData[uid] = {};
            this.checkTimeout(uid);
        }

        return this.cacheData[uid];
    }

    del(uid) {
        if (this.cacheData[uid]) {
            delete this.cacheData[uid];
            clearTimeout(this.timer[uid]);
            return true;
        }

        return false;
    }

    get(uid) {
        return this.cacheData[uid];
    }
}

module.exports = {
    Cache,
};
