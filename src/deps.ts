export { dirname, fromFileUrl, join } from 'https://deno.land/std@0.129.0/path/mod.ts';
export const __dirname = dirname(fromFileUrl(import.meta.url));
