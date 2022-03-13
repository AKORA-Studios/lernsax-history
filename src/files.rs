use std::env;
use std::path::PathBuf;
use std::process::Command;

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

    let mut cmd = Command::new("rsync");
    cmd.args([
        "rsync",
        "-rpt",
        "--delete",
        "--max-size=5m",
        "--cvs-exclude",                //ignores all files CVS ignores
        files_path().to_str().unwrap(), // + "/" Doesnt create a "files" fodler in the git folder
        git_path().to_str().unwrap(),
    ]);

    //await Deno.run({ cmd: ["ls", "-lah", gitPath] }).status();
}
