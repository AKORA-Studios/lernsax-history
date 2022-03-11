import simpleGit, { SimpleGit } from 'simple-git';
import config from './config';
import { basename, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { mkdirSync, rmdirSync, rmSync } from 'node:fs';

export const gitPath = join(__dirname, '../git');

let git: SimpleGit;
const GIT_URL = `http://${config.GIT_USER}:${config.GIT_PASSWORD}@${config.GIT_HOST}/${config.GIT_REPO}`;

function execGit(...args: string[]) {
    return execFileSync('git', args, {
        cwd: gitPath,
    }).toString();
}

export async function initRepo() {
    try {
        //Pull if already cloned
        await access(gitPath);
        pull();
        //await pull();
    } catch (e) {
        //console.log(e);
        //Clone if not existing yet
        try {
            //await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
            execFileSync('git', ['clone', GIT_URL, gitPath]);
        } catch (e) {
            rmSync(gitPath, { recursive: true, force: true });
            execFileSync('git', ['clone', GIT_URL, gitPath]);
        }
    }
    git = simpleGit(gitPath);
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
