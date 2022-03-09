import { config as loadConfig } from 'dotenv';
import md5 from 'md5';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

const hash = md5(config.WEBDAV_URL + config.USERNAME + config.PASSWORD);

//persistent Data
import rawData from '../data.json';
export const data = rawData as any as {
    hash?: string;
    lastRun?: Date;
};
data.lastRun ??= new Date(0);
data.hash ??= hash;

if (data.hash !== hash) throw new Error('This data file belongs to a diffrent configuration');

writeFileSync(join(__dirname, '../data.json'), JSON.stringify(data, null, 4));

export const scriptStart = new Date();
export const lastRun = data.lastRun;

export default config;

console.log('✅ - Loaded config');
