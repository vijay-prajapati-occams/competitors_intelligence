import { describe, expect, it } from 'vitest';
import { classifyNewsMention } from '../newsClassification';

describe('classifyNewsMention — category', () => {
  it.each([
    ['Acme AI raises $20M Series A', 'funding'],
    ['Acme AI partners with Microsoft on enterprise automation', 'partnership'],
    ['Global Corp acquires Acme AI for $500M', 'acquisition'],
    ['Acme AI launches new AI platform for support teams', 'product_launch'],
    ['Acme AI appoints new Chief Marketing Officer', 'leadership'],
    ['Acme AI expands into new office in Berlin', 'expansion'],
    ['Regulator sues Acme AI over data practices', 'legal'],
    ['Acme AI discloses security breach affecting customer data', 'security'],
    ['Acme AI increases subscription pricing for enterprise tier', 'pricing'],
  ] as const)('classifies "%s" as %s', (headline, expected) => {
    expect(classifyNewsMention(headline).category).toBe(expected);
  });

  it('falls back to general when nothing matches', () => {
    expect(classifyNewsMention('Acme AI publishes weekly newsletter').category).toBe('general');
  });

  it('is case-insensitive', () => {
    expect(classifyNewsMention('ACME AI RAISES $20M SERIES A').category).toBe('funding');
  });

  it('prefers the more specific acquisition match over expansion-like language', () => {
    expect(classifyNewsMention('Global Corp acquires Acme AI to expand its portfolio').category).toBe(
      'acquisition'
    );
  });
});

describe('classifyNewsMention — sentiment', () => {
  it('flags negative language', () => {
    expect(classifyNewsMention('Acme AI hit by data breach, customers affected').sentiment).toBe('negative');
  });

  it('flags positive language', () => {
    expect(classifyNewsMention('Acme AI raises $20M in record funding round').sentiment).toBe('positive');
  });

  it('defaults to neutral', () => {
    expect(classifyNewsMention('Acme AI publishes quarterly product roadmap').sentiment).toBe('neutral');
  });
});
