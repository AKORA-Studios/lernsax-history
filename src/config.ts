import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.129.0/path/mod.ts';
export const __dirname = dirname(fromFileUrl(import.meta.url));

const isDev = Deno.env.get('NODE_ENV') === 'development',
    isProd = Deno.env.get('NODE_ENV') === 'production';

export const config = {
    NODE_ENV: Deno.env.get("NODE_ENV as 'development' | 'production' | undefined"),
    GIT_USER: Deno.env.get('GIT_USER!'),
    GIT_PASSWORD: Deno.env.get('GIT_PASSWORD!'),
    GIT_REPO: Deno.env.get('GIT_REPO!'),
    GIT_HOST: Deno.env.get('GIT_HOST!'),
    DEV: isDev,
    PROD: isProd,
};

if (!config.GIT_USER) throw new Error('Username missing');
if (!config.GIT_PASSWORD) throw new Error('Password missing');
if (!config.GIT_HOST) throw new Error('GitHost missing');

export default config;
