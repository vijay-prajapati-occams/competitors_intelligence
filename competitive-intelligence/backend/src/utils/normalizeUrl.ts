import { createHash } from 'crypto';

const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

/**
 * Collapses tracking params, protocol, www, and trailing slashes so the same
 * article reached via different links/campaigns normalizes to one dedupe key.
 */
export function normalizeSourceUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return rawUrl.trim().toLowerCase();
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  for (const param of TRACKING_PARAMS) {
    parsed.searchParams.delete(param);
  }
  parsed.searchParams.sort();

  let pathname = parsed.pathname.replace(/\/+$/, '');
  if (pathname === '') pathname = '/';

  const search = parsed.searchParams.toString();
  return `${hostname}${pathname}${search ? `?${search}` : ''}`;
}

/**
 * Fallback dedupe key for when providers return different URLs (redirect
 * wrappers, syndication mirrors) for what is clearly the same article.
 */
export function buildMentionContentHash(
  title: string,
  sourceDomain: string,
  publishedAt: Date | string | undefined
): string {
  const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, ' ');
  const day = publishedAt ? new Date(publishedAt).toISOString().slice(0, 10) : 'unknown-date';
  return createHash('sha256').update(`${normalizedTitle}|${sourceDomain.toLowerCase()}|${day}`).digest('hex');
}
