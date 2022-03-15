use std::env;
use std::path::PathBuf;
use std::process::Command;
use std::process::Stdio;

#[path = "./config.rs"]
mod config;

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
    cmd.output().unwrap();

    //await Deno.run({ cmd: ["ls", "-lah", gitPath] }).status();
}

#[allow(dead_code)]
// https://manos-dresden.de/vplan/upload/current/students.json
// https://manos-dresden.de/vplan/upload/next/students.json

pub fn download_vplans() {
    download_vplan(config::envs().vplan_url.as_str(), "/git/vplan.json");
    download_vplan(
        config::envs().vplan_url.replace("next", "current").as_str(),
        "/git/current_vplan.json",
    );
}

fn download_vplan(url: &str, file_path: &str) {
    println!("Downloading {}...", file_path);

    let mut user_arg: String = "--user=".to_owned();
    user_arg.push_str(config::envs().vplan_user.as_str());
    let mut pass_arg: String = "--password=".to_owned();
    pass_arg.push_str(config::envs().vplan_pass.as_str());

    let mut cmd = Command::new("wget");
    cmd.args([
        "-q",
        user_arg.as_str(),
        pass_arg.as_str(),
        url,
        "-O",
        file_path, //ignores all files CVS ignores
    ])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit());
    cmd.output().unwrap();
}
