use std::process::Command;
use std::process::Output;
use std::str;

#[path = "./config.rs"]
mod config;
#[path = "./files.rs"]
mod files;

static GIT_URL: String = format!(
    "http://{}:{}@{}/{}",
    config::envs.GIT_USER,
    config::envs.GIT_PASSWORD,
    config::envs.GIT_HOST,
    config::envs.GIT_REPO
);

fn execGit(args: Vec<&str>) -> Output {
    let cmd = Command::new("git")
        .arg("Hello world")
        .current_dir(files::gitPath);

    for arg in args.iter() {
        cmd.arg(arg);
    }

    return cmd.output().expect("Failed to execute command");
}

pub fn initRepo() {
    //Pull if already cloned
    execGit([
        "config",
        format!("lfs.{}.git/info/lfs.locksverify", GIT_URL),
        "true",
    ]);
    let success = execGit(vec!["pull"]);
    if !success.status.success() {
        let success = execGit(vec![
            "clone",
            GIT_URL.as_str(),
            files::gitPath.to_str().unwrap(),
        ]);
        if !success.status.success() {
            //Deno.removeSync(gitPath, { recursive: true });
            let success = execGit(vec![
                "clone",
                GIT_URL.as_str(),
                files::gitPath.to_str().unwrap(),
            ]);
            if !success.status.success() {
                //throw new Error("Git Failed");
            }
        }
    }
}

pub fn commitFiles() {
    /* git status --porcelain
     *  D path/calendar.ics
     * ?? "path/test s.odp"
     */
    let cmd = Command::new("git")
        .arg("status")
        .arg("--porcelain")
        .current_dir(files::gitPath);

    let output = cmd.output().unwrap();
    let string = str::from_utf8(&output.stdout).unwrap();
    if string == "" {
        return;
    }

    let lines: Vec<&str> = string.split("\n").collect();
    lines.pop();

    for line in lines {
        line.replace("\"", "");
        line.replace("\"", "");
        let (msg, path) = line.split_at(3);
        commitFile(path, msg);
    }
}

fn commitFile(path: &str, msg: &str) {
    execGit(vec!["add", path]);
    execGit(vec!["commit", "-m", format!("{} {}", msg, path)]);
}

pub fn push() {
    execGit(vec!["push"]);
}
