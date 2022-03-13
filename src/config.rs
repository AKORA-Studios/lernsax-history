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
        node_env: env::var("NODE_ENV").unwrap(),
        git_user: env::var("GIT_USER").unwrap(),
        git_password: env::var("GIT_PASSWORD").unwrap(),
        git_repo: env::var("GIT_REPO").unwrap(),
        git_host: env::var("GIT_HOST").unwrap(),
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
