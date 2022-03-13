mod config; //Load env variables
mod files;
mod git;

fn main() {
    if !config::envs().prod {
        println!("Started {}", "a");
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

    if config::envs().prod {
        println!("Finished {} {}", "b", "\n\n");
    }

    //await syncWebDAV();
}
