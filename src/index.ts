import config, { saveData } from './config'; //Load env variables
import './files';

import { commitFiles, initRepo, push } from './git';
import { copyWebDAV } from './files';

async function main() {
    await initRepo();
    console.log('✅ - Repo up to date');

    copyWebDAV();
    console.log('✅ - Synced files');

    commitFiles();
    push();
    console.log('✅ - Pushed to git');
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
