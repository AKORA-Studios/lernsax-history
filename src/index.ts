import config from './config'; //Load env variables

import { AuthType, createClient } from 'webdav';

export const client = createClient(config.WEBDAV_URL, {
    authType: AuthType.Digest,
    username: config.USERNAME,
    password: config.PASSWORD,
});

export default client;
