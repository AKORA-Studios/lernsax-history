import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const filesPath = join(__dirname, '../files');
/*
if (!existsSync(filesPath))
    try {
        mkdirSync(filesPath);
    } catch (e) {}
*/
