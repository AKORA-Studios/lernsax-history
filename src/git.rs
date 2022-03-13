use std::process::Command;
use std::process::Output;
use std::process::Stdio;
use std::str;

#[path = "./config.rs"]
mod config;
#[path = "./files.rs"]
mod files;

fn git_url() -> String {
    return format!(
        "http://{}:{}@{}/{}",
        config::envs().git_user,
        config::envs().git_password,
        config::envs().git_host,
        config::envs().git_repo
    );
}

fn exec_git(args: Vec<&str>) -> Output {
    if config::envs().verbose {
        println!("Exec git {:?}", args);
        println!(
            "CWD {:?}, GIT {:?}, FILES {:?}",
            files::cwd().to_str(),
            files::git_path().to_str(),
            files::files_path().to_str()
        );
    }
    let mut cmd = Command::new("git");

    cmd.current_dir(files::git_path())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit());

    for arg in args.iter() {
        cmd.arg(arg);
    }

    return cmd.output().expect("Failed to execute git command");
}

pub fn init_repo() {
    //Pull if already cloned
    exec_git(vec![
        "config",
        format!("lfs.{}.git/info/lfs.locksverify", git_url()).as_str(),
        "true",
    ]);
    let success = exec_git(vec!["pull"]);
    if !success.status.success() {
        let success = exec_git(vec![
            "clone",
            git_url().as_str(),
            files::git_path().to_str().unwrap(),
        ]);
        if !success.status.success() {
            //Deno.removeSync(gitPath, { recursive: true });
            let success = exec_git(vec![
                "clone",
                git_url().as_str(),
                files::git_path().to_str().unwrap(),
            ]);
            if !success.status.success() {
                //throw new Error("Git Failed");
            }
        }
    }
}

pub fn commit_files() {
    /* git status --porcelain
     *  D path/calendar.ics
     * ?? "path/test s.odp"
     */

    let output = Command::new("/usr/bin/git")
        .arg("status")
        .arg("--porcelain")
        .current_dir(files::git_path())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .output()
        .unwrap();
    let string = str::from_utf8(&output.stdout).unwrap();
    if string == "" {
        return;
    }

    let mut lines: Vec<&str> = string.split("\n").collect();
    lines.pop();

    for line in lines {
        let tmp = line.replace("\"", "").replace("\"", "");
        let (msg, path) = tmp.split_at(3);
        commit_file(path, msg);
    }
}

fn commit_file(path: &str, msg: &str) {
    exec_git(vec!["add", path]);
    exec_git(vec!["commit", "-m", format!("{} {}", msg, path).as_str()]);
}

pub fn push() {
    exec_git(vec!["push"]);
}
