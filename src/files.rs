use std::env;
use std::path::PathBuf;
use std::process::Command;
use std::process::Stdio;

#[allow(dead_code)]
pub fn cwd() -> PathBuf {
    return env::current_dir().unwrap();
}

#[allow(dead_code)]
pub fn files_path() -> PathBuf {
    return PathBuf::from("/files");
}

pub fn git_path() -> PathBuf {
    return PathBuf::from("/git");
}

#[allow(dead_code)]
pub fn copy_web_dav() {
    println!("Start copying...");

    let mut cmd = Command::new("rsync");
    cmd.args([
        "-rpt",
        "--delete",
        "--max-size=5m",
        "--cvs-exclude",                //ignores all files CVS ignores
        files_path().to_str().unwrap(), // + "/" Doesnt create a "files" fodler in the git folder
        git_path().to_str().unwrap(),
    ])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit());

    //await Deno.run({ cmd: ["ls", "-lah", gitPath] }).status();
}
