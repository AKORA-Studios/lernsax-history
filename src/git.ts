import config from './config.ts';
import { join, __dirname } from './deps.ts';

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
        await pull();
        //await pull();
    } catch (_) {
        //console.log(e);
        //Clone if not existing yet
        try {
            //await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
            await execGit('clone', GIT_URL, gitPath);
        } catch (_) {
            Deno.removeSync(gitPath, { recursive: true });
            await execGit('clone', GIT_URL, gitPath);
        }
    }
}

export function pull() {
    return execGit('pull');
}

export async function commitFiles() {
    await execGit('add', '*');
    return await execGit('commit', '-m', 'Updated at ' + new Date().toLocaleString());
}

export function push() {
    return execGit('push');
}
