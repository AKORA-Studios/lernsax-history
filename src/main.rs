mod config; //Load env variables
mod files;
mod git;

fn main() {
    if (config.PROD) {
        println!("Started", new Date().toLocaleString());
    }
    git::initRepo();

    if (!config.PROD) {
        println!("✅ - Repo up to date");
    }

    files::copyWebDAV();
    if (!config.PROD) {
        println!("✅ - Synced files");
    }

    git::commitFiles();
    git::push();
    if (!config.PROD) {
        println!("✅ - Pushed to git");
    }

    if (config.PROD) {
        println!("Finished", new Date().toLocaleString(), "\n\n");
    }

    done('F');
    //await syncWebDAV();
}
