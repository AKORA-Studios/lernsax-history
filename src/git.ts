import simpleGit from 'simple-git';
import config from './config';
import { filesPath } from './files';
import { basename } from 'node:path';

const git = simpleGit(filesPath);

export function initRepo() {
    return git.clone(config.GIT_URL, filesPath);
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
