function genLookup(from, local, foreign, as, unwind) {
    return [
        { $lookup: { from, localField: local, foreignField: foreign, as } },
        unwind && { $unwind: `$${as}` },
    ].filter(r => r);
}

function genSelect(str = '') {
    const properties = str.split(/\s+/g);
    if (!properties.length) {
        return [];
    }

    const $project = {};
    for (const property of properties) {
        let [key, value] = property.split(':');
        if (value && value[0] === '@' && value[1] === '@') {
            value = JSON.parse(property.slice(key.length + 3));
        }

        if (key[0] === '-') {
            $project[key.slice(1)] = value || 0;
        } else {
            $project[key] = value || 1;
        }
    }

    return [{ $project }];
}

function genLookupAndSelect({
    from,
    name,
    local,
    foreign = '_id',
    as,
    select,
    unwind,
    unwindNullAndEmpty,
    match,
    letVar,
    extPipeline = [],
    array,
}) {
    as = as || local;
    let unwindAggregate;
    if (unwind) {
        unwindAggregate = { $unwind: { path: `$${as}` } };
        if (unwindNullAndEmpty) {
            unwindAggregate.$unwind.preserveNullAndEmptyArrays = true;
        }
    }

    return [
        {
            $lookup: {
                from: from || name,
                let: letVar || { id: `$${local}` },
                pipeline: [
                    { $match: match || { $expr: { [array ? '$in' : '$eq']: [`$${foreign}`, '$$id'] } } },
                    ...extPipeline,
                    ...genSelect(select),
                ],
                as,
            },
        },
        unwindAggregate,
    ].filter(r => r);
}

module.exports = {
    genLookup,
    genSelect,
    genLookupAndSelect,
};
