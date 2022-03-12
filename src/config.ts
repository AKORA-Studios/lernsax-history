import { config as loadConfig } from 'dotenv';

//Load enviroment variables
loadConfig();

const isDev = process.env.NODE_ENV === 'development',
    isProd = process.env.NODE_ENV === 'production';

export const config = {
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | undefined,
    GIT_USER: process.env.GIT_USER!,
    GIT_PASSWORD: process.env.GIT_PASSWORD!,
    GIT_REPO: process.env.GIT_REPO!,
    GIT_HOST: process.env.GIT_HOST!,
    DEV: isDev,
    PROD: isProd,
};

if (!config.GIT_USER) throw new Error('Username missing');
if (!config.GIT_PASSWORD) throw new Error('Username missing');
if (!config.GIT_HOST) throw new Error('GIT_HOST missing');

export default config;

console.log('✅ - Loaded config');
