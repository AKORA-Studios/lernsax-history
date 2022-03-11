import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

import { join } from 'https://deno.land/std@0.129.0/path/mod.ts';
import { __dirname } from './files.ts';

const isDev = Deno.env.get('NODE_ENV') === 'development',
    isProd = Deno.env.get('NODE_ENV') === 'production';

export const config = {
    USERNAME: Deno.env.get('LERNSAX_USERNAME!'),
    PASSWORD: Deno.env.get('LERNSAX_PASSWORD!'),
    NODE_ENV: Deno.env.get("NODE_ENV as 'development' | 'production' | undefined"),
    WEBDAV_URL: Deno.env.get('LERNSAX_WEBDAV_URL!'),
    GIT_USER: Deno.env.get('GIT_USER!'),
    GIT_PASSWORD: Deno.env.get('GIT_PASSWORD!'),
    GIT_REPO: Deno.env.get('GIT_REPO!'),
    GIT_HOST: Deno.env.get('GIT_HOST!'),
    DEV: isDev,
    PROD: isProd,
};

if (!config.USERNAME) throw new Error('Username missing');
if (!config.PASSWORD) throw new Error('Username missing');
if (!config.WEBDAV_URL) throw new Error('WebDav URL missing');

export default config;

//persistent Data
let rawData;
try {
    Deno.readFileSync(join(__dirname, '../data.json'));
    rawData = JSON.parse(Deno.readFileSync(join(__dirname, '../data.json')).toString());
} catch (_) {
    Deno.writeTextFileSync(join(__dirname, '../data.json'), '{}');
    rawData = {};
}

type File = string;
type Dir = { name: string; files: FileTree | null };
type Entry = File | Dir;
export type FileTree = Entry[];

export const data = rawData as {
    hash: string;
    lastRun: Date;
    /** FileTree */
    filetree: FileTree;
};

const hash = hmac('sha256', 'key', config.WEBDAV_URL + config.USERNAME + config.PASSWORD, 'utf8', 'base64').toString();

data.lastRun ??= new Date(0);
data.lastRun = new Date(data.lastRun);
data.hash ??= hash;
data.filetree ??= [];

if (data.hash !== hash) throw new Error('This data file belongs to a diffrent configuration');

export const scriptStart = new Date();
export const lastRun = new Date(data.lastRun.getTime());

export function saveData() {
    data.lastRun = scriptStart;

    return Deno.writeTextFileSync(join(__dirname, '../data.json'), JSON.stringify(data, null, 4));
}
saveData();

console.log('✅ - Loaded config');
