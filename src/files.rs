mod git;

let filesPath = join(__dirname, "../files");


/**
try {
    Deno.mkdirSync(filesPath);
} catch (_) {
    /** */
}
*/

fn copyWebDAV() {
    println!("Start copying...");

    await Deno.run({
        cmd: [
            'rsync',
            '-rpt',
            '--delete',
            '--max-size=5m',
            '--cvs-exclude', //ignores all files CVS ignores
            filesPath, // + '/' Doesnt create a "files" fodler in the git folder
            gitPath,
        ],
    }).status();
    //await Deno.run({ cmd: ['ls', '-lah', gitPath] }).status();
}
