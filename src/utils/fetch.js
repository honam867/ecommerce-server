const nodeFetch = require('node-fetch');
const _ = require('lodash');
// const HttpsProxyAgent = require('https-proxy-agent');

// const { logger } = require('./logger');
// const { proxies } = require('../../config/setting');

// const TIME_BETWEEN_TWO_REQUEST = 300;

// const proxiesData = {
// 	Default: {
// 		proxies: [],
// 		lastUsed: [],
// 	},
// };

// const delay = t => new Promise(res => setTimeout(res, t));

// async function getProxy(url = '') {
// 	const match = url.match(/\/\/(.*?)\//);
// 	let origin;
// 	if (match) {
// 		[, origin] = match;
// 		if (!proxiesData[origin]) {
// 			proxiesData[origin] = {
// 				proxies: [],
// 				lastUsed: [],
// 			};
// 		}
// 	} else {
// 		logger.info('Cannot get origin from url:', url);
// 		origin = 'Default';
// 	}

// 	const proxyData = proxiesData[origin];
// 	const newProxies = proxies.filter(p => !proxyData.proxies.includes(p));
// 	if (newProxies.length) {
// 		proxyData.proxies = proxyData.proxies.concat(newProxies);
// 		proxyData.lastUsed = proxyData.lastUsed.concat(new Array(newProxies.length).fill(0));
// 	}

// 	if (proxyData.length === 0) {
// 		logger.error("Don't have any proxy");
// 		return;
// 	}

// 	let last = Math.min(...proxyData.lastUsed);

// 	while (Date.now() - last < TIME_BETWEEN_TWO_REQUEST) {
// 		// eslint-disable-next-line no-await-in-loop
// 		await delay(75);
// 		last = Math.min(...proxyData.lastUsed);
// 	}

// 	const idx = proxyData.lastUsed.indexOf(last);

// 	proxyData.lastUsed[idx] = Date.now();

// 	const proxy = proxyData.proxies[idx];
// 	if (!proxy) {
// 		logger.error('Proxy is null', proxyData, idx, last);
// 		return null;
// 	}

// 	return proxy;
// }

/**
 *
 *
 * @param {string | Object } url
 * @param {Object} init
 */
function fetch(url, init = {}) {
    // const proxy = await getProxy(url);

    // init.agent = new HttpsProxyAgent(proxy);
    // init.timeout = 30000;

    // return await nodeFetch(url, init).catch(error => {
    // 	logger.error('proxy error', proxy);
    // 	return error;
    // });

    init.timeout = 30000;
    _.set(init, ['headers', 'User-Agent'], 'cozrumbot/1.1');
    return nodeFetch(url, init);
}

module.exports = !global.isDev ? fetch : nodeFetch;
