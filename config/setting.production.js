const ENVIRONMENT = {
    NAME: 'production',
    REQUIRE_TOKEN: true,
};

const ONE_SIGNAL = {
    APP_ID: '2ce59b68-6542-4ecb-b946-53b99e949bb5',
    API_KEY: 'YmNjZjA3ODItMmJiNy00MmFmLTk4NzMtODEyZTJmM2ZhOWYz',
};

const HOOK_CONFIG = {
    SECRET_KEY: '2kFubOsZq42TiYc1z4JjKWB$#xW',
};

const JWT_CLIENT_CONFIG = {
    SECRET_KEY: 'SCrnvf9n02', // use for jwt, and hash keys
    EXPIRE: '30d',
};

const JWT_CONFIG = {
    SECRET_KEY: 'XfLUgaT!A#36k*apl16HXUJJoWO0ocEW', // use for jwt, and hash keys
    EXPIRE: '15d',
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
        tempFileDir: `${TMP_FOLDER}`,
        uploadTimeout: 0,
    },
};

const DB = {
    MAIN: 'mongodb://10.213.1.3:27017/famiroom',
    OTT: 'mongodb://10.213.1.3:27017/famiroom_ott',
    OPTIONS: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
};

const URL_CONFIG = {
    SERVER: 'https://api.famiroom.com',
    HOME: 'https://cozrum.com',
    STATIC: 'https://cdn-static.famiroom.com/static/upload/',
    COZ_ADAPTER: 'https://api.cozrum.com',
    AGENT_URL: 'https://cozrum.com/a',
};

const VR_URL_CONFIG = {
    PRIMARY: 'https://cdn.cozrum.com',
    PRIMARY_EDITOR: 'https://3d-editor.famiroom.com',
    MATTER_PORT: 'https://cdn2.cozrum.com',
};

const CSV_CONFIG = {
    API_KEY: '5fa31de246704f3682d5ae4e65b395da',
    API_SECRET: 'bbd3b7143f15d7b6187a1cce4064bf729aa106343da0184e37abb995ee47faec',
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
