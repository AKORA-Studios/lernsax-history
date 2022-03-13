use std::env;

pub struct Config {
    pub NODE_ENV: String,
    pub GIT_USER: String,
    pub GIT_PASSWORD: String,
    pub GIT_REPO: String,
    pub GIT_HOST: String,
    pub DEV: bool,
    pub PROD: bool,
}

let envs = Config {
    NODE_ENV: env::var("NODE_ENV").unwrap()
}

if (!config.GIT_USER) {throw new Error("Username missing");}
if (!config.GIT_PASSWORD) throw new Error("Password missing");
if (!config.GIT_HOST) throw new Error("GitHost missing");