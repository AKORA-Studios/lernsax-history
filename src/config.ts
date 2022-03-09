import { config as loadConfig } from 'dotenv';

//Load enviroment variables
loadConfig();

const isDev = process.env.NODE_ENV === 'development';

export const config = {
    USERNAME: process.env.LERNSAX_USERNAME!,
    PASSWORD: process.env.LERNSAX_PASSWORD!,
    NODE_ENV: process.env.NODE_ENV,
    WEBDAV_URL: process.env.LERNSAX_WEBDAV_URL!,
    DEV: isDev,
};

if (!config.USERNAME) throw new Error('Username missing');
if (!config.PASSWORD) throw new Error('Username missing');
if (!config.WEBDAV_URL) throw new Error('WebDav URL missing');

//persistent Data
import rawData from '../data.json';
const data = rawData as any as {
    hash?: string;
    lastRun?: Date;
};
data.lastRun ??= new Date(0);
data.hash ??= 'a';

export const scriptStart = new Date();
export const lastRun = data.lastRun;

export default config;
