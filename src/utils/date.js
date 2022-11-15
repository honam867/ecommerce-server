const _ = require('lodash');
const moment = require('moment');

function* rangeDate(from, to, equal = true, autoReverse = false) {
    if (autoReverse && from > to) {
        [from, to] = [to, from];
    }

    let date = moment(from).startOf('days').set('hours', 7);
    const _to = moment(to).startOf('days').set('hours', 7).unix();

    while (date.unix() < _to || (equal && date.unix() === _to)) {
        yield date.toDate();

        date = date.add(1, 'days');
    }
}

rangeDate.prototype.daysOfWeek = function () {
    return _.uniq(this.toArray().map(date => date.getDay() + 1))
        .sort()
        .map(d => d.toString());
};

rangeDate.prototype.filterDaysOfWeek = function (daysOfWeek) {
    return this.toArray().filter(
        date => !daysOfWeek || !daysOfWeek.length || daysOfWeek.includes((date.getDay() + 1).toString()),
    );
};

rangeDate.prototype.toArray = function () {
    const arr = [];
    for (const date of this) {
        arr.push(date);
    }

    return arr;
};

rangeDate.prototype.forEach = function (callback) {
    let idx = 0;
    for (const date of this) {
        callback(date, idx++);
    }
};

rangeDate.prototype.asyncForEach = async function (callback) {
    let idx = 0;
    for (const date of this) {
        await callback(date, idx++);
    }
};

rangeDate.prototype.map = function (callback) {
    const arr = [];
    for (const date of this) {
        arr.push(callback(date));
    }

    return arr;
};

rangeDate.prototype.asyncMap = async function (callback) {
    const arr = [];
    for (const date of this) {
        arr.push(callback(date));
    }

    return await Promise.all(arr);
};

rangeDate.prototype.syncMap = async function (callback) {
    const arr = [];
    for (const date of this) {
        arr.push(await callback(date));
    }

    return arr;
};

/**
 *
 *
 * @param {Date} from
 * @param {Date} to
 * @param {number} [chunkStep=30]
 * @param {number} [padding=1]
 * @returns
 */
function chunkDate(from, to, step = 30, padding = 1) {
    const untilDate = moment(to).toDate();

    let cFrom = moment(from).toDate();

    const chunk = [];
    while (cFrom <= untilDate) {
        let newTo = moment(cFrom).add(step, 'days').toDate();

        if (newTo > untilDate) {
            newTo = untilDate;
        }

        chunk.push([cFrom, newTo]);

        if (padding) {
            cFrom = moment(newTo).add(padding, 'days').toDate();
        } else {
            cFrom = newTo;
        }
    }

    return chunk;
}

function chunkTime(from, to, step = 30) {
    const mfrom = moment(from).second(0);
    const mto = moment(to).second(0);
    if (parseInt(mfrom.format('mm')) >= step) {
        mfrom.minute(step);
    } else {
        mfrom.startOf('hour');
    }
    // if (parseInt(mto.format('mm')) > step) {
    //     mto.add(step, 'minute');
    //     mto.minute(0);
    // }
    const dates = {};
    while (mfrom <= mto) {
        const formated = mfrom.format('Y-MM-DD');
        if (!dates[formated]) dates[formated] = [];
        dates[formated].push(mfrom.format('HH:mm'));
        mfrom.add(30, 'minute');
    }
    return dates;
}

module.exports = {
    rangeDate,
    chunkDate,
    chunkTime,
};
