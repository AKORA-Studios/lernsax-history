import { join, __dirname } from './deps.ts';
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
            '--max-size=2m',
            '--cvs-exclude', //ignores all files CVS ignores
            filesPath + '/', //Doesnt create a "files" fodler in the git folder
            gitPath,
        ],
        stdout: 'piped',
    }).status();
    console.log(await Deno.run({ cmd: ['ls', '-lah', gitPath], stdout: 'piped' }).status());
}
