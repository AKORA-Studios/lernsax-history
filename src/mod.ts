import './config.ts'; //Load env variables
import './files.ts';

import { commitFiles, initRepo, push } from './git.ts';
import { copyWebDAV } from './files.ts';
import { config } from './config.ts';

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

export function stop(err?: Error) {
    //push();
    if (err) throw Error;
    Deno.exit();
}

Deno.addSignalListener('SIGTERM', () => {
    stop();
});

main();
