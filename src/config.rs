use std::env;

pub struct Config {
    pub node_env: String,
    pub git_user: String,
    pub git_password: String,
    pub git_repo: String,
    pub git_host: String,
    pub dev: bool,
    pub prod: bool,
}

pub fn envs() -> Config {
    return Config {
        node_env: env::var("NODE_ENV").expect("NODE_ENV missing"),
        git_user: env::var("GIT_USER").expect("GIT_USER missing"),
        git_password: env::var("GIT_PASSWORD").expect("GIT_PASSWORD missing"),
        git_repo: env::var("GIT_REPO").expect("GIT_REPO missing"),
        git_host: env::var("GIT_HOST").expect("GIT_HOST missing"),
        dev: if env::var("NODE_ENV").unwrap() == "development" {
            true
        } else {
            false
        },
        prod: if env::var("NODE_ENV").unwrap() == "production" {
            true
        } else {
            false
        },
    };
}

/*
if (!config.GIT_USER) {throw new Error("Username missing");}
if (!config.GIT_PASSWORD) throw new Error("Password missing");
if (!config.GIT_HOST) throw new Error("GitHost missing");
*/
