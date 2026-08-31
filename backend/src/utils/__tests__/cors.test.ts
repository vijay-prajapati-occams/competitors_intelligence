import { describe, it, expect } from 'vitest';
import { isOriginAllowed } from '../cors';

const PROD = ['https://app.example.com'];

describe('isOriginAllowed', () => {
  it('accepts an exact match', () => {
    expect(isOriginAllowed('https://app.example.com', PROD)).toBe(true);
  });

  it('ignores a trailing slash on either side', () => {
    expect(isOriginAllowed('https://app.example.com/', PROD)).toBe(true);
    expect(isOriginAllowed('https://app.example.com', ['https://app.example.com/'])).toBe(true);
  });

  it('ignores case', () => {
    expect(isOriginAllowed('https://APP.Example.com', PROD)).toBe(true);
  });

  it('rejects a different host', () => {
    expect(isOriginAllowed('https://evil.com', PROD)).toBe(false);
  });

  it('rejects a scheme mismatch', () => {
    expect(isOriginAllowed('http://app.example.com', PROD)).toBe(false);
  });

  it('rejects a suffix-extended host', () => {
    expect(isOriginAllowed('https://app.example.com.evil.com', PROD)).toBe(false);
  });

  it('supports multiple configured origins', () => {
    const allowed = ['https://app.example.com', 'http://localhost:3000'];
    expect(isOriginAllowed('http://localhost:3000', allowed)).toBe(true);
  });

  describe('wildcard (Vercel previews)', () => {
    const withPreviews = ['https://my-app.vercel.app', 'https://my-app-*.vercel.app'];

    it('accepts the production origin', () => {
      expect(isOriginAllowed('https://my-app.vercel.app', withPreviews)).toBe(true);
    });

    it('accepts a preview deployment', () => {
      expect(isOriginAllowed('https://my-app-git-main-acme.vercel.app', withPreviews)).toBe(true);
    });

    it('does not let a wildcard span a dot', () => {
      expect(isOriginAllowed('https://my-app-x.evil.vercel.app', withPreviews)).toBe(false);
    });

    it('still rejects an unrelated project', () => {
      expect(isOriginAllowed('https://other-app.vercel.app', withPreviews)).toBe(false);
    });
  });

  it('rejects when nothing is configured', () => {
    expect(isOriginAllowed('https://app.example.com', [])).toBe(false);
    expect(isOriginAllowed('https://app.example.com', [''])).toBe(false);
  });
});
