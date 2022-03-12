import { config } from './config';

import './files';
import { commitFiles, initRepo, push } from './git';
import { copyWebDAV } from './files';

async function main() {
    if (config.PROD) console.log('Started', new Date().toLocaleString());
    await initRepo();

    if (!config.PROD) console.log('✅ - Repo up to date');

    copyWebDAV();
    if (!config.PROD) console.log('✅ - Synced files');

    commitFiles();
    push();
    if (!config.PROD) console.log('✅ - Pushed to git');

    if (config.PROD) console.log('Finished', new Date().toLocaleString());

    //await syncWebDAV();
}

export async function stop(err?: Error) {
    //push();
    if (err) throw Error;
}

process.on('uncaughtException', (err) => stop(err));
process.on('SIGTERM', () => stop());

main();
