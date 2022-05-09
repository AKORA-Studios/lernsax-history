use chrono::DateTime;
use chrono::Utc;
use std::time::SystemTime;
extern crate chrono;

mod config; //Load env variables
mod files;
mod git;

fn main() -> Result<(), ureq::Error> {
    if config::envs().prod {
        let system_time = SystemTime::now();
        let datetime: DateTime<Utc> = system_time.into();
        println!("Started {}", datetime.format("%d/%m/%Y %T"));
    }
    git::init_repo();

    if !config::envs().prod {
        println!("✅ - Repo up to date");
    }

    files::copy_web_dav();
    if !config::envs().prod {
        println!("✅ - Synced files");
    }

    files::download_vplans();
    if !config::envs().prod {
        println!("✅ - Downloaded VPlan");
    }

    git::commit_files();
    git::push();
    if !config::envs().prod {
        println!("✅ - Pushed to git");
    }

    if config::envs().prod {
        let system_time = SystemTime::now();
        let datetime: DateTime<Utc> = system_time.into();
        println!("Finished {}\n\n", datetime);
    }

    //await syncWebDAV();
    Ok(())
}
