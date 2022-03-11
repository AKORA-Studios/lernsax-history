import { config as loadConfig } from 'dotenv';
import md5 from 'md5';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

//Load enviroment variables
loadConfig();

const isDev = process.env.NODE_ENV === 'development';

export const config = {
    USERNAME: process.env.LERNSAX_USERNAME!,
    PASSWORD: process.env.LERNSAX_PASSWORD!,
    NODE_ENV: process.env.NODE_ENV,
    WEBDAV_URL: process.env.LERNSAX_WEBDAV_URL!,
    GIT_USER: process.env.GIT_USER!,
    GIT_PASSWORD: process.env.GIT_PASSWORD!,
    GIT_REPO: process.env.GIT_REPO!,
    GIT_HOST: process.env.GIT_HOST!,
    DEV: isDev,
};

if (!config.USERNAME) throw new Error('Username missing');
if (!config.PASSWORD) throw new Error('Username missing');
if (!config.WEBDAV_URL) throw new Error('WebDav URL missing');

export default config;

//persistent Data
import rawData from '../data.json';

type File = string;
type Dir = { name: string; files: FileTree | null };
type Entry = File | Dir;
export type FileTree = Entry[];

export const data = rawData as any as {
    hash: string;
    lastRun: Date;
    /** FileTree */
    filetree: FileTree;
};

const hash = md5(config.WEBDAV_URL + config.USERNAME + config.PASSWORD);

data.lastRun ??= new Date(0);
data.lastRun = new Date(data.lastRun);
data.hash ??= hash;
data.filetree ??= [];

if (data.hash !== hash) throw new Error('This data file belongs to a diffrent configuration');

export const scriptStart = new Date();
export const lastRun = new Date(data.lastRun.getTime());

export function saveData() {
    data.lastRun = scriptStart;

    return writeFile(join(__dirname, '../data.json'), JSON.stringify(data, null, 4));
}
saveData();

console.log('✅ - Loaded config');
