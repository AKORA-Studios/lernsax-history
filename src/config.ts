import { config as loadConfig } from 'dotenv';

//Load enviroment variables
loadConfig();

const isDev = process.env.NODE_ENV === 'development';

export const config = {
    USERNAME: process.env.LERNSAX_USERNAME!,
    PASSWORD: process.env.LERNSAX_PASSWORD!,
    NODE_ENV: process.env.NODE_ENV,
    DEV: isDev,
};

if (!config.USERNAME) throw new Error('Username missing');
if (!config.PASSWORD) throw new Error('Username missing');

export default config;
