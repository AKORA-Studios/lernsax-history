use std::env;
use std::path::PathBuf;

pub fn cwd() -> PathBuf {
    return env::current_dir().unwrap();
}
pub fn files_path() -> PathBuf {
    return cwd().join("files");
}
pub fn git_path() -> PathBuf {
    return cwd().join("git");
}

pub fn copy_web_dav() {
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
