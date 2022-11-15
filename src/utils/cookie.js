function getCookie(cookie = '', name) {
    const arrayOfCookie = cookie.split(';');
    for (let ck of arrayOfCookie) {
        const [key, value] = ck.split('=');
        if (key.trim() === name) {
            return unescape(value);
        }
    }
    return '';
}

function setCookie(cookie = '', newCookie = '') {
    const arrayOfCookie = cookie.split(';');
    const arrayOfNewCookie = newCookie.split(';');

    arrayOfNewCookie.forEach(newCk => {
        let [newKey, newValue] = newCk.split('=');
        newKey = newKey.trim();
        for (let i = 0; i < arrayOfCookie.length; i++) {
            let key = arrayOfCookie[i].split('=')[0].trim();
            if (key === newKey) {
                arrayOfCookie[i] = newCk;
                return;
            }
        }
        arrayOfCookie.push(`${newKey}=${newValue}`);
    });

    return arrayOfCookie.join(';').toString();
}

function generateCookie(cookieArray) {
    if (cookieArray && cookieArray.length) return cookieArray.join(';');
    return '';
}

module.exports = {
    getCookie,
    setCookie,
    generateCookie,
};
