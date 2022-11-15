const ENVIRONMENT = {
    NAME: 'local',
    REQUIRE_TOKEN: true,
};

const ONE_SIGNAL = {
    APP_ID: '',
    API_KEY: '',
};

const HOOK_CONFIG = {
    SECRET_KEY: '2kFubOsZq42TiYc1z4JjKWB$#xW',
};

const JWT_CLIENT_CONFIG = {
    SECRET_KEY: 'SCrnvf9n02', // use for jwt, and hash keys
    EXPIRE: '180d',
};

const JWT_CONFIG = {
    SECRET_KEY: 'XfLUgaT!A#36k*apl16HXUJJoWO0ocEW', // use for jwt, and hash keys
    EXPIRE: '180d',
};

const SERVER_CONFIG = {
    PORT: 8080,
    STATIC: {
        URI: '/static/',
        PATH: `${__dirname}/../publish`,
        OPTIONS: {
            maxAge: '365d',
        },
    },
};

const OTT_CONFIG = {
    STATIC_PATH: '/static/doc/ott',
};

const TMP_FOLDER = 'tmp';

const UPLOAD_CONFIG = {
    FOLDER: `${__dirname}/../publish/upload`,
    URI: '/static/upload',
    MAX_IMAGE_SIZE: 50,
    OPTIONS: {
        createParentPath: true,
        abortOnLimit: true,
        useTempFiles: true,
        uploadTimeout: 0,
        tempFileDir: TMP_FOLDER,
        // debug: true,
    },
};

const DB = {
    MAIN: 'mongodb://localhost:27017/famiroom',
    OTT: 'mongodb://localhost/famiroom_ott',
    OPTIONS: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
};

const URL_CONFIG = {
    SERVER: 'http://localhost:8080',
    HOME: 'https://cozrum.com',
    STATIC: 'http://localhost:8080/static/upload/',
    COZ_ADAPTER: 'http://localhost:8070',
    // const staticUrl = 'https://cdn-static.famiroom.com/static/upload/';
};

const VR_URL_CONFIG = {
    PRIMARY: 'http://localhost:5000',
    PRIMARY_EDITOR: 'http://localhost:4000',
    MATTER_PORT: 'http://localhost:5000',
};

const CSV_CONFIG = {
    API_KEY: '',
    API_SECRET: '',
    API_URL: 'https://cloud.computervision.com.vn',
};

const FB_CONFIG = {
    LOGIN: {
        APP_ID: '3312061622235794',
        APP_SECRET: '94c685a12bdc3d1a179cd8cc2083c0fe',
    },
    WEB_HOOK: {
        VALIDATION_TOKEN:
            'SGms4Ed697LKMLYSV9NvnyUdSDnkpu3wrbtEuNguuEBj7J7Hx7TGGgebTjAWpgRVF7UMd3eK2gZBMz82LCurYtXNeAFLjKjSK4ya579m5AhSw7KVuc7pUfP2S9MV7VvkFChNY2DUCjWxskevCV2MWTCHFvHvgFuMEKNG9nJqnLyS9v3qymHdKrZESZh9AHnpKYxjFbFFqUzwzCcmUqrxGFjBHGp7GuMF72MT9VnAVPqqAWj7G22PMa6nygjMQgGp',
        APP_SECRET: '7f7a7b63eb6f6c136ccd7764b030fb4b',
        RESOURCES_FOLDER: 'facebook_attachments',
        RESOURCES_PATH: `${__dirname}/../publish`,
    },
};

const GOOGLE_CONFIG = {
    PLACE_API_KEY: 'AIzaSyAwCChr-erhr4KJrvEUGh9QFpyzuXiV3JE',
};

module.exports = {
    ENVIRONMENT,
    ONE_SIGNAL,
    HOOK_CONFIG,
    JWT_CLIENT_CONFIG,
    JWT_CONFIG,
    SERVER_CONFIG,
    OTT_CONFIG,
    UPLOAD_CONFIG,
    DB,
    URL_CONFIG,
    VR_URL_CONFIG,
    CSV_CONFIG,
    FB_CONFIG,
    GOOGLE_CONFIG,
    TMP_FOLDER,
};
