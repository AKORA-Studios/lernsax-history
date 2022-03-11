import simpleGit, { SimpleGit } from 'simple-git';
import config from './config';
import { basename, join } from 'node:path';

export const gitPath = join(__dirname, '../git');

let git: SimpleGit;
const GIT_URL = `http://${config.GIT_USER}:${config.GIT_PASSWORD}@${config.GIT_HOST}/${config.GIT_REPO}`;

export async function initRepo() {
    try {
        //Pull if already cloned
        git = simpleGit(gitPath);
        await pull();
    } catch (e) {
        //Clone if not existing yet
        await simpleGit(join(gitPath, '..')).clone(GIT_URL, gitPath);
        git = simpleGit(gitPath);
    }
}

export function pull() {
    return git.pull();
}

export async function commitFile(path: string) {
    await git.add(path);
    return await git.commit(basename(path));
}

export function push() {
    return git.push();
}
