import config, { saveData } from './config'; //Load env variables
import './files';

import { createClient } from 'webdav';
import { checkRepo, syncWebDAV } from './files';
import { push } from './git';

export const client = createClient(config.WEBDAV_URL, {
    username: config.USERNAME,
    password: config.PASSWORD,
});

export default client;

async function main() {
    await client.getQuota();
    saveData();

    console.log('✅ - Connected Client');

    await checkRepo();

    await syncWebDAV();
}

export async function stop(err?: Error) {
    saveData();
    push();
    if (err) throw Error;
}

process.on('uncaughtException', (err) => stop(err));
process.on('SIGTERM', () => stop());

main();
