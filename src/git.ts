import simpleGit from 'simple-git';
import config from './config';
import { filesPath } from './files';
import { basename } from 'node:path';

const git = simpleGit(filesPath);
const GIT_URL = `https://${config.GIT_USER}:${config.GIT_PASSWORD}@github.com/${config.GIT_REPO}`;

export function initRepo() {
    return git.clone(GIT_URL, filesPath);
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
