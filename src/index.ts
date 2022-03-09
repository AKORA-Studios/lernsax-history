import { AuthType, createClient } from 'webdav';

const client = createClient('https://some-server.org', {
    authType: AuthType.Digest,
    username: 'user',
    password: 'pass',
});
