mod config; //Load env variables
mod files;
mod git;

fn main() {
    if (config::envs.PROD) {
        println!("Started", new Date().toLocaleString());
    }
    git::initRepo();

    if (!config::envs.PROD) {
        println!("✅ - Repo up to date");
    }

    files::copyWebDAV();
    if (!config::envs.PROD) {
        println!("✅ - Synced files");
    }

    git::commitFiles();
    git::push();
    if (!config::envs.PROD) {
        println!("✅ - Pushed to git");
    }

    if (config::envs.PROD) {
        println!("Finished", new Date().toLocaleString(), "\n\n");
    }

    done("F");
    //await syncWebDAV();
}
