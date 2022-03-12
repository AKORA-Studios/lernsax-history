import config from './config.ts';
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.129.0/path/mod.ts';

export const __dirname = dirname(fromFileUrl(import.meta.url));
export const gitPath = join(__dirname, '../git');

const GIT_URL = `http://${config.GIT_USER}:${config.GIT_PASSWORD}@${config.GIT_HOST}/${config.GIT_REPO}`;

function execGit(...args: string[]) {
    return Deno.run({
        cmd: ['git', ...args],
        cwd: gitPath,
    }).status();
}

export async function initRepo() {
    try {
        //Pull if already cloned
        pull();
        //await pull();
    } catch (_) {
        //console.log(e);
        //Clone if not existing yet
        try {
            //await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
            await execGit('clone', GIT_URL, gitPath);
        } catch (_) {
            Deno.removeSync(gitPath, { recursive: true });
            execGit('clone', GIT_URL, gitPath);
        }
    }
}

export function pull() {
    return;
}

export function commitFiles() {
    execGit('add', '*');
    return execGit('commit', '-m', 'Updated at ' + new Date().toLocaleString());
}

export function push() {
    return execGit('push');
}
