import config, { data, saveData } from './config'; //Load env variables

import { AuthType, createClient } from 'webdav';

export const client = createClient(config.WEBDAV_URL, {
    username: config.USERNAME,
    password: config.PASSWORD,
});

export default client;

async function initClient() {
    await client.getQuota();

    saveData();

    console.log('✅ - Connected Client');
}

export async function stop(err?: Error) {
    saveData();
    if (err) throw Error;
}

process.on('uncaughtException', (err) => stop(err));
process.on('SIGTERM', () => stop());

initClient();
