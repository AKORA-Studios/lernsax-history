import config from './config.ts';
import { join, __dirname } from './deps.ts';

export const gitPath = join(__dirname, '../git');

const GIT_URL = `http://${config.GIT_USER}:${config.GIT_PASSWORD}@${config.GIT_HOST}/${config.GIT_REPO}`;

async function execGit(...args: string[]) {
    const p = Deno.run({
        cmd: ['git', ...args],
        cwd: gitPath,
        stdout: 'piped',
        stderr: 'piped',
    });

    return await Promise.all([
        p.status(),
        p.output().then((s) => new TextDecoder().decode(s)),
        p.stderrOutput().then((s) => new TextDecoder().decode(s)),
    ]);
}

export async function initRepo() {
    try {
        //Pull if already cloned
        console.log((await execGit('pull'))[1]);
    } catch (_) {
        //console.log(e);
        //Clone if not existing yet
        try {
            //await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
            console.log((await execGit('clone', GIT_URL, gitPath))[1]);
        } catch (e) {
            console.log(e);
            Deno.removeSync(gitPath, { recursive: true });
            console.log((await execGit('clone', GIT_URL, gitPath))[1]);
        }
    }
}

export async function commitFiles() {
    /** git status --porcelain
     *  D path/calendar.ics
     * ?? "path/test s.odp"
     */
    const [_, output] = await execGit('status', '--porcelain');
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
    console.log((await execGit('push'))[1]);
}
