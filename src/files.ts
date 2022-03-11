import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gitPath } from './git';

export const filesPath = join(__dirname, '../files');

if (!existsSync(filesPath))
    try {
        mkdirSync(filesPath);
    } catch (e) {}

export function copyWebDAV() {
    console.log('Start copying...');
    const res = execFileSync('rsync', [
        '-rpt',
        '--max-size=2m',
        '--cvs-exclude', //ignores all files CVS ignores
        filesPath,
        gitPath,
    ]);
    console.log(execSync('ls -lah ' + gitPath).toString());
    console.log(res.toString());
}
