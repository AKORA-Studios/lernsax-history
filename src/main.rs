mod config; //Load env variables
mod files;
mod git;

fn main() {
    if !config::envs().PROD {
        println!("Started {}", "a");
    }
    git::init_repo();

    if !config::envs().PROD {
        println!("✅ - Repo up to date");
    }

    files::copy_web_dav();
    if !config::envs().PROD {
        println!("✅ - Synced files");
    }

    git::commit_files();
    git::push();
    if !config::envs().PROD {
        println!("✅ - Pushed to git");
    }

    if config::envs().PROD {
        println!("Finished {} {}", "b", "\n\n");
    }

    //await syncWebDAV();
}
