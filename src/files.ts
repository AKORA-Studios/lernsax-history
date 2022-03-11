import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gitPath } from './git';

export const filesPath = join(__dirname, '../files');

if (!existsSync(filesPath))
    try {
        mkdirSync(filesPath);
    } catch (e) {}

export function copyWebDAV() {
    execFileSync('rsync', [
        '-rpt',
        '--max-size=1m',
        '--exclude-from=' + join(__dirname, '.gitignore'),
        filesPath,
        gitPath,
    ]);
}
