const fetch = require('@utils/fetch');

// async function getIPInfo(ip) {
//     const data = await fetch(`https://iplocation.com`, {
//         headers: {
//             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         },
//         method: 'POST',
//         body: `ip=${ip}`,
//     })
//         .then(res => res.json())
//         .catch(e => {
//             console.error(e);
//         });

//     return data;
// }

async function getIPInfo(ip) {
    const data = await fetch(`http://ipwhois.app/json/${ip}`)
        .then(res => res.json())
        .then(rs => (rs && rs.success ? rs : Promise.reject(rs)))
        .catch(e => {
            console.error(e);
        });

    return data;
}

// ip2location.close();

module.exports = {
    getIPInfo,
};
