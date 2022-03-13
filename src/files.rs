use std::env;
use std::path::PathBuf;

pub static cwd: PathBuf = env::current_dir().unwrap();
pub static filesPath: PathBuf = cwd.join("files");
pub static gitPath: PathBuf = cwd.join("git");

/**
try {
    Deno.mkdirSync(filesPath);
} catch (_) {
    /** */
}
*/

pub fn copyWebDAV() {
    println!("Start copying...");
    /*
    await Deno.run({
        cmd: [
            "rsync",
            "-rpt",
            "--delete",
            "--max-size=5m",
            "--cvs-exclude", //ignores all files CVS ignores
            filesPath, // + "/" Doesnt create a "files" fodler in the git folder
            gitPath,
        ],
    }).status();
    */
    //await Deno.run({ cmd: ["ls", "-lah", gitPath] }).status();
}
