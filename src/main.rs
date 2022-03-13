use std::time::SystemTime;

mod config; //Load env variables
mod files;
mod git;

fn main() {
    let d = SystemTime::now();
    if config::envs().prod {
        println!("Started {:?}", d);
    }
    git::init_repo();

    if !config::envs().prod {
        println!("✅ - Repo up to date");
    }

    files::copy_web_dav();
    if !config::envs().prod {
        println!("✅ - Synced files");
    }

    git::commit_files();
    git::push();
    if !config::envs().prod {
        println!("✅ - Pushed to git");
    }

    let d = SystemTime::now();
    if config::envs().prod {
        println!("Finished {:?}\n\n", d);
    }

    //await syncWebDAV();
}
