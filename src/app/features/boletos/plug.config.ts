export const PLUG_REST_BASE = '/rest';
export const PLUG_OAUTH_USER = 'admin';
export const PLUG_OAUTH_PASS = '1234';

export function plugUrl(path: string): string {
  const base = PLUG_REST_BASE.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
