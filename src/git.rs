use std::process::Command;
use std::process::Output;
use std::str;

#[path = "./config.rs"]
mod config;
#[path = "./files.rs"]
mod files;

fn GIT_URL() -> String {
    return format!(
        "http://{}:{}@{}/{}",
        config::envs().GIT_USER,
        config::envs().GIT_PASSWORD,
        config::envs().GIT_HOST,
        config::envs().GIT_REPO
    );
}

fn exec_git(args: Vec<&str>) -> Output {
    let mut cmd = Command::new("git");

    cmd.arg("Hello world").current_dir(files::git_path());

    for arg in args.iter() {
        cmd.arg(arg);
    }

    return cmd.output().expect("Failed to execute command");
}

pub fn init_repo() {
    //Pull if already cloned
    exec_git(vec![
        "config",
        format!("lfs.{}.git/info/lfs.locksverify", GIT_URL()).as_str(),
        "true",
    ]);
    let success = exec_git(vec!["pull"]);
    if !success.status.success() {
        let success = exec_git(vec![
            "clone",
            GIT_URL().as_str(),
            files::git_path().to_str().unwrap(),
        ]);
        if !success.status.success() {
            //Deno.removeSync(gitPath, { recursive: true });
            let success = exec_git(vec![
                "clone",
                GIT_URL().as_str(),
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

    let output = Command::new("git")
        .arg("status")
        .arg("--porcelain")
        .current_dir(files::git_path())
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
