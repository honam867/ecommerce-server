const MIN_ZOOM_FOR_SHOW_PRICE = 18;

function getPrecisionByZoom(zoom) {
    if (zoom >= 17) return 9;
    if (zoom > 15) return 8;
    if (zoom > 13) return 7;
    if (zoom > 11) return 6;
    if (zoom > 9) return 5;
    if (zoom > 6) return 4;
    return 3;
}

module.exports = {
    getPrecisionByZoom,
    MIN_ZOOM_FOR_SHOW_PRICE,
};
