use std::env;

pub struct Config {
    pub node_env: String,
    pub git_user: String,
    pub git_password: String,
    pub git_repo: String,
    pub git_host: String,
    pub dev: bool,
    pub prod: bool,
    pub verbose: bool,
    pub vplan_url: String,
    pub vplan_user: String,
    pub vplan_pass: String,
    pub mask: String,
}

pub fn envs() -> Config {
    return Config {
        node_env: env::var("NODE_ENV").expect("NODE_ENV missing"),
        git_user: env::var("GIT_USER").expect("GIT_USER missing"),
        git_password: env::var("GIT_PASSWORD").expect("GIT_PASSWORD missing"),
        git_repo: env::var("GIT_REPO").expect("GIT_REPO missing"),
        git_host: env::var("GIT_HOST").expect("GIT_HOST missing"),
        vplan_url: env::var("VPLAN_URL").expect("VPLAN_URL missing"),
        vplan_user: env::var("VPLAN_USER").expect("VPLAN_USER missing"),
        vplan_pass: env::var("VPLAN_PASS").expect("VPLAN_PASS missing"),
        mask: env::var("MASK").expect("MASK missing"),
        verbose: if env::var("VERBOSE").unwrap_or("NO".to_string()) == "YES" {
            true
        } else {
            false
        },
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
