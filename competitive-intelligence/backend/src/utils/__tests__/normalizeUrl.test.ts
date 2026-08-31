import { describe, expect, it } from 'vitest';
import { normalizeSourceUrl, buildMentionContentHash } from '../normalizeUrl';

describe('normalizeSourceUrl', () => {
  it('strips protocol, www, and trailing slash', () => {
    expect(normalizeSourceUrl('https://www.example.com/article/')).toBe('example.com/article');
    expect(normalizeSourceUrl('http://example.com/article')).toBe('example.com/article');
  });

  it('removes tracking params but keeps meaningful ones', () => {
    const withTracking = normalizeSourceUrl(
      'https://www.example.com/article?utm_source=twitter&utm_medium=social&id=42'
    );
    expect(withTracking).toBe('example.com/article?id=42');
  });

  it('produces the same key regardless of param order', () => {
    const a = normalizeSourceUrl('https://example.com/a?id=1&ref=x');
    const b = normalizeSourceUrl('https://example.com/a?ref=x&id=1');
    expect(a).toBe(b);
  });

  it('treats http/https and www variants of the same article as identical', () => {
    const a = normalizeSourceUrl('http://www.example.com/story');
    const b = normalizeSourceUrl('https://example.com/story/');
    expect(a).toBe(b);
  });

  it('falls back to a lowercased trim for unparseable input', () => {
    expect(normalizeSourceUrl('  Not A Url  ')).toBe('not a url');
  });
});

describe('buildMentionContentHash', () => {
  it('is stable for the same title/domain/day', () => {
    const a = buildMentionContentHash('Acme AI raises $20M', 'techcrunch.com', '2026-01-15T10:00:00Z');
    const b = buildMentionContentHash('  acme ai   raises $20M  ', 'TechCrunch.com', '2026-01-15T23:59:00Z');
    expect(a).toBe(b);
  });

  it('changes when the title differs', () => {
    const a = buildMentionContentHash('Acme AI raises $20M', 'techcrunch.com', '2026-01-15T10:00:00Z');
    const b = buildMentionContentHash('Acme AI raises $30M', 'techcrunch.com', '2026-01-15T10:00:00Z');
    expect(a).not.toBe(b);
  });

  it('changes when the publish day differs', () => {
    const a = buildMentionContentHash('Acme AI raises $20M', 'techcrunch.com', '2026-01-15T10:00:00Z');
    const b = buildMentionContentHash('Acme AI raises $20M', 'techcrunch.com', '2026-01-16T10:00:00Z');
    expect(a).not.toBe(b);
  });
});
