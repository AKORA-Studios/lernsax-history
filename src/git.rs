use std::fmt::format;
use std::process::Command;
use std::process::Output;

#[path = "./config.rs"] mod config;
#[path = "./files.rs"] mod files;


static GIT_URL: String = format!("http://{}:{}@{}/{}", config::envs.GIT_USER, config::envs.GIT_PASSWORD, config::envs.GIT_HOST, config::envs.GIT_REPO);

fn execGit<T>(args: T) -> Output 
where
    T: IntoIterator,
    T::Item: &str,
    {
    let cmd = Command::new("git")
        .arg("Hello world")
        .current_dir(files::gitPath);

        for (arg) in args.iter() {
            cmd.arg(arg);
        }

    return cmd.output()
    .expect("Failed to execute command");}

pub fn initRepo() {
    //Pull if already cloned
    execGit(["config", format!("lfs.{}.git/info/lfs.locksverify",GIT_URL), "true"]);
    let success = execGit(vec!["pull"]);
    if (!success.status.success()) {
        let success =  execGit(vec!["clone", GIT_URL.as_str(), files::gitPath.to_str().unwrap()]);
        if (!success.status.success()) {
            //Deno.removeSync(gitPath, { recursive: true });
        let success =  execGit(vec!["clone", GIT_URL.as_str(), files::gitPath.to_str().unwrap()]);
            if (!success.status.success()) {
                //throw new Error("Git Failed");
            }
        }
    }
}

pub fn commitFiles() {
    /** git status --porcelain
     *  D path/calendar.ics
     * ?? "path/test s.odp"
     */
    let cmd = Command::new("git")
        .arg("status")
        .arg()
        
        .current_dir(files::gitPath);
    const p = Deno.run({
        cmd: ["git", "status", "--porcelain"],
        cwd: gitPath,
        stdout: "piped",
    });
    const [_, output] = await Promise.all([p.status(), p.output().then((s) => new TextDecoder().decode(s))]);

    if (output === "") return;

    const lines = output.split("\n").map((l) => l.replaceAll("\"", ""));
    lines.pop();

    const files = lines.map((l) => ({
        status: l.split(" ")[0].replace("D", "DEL").replace("??", "ADD"),
        path: l.slice(3),
    }));

    for (const { path, status } of files) await commitFile(path, status.padStart(2));
}

fn commitFile(path: string, msg: string) {
    await execGit("add", path);
    return await execGit("commit", "-m", `${msg} ${path}`);
}

pub fn push() {
    execGit("push");
}