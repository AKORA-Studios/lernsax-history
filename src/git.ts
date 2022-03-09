import simpleGit, { CleanOptions } from 'simple-git';
import config from './config';
import { filesPath } from './files';

const git = simpleGit(filesPath);

export function initRepo() {
    git.clone(config.GIT_URL, filesPath);
}
