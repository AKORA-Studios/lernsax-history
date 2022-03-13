import './config.ts'; //Load env variables
import './files.ts';

import { commitFiles, initRepo, push } from './git.ts';
import { copyWebDAV } from './files.ts';
import { config } from './config.ts';

let done = (_value: unknown) => {};
const finished = new Promise((res) => (done = res));

async function main() {
    if (config.PROD) console.log('Started', new Date().toLocaleString());
    await initRepo();

    if (!config.PROD) console.log('✅ - Repo up to date');

    await copyWebDAV();
    if (!config.PROD) console.log('✅ - Synced files');

    await commitFiles();
    await push();
    if (!config.PROD) console.log('✅ - Pushed to git');

    if (config.PROD) console.log('Finished', new Date().toLocaleString(), '\n\n');

    done('F');
    //await syncWebDAV();
}

export function stop(err?: Error) {
    console.log('Stopping');
    //push();
    finished.then(() => {
        if (err) throw Error;
        Deno.exit();
    });
}

Deno.addSignalListener('SIGQUIT', () => {
    console.log('SIGQUIT');
    stop();
});

Deno.addSignalListener('SIGTERM', () => {
    console.log('SIGTERM');
    stop();
});
