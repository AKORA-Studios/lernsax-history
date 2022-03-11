import { join, dirname, fromFileUrl } from 'https://deno.land/std@0.129.0/path/mod.ts';
import { gitPath } from './git.ts';

export const __dirname = dirname(fromFileUrl(import.meta.url));
export const filesPath = join(__dirname, '../files');
console.log(filesPath, gitPath);

try {
    Deno.mkdirSync(filesPath);
} catch (_) {
    /** */
}

export async function copyWebDAV() {
    console.log('Start copying...');
    const res = await Deno.run({
        cmd: [
            'rsync',
            '-rpt',
            '--max-size=2m',
            '--cvs-exclude', //ignores all files CVS ignores
            filesPath + '/', //Doesnt create a "files" fodler in the git folder
            gitPath,
        ],
    }).status();
    console.log(await Deno.run({ cmd: ['ls', '-lah', gitPath], stdout: 'piped' }).status());
    console.log(res.toString());
}
