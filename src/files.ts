import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { initRepo, pull } from './git';

export const filesPath = join(__dirname, '../files');

export async function checkRepo() {
    if (!existsSync(filesPath)) {
        mkdirSync(filesPath);
        await initRepo();
    }

    await pull();

    console.log('✅ - Repo up to date');
}

export async function syncWebDAV() {}
