import config, { saveData } from './config'; //Load env variables
import './files';

import { createClient } from 'webdav';
import { initRepo, push } from './git';

export const client = createClient(config.WEBDAV_URL, {
    username: config.USERNAME,
    password: config.PASSWORD,
});

export default client;

async function main() {
    await client.getQuota();
    saveData();
    console.log('✅ - Connected Client');

    await initRepo();
    console.log('✅ - Repo up to date');

    //await syncWebDAV();
}

export async function stop(err?: Error) {
    saveData();
    //push();
    if (err) throw Error;
}

process.on('uncaughtException', (err) => stop(err));
process.on('SIGTERM', () => stop());

main();
