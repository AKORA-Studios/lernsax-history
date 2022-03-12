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
    //Pull if already cloned
    const { success } = await execGit('pull');
    if (!success) {
        //await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
        const { success } = await execGit('clone', GIT_URL, gitPath);
        if (!success) {
            Deno.removeSync(gitPath, { recursive: true });
            const { success } = await execGit('clone', GIT_URL, gitPath);
            if (!success) {
                throw new Error('Git Failed');
            }
        }
    }
}

export async function commitFiles() {
    /** git status --porcelain
     *  D path/calendar.ics
     * ?? "path/test s.odp"
     */
    const p = Deno.run({
        cmd: ['git', 'status', '--porcelain'],
        cwd: gitPath,
        stdout: 'piped',
    });
    const [_, output] = await Promise.all([p.status(), p.output().then((s) => new TextDecoder().decode(s))]);
    const lines = output.split('\n').map((l) => l.replaceAll('"', ''));

    const files = lines.map((l) => ({
        status: l.split(' ')[0],
        path: l.slice(3),
    }));

    for (const { path, status } of files) await commitFile(path, status.padStart(2));
}

export async function commitFile(path: string, msg: string) {
    await execGit('add', path);
    return await execGit('commit', '-m', `${msg} ${path}`);
}

export async function push() {
    await execGit('push');
}
