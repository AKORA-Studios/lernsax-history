import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { FileStat } from 'webdav';
import client from '.';
import { data, FileTree, saveData } from './config';

export const filesPath = join(__dirname, '../files');
if (!existsSync(filesPath))
    try {
        mkdirSync(filesPath);
    } catch (e) {}

async function traverse(path: string): Promise<[FileTree, boolean]> {
    let tree: FileTree = [];
    let full = true;
    const contents = (await client.getDirectoryContents(path)) as FileStat[];
    for (let entry of contents) {
        if (entry.type === 'directory') {
            tree.push({
                name: entry.basename,
                files: null,
            });
            full = false;
        } else {
            tree.push(entry.filename);
        }
    }

    return [tree, full];
}

export async function syncWebDAV() {
    console.log();
    return;
    //Create FileTree
    let completed = false;
    while (!completed) {
        let [tree, full] = await traverse('/'); //Depth one
        if (full) completed = true;

        data.filetree = tree;
    }
    saveData();
}
