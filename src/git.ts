import simpleGit from 'simple-git';
import config from './config';
import { basename, join } from 'node:path';

export const gitPath = join(__dirname, '../git');

const git = simpleGit(gitPath);
const GIT_URL = `https://${config.GIT_USER}:${config.GIT_PASSWORD}@${config.GIT_HOST}/${config.GIT_REPO}`;

export async function initRepo() {
    try {
        await pull();
    } catch (e) {
        //Repo doesnt exist
        await git.clone(GIT_URL, gitPath);
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
