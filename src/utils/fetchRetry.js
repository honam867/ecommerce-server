/* eslint-disable no-use-before-define */
const { logger } = require('@utils/logger');
const { OTAs } = require('@utils/const');
const fetch = require('@utils/fetch');

function checkMaxRetry(time, max, data) {
    if (time >= max) {
        throw new Error('Max retry', data);
    }
}

async function bookingRetry(uri, option, retryOption) {
    let { interval, time, max, info } = retryOption;

    await Promise.delay(interval);

    const otaInfo = await require('@controllers/ota/helper').updateOTAAccount(info.name, info.account);
    uri = uri.replace(/ses=(\w+)/, `ses=${otaInfo.other.ses}`);

    time += 1;
    return fetchRetry(
        uri,
        {
            ...option,
            headers: {
                ...option.headers,
                ...require('@controllers/ota/header_helper').getBookingHeader(otaInfo),
            },
        },
        { interval, time, max, info },
    );
}

async function expediaRetry(uri, option, retryOption) {
    let { interval, time, max, info } = retryOption;

    await Promise.delay(interval);

    const otaInfo = await require('@controllers/ota/helper').updateOTAAccount(info.name, info.account);

    time += 1;
    return fetchRetry(
        uri,
        {
            ...option,
            headers: {
                ...option.headers,
                Cookie: otaInfo.cookie,
            },
        },
        { interval, time, max, info },
    );
}

async function agodaRetry(uri, option, retryOption) {
    let { interval, time, max, info } = retryOption;

    await Promise.delay(interval);
    const otaInfo = await require('@controllers/ota/helper').updateOTAAccount(info.name, info.account);

    time += 1;
    return fetchRetry(
        uri,
        {
            ...option,
            headers: {
                ...option.headers,
                Cookie: otaInfo.cookie,
            },
        },
        { interval, time, max, info },
    );
}

/**
 * @typedef RetryOption
 * @property  {number} [interval=500]
 * @property  {number} [time=0]
 * @property  {number} [max=2]
 * @property  {object} [info={}]
 * @property  {string} info.name
 * @property  {string} info.account
 *
 * @param {string} uri
 * @param {object} option
 * @param {RetryOption} retryOption
 * @return {Promise<Response>}
 */
async function fetchRetry(uri, option, retryOption) {
    let { interval = 500, time = 0, max = 1, info } = retryOption || {};
    const { name: otaName } = info || {};

    try {
        const response = await fetch(uri, option);

        if (!response.ok) {
            if (response.status === 401) {
                if (otaName === OTAs.Booking) {
                    checkMaxRetry(time, max, response);
                    return bookingRetry(uri, info, { interval, time, max, info });
                }
            } else {
                logger.error('Fetch', uri, '->', response.status, response.statusText);
            }
        }

        if (otaName === OTAs.Expedia) {
            if (response.url.includes('expediapartnercentral.com/Account/Logon')) {
                checkMaxRetry(time, max, response);
                return expediaRetry(uri, option, { interval, time, max, info });
            }
        } else if (otaName === OTAs.Agoda) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('text/html')) {
                checkMaxRetry(time, max, response);
                return agodaRetry(uri, option, { interval, time, max, info });
            }
        }

        return response;
    } catch (error) {
        if (time >= max) {
            throw error;
        }

        time += 1;
        logger.warn('FetchRetry', time, 'time(s) with error', error);

        await Promise.delay(interval);

        if (otaName === OTAs.Agoda && error.code === 'HPE_HEADER_OVERFLOW') {
            checkMaxRetry(time, max, error);
            return agodaRetry(uri, option, { interval, time, max, info });
        }

        return fetchRetry(uri, option, { interval, time, max, info });
    }
}

module.exports = fetchRetry;
