import { __dirname, join } from './deps.ts';
export const filesPath = join(__dirname, '../files');

import { gitPath } from './git.ts';

try {
    Deno.mkdirSync(filesPath);
} catch (_) {
    /** */
}

export async function copyWebDAV() {
    console.log('Start copying...');

    await Deno.run({
        cmd: [
            'rsync',
            '-rpt',
            '--delete',
            '--max-size=5m',
            '--cvs-exclude', //ignores all files CVS ignores
            filesPath, // + '/' Doesnt create a "files" fodler in the git folder
            gitPath,
        ],
    }).status();
    //await Deno.run({ cmd: ['ls', '-lah', gitPath] }).status();
}
