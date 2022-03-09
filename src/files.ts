import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { initRepo } from './git';

export const filesPath = join(__dirname, '../files');

if (!existsSync(filesPath)) {
    mkdirSync(filesPath);
    initRepo();
}
