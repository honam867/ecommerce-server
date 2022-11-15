const _ = require('lodash');
const glob = require('glob');

function responses(data) {
    return {
        200: {
            description: 'Success',
            schema: {
                type: 'object',
                properties: {
                    error_code: {
                        type: 'number',
                    },
                    data,
                },
            },
        },
    };
}

function loadPaths(dirPath) {
    const docFiles = glob(`${dirPath}/**/*.doc.js`, {
        sync: true,
        matchBase: true,
    });

    const paths = docFiles
        .map(fileName => ({
            prefix: _.last(fileName.split('/')).replace('.doc.js', ''),
            path: require(fileName),
        }))
        .reduce((acc, current) => {
            return {
                ...acc,
                ..._.entries(current.path).reduce(
                    (newO, [key, pth]) => ({
                        ...newO,
                        [`/${current.prefix}${key}`]: pth,
                    }),
                    {},
                ),
            };
        }, {});

    return paths;
}

module.exports = {
    responses,
    loadPaths,
};
