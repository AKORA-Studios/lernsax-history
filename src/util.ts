import config from './config';

export function replace(str: string) {
    return str
        .replaceAll(config.USERNAME, '{USERNAME}')
        .replaceAll(config.PASSWORD, '{PASSWORD}')
        .replaceAll(config.WEBDAV_URL, '{URL}');
}
