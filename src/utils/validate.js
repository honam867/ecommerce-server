const MIN_SKIP = 0;
const MAX_LIMIT = 50;
const DF_LIMIT = 20;
const DF_SKIP = 0;

function validatePage(query) {
    query = query || {};

    query.start = parseInt(query.start) || DF_SKIP;
    query.limit = parseInt(query.limit) || DF_LIMIT;

    if (query.start < MIN_SKIP) query.start = MIN_SKIP;
    if (query.limit > MAX_LIMIT) query.limit = MAX_LIMIT;

    return query;
}

module.exports = {
    validatePage,
};
