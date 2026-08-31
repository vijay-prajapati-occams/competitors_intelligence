const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalize = (value: string): string => stripTrailingSlash(value.trim().toLowerCase());

/**
 * Builds a matcher for one configured origin. A `*` acts as a wildcard for a
 * single hostname label, which is how Vercel preview deployments are opted in:
 * every preview build gets its own hostname, so an exact allow-list would
 * reject them all. Wildcards must be written explicitly in FRONTEND_URL
 * (e.g. `https://my-app-*.vercel.app`) — nothing is inferred, so a bare
 * production origin never widens to someone else's similarly named project.
 */
function toMatcher(pattern: string): (origin: string) => boolean {
  const normalized = normalize(pattern);
  if (!normalized) return () => false;
  if (!normalized.includes('*')) return (origin) => origin === normalized;

  const source = normalized.split('*').map(escapeRegExp).join('[a-z0-9-]+');
  const regex = new RegExp(`^${source}$`);
  return (origin) => regex.test(origin);
}

/**
 * Origins are compared case-insensitively and ignoring a trailing slash, so a
 * FRONTEND_URL of `https://app.example.com/` still matches the browser-sent
 * `https://app.example.com`.
 */
export function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  const candidate = normalize(origin);
  if (!candidate) return false;
  return allowedOrigins.some((allowed) => toMatcher(allowed)(candidate));
}
