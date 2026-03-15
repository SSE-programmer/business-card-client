const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const AVAILABLE_API_URLS = {
    'local': 'http://127.0.0.1:3000',
    'prod': 'https://sse-programmer.com',
};

const API_URL_KEY = 'prod';
const API_URL = AVAILABLE_API_URLS[API_URL_KEY];

const PROXY_CONFIG = {
    [API_PREFIX]: {
        target: process.env.SERVER_URL || API_URL,
        secure: true,
        logLevel: 'debug',
        changeOrigin: true
    },
};

module.exports = PROXY_CONFIG;
