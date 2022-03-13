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

static envs: Config = Config {
    NODE_ENV: env::var("NODE_ENV").unwrap(),
    GIT_USER: env::var("GIT_USER").unwrap(),
    GIT_PASSWORD: env::var("GIT_PASSWORD").unwrap(),
    GIT_REPO: env::var("GIT_REPO").unwrap(),
    GIT_HOST: env::var("GIT_HOST").unwrap(),
    DEV: if env::var("NODE_ENV").unwrap() == "development" {
        true
    } else {
        false
    },
    PROD: if env::var("NODE_ENV").unwrap() == "production" {
        true
    } else {
        false
    },
};

/*
if (!config.GIT_USER) {throw new Error("Username missing");}
if (!config.GIT_PASSWORD) throw new Error("Password missing");
if (!config.GIT_HOST) throw new Error("GitHost missing");
*/
