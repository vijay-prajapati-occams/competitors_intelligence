import { describe, expect, it } from 'vitest';
import { calculateMentionRelevance, calculateMentionConfidence } from '../newsRelevance';

const competitor = { competitorName: 'Acme AI', competitorDomain: 'acme.ai' };

describe('calculateMentionRelevance', () => {
  it('scores high when the competitor name appears in the title', () => {
    const score = calculateMentionRelevance({
      title: 'Acme AI raises $20M Series A',
      description: 'The funding will go toward R&D.',
      ...competitor,
    });
    expect(score).toBeGreaterThanOrEqual(60);
  });

  it('scores higher still when both name and domain appear', () => {
    const score = calculateMentionRelevance({
      title: 'Acme AI (acme.ai) raises $20M Series A',
      description: '',
      ...competitor,
    });
    expect(score).toBe(100);
  });

  it('scores zero for an unrelated result', () => {
    const score = calculateMentionRelevance({
      title: 'Completely unrelated company announces earnings',
      description: 'No mention of the tracked competitor at all.',
      ...competitor,
    });
    expect(score).toBe(0);
  });

  it('is usable to reject results below the configured threshold', () => {
    const MIN_RELEVANCE_SCORE = 60;
    const score = calculateMentionRelevance({
      title: 'Roundup: five startups to watch this quarter',
      description: 'A broad industry roundup with no reference to the tracked competitor.',
      ...competitor,
    });
    expect(score).toBeLessThan(MIN_RELEVANCE_SCORE);
  });
});

describe('calculateMentionConfidence', () => {
  it('is highest for a high-relevance, high-reliability, complete record', () => {
    const score = calculateMentionConfidence({
      relevanceScore: 100,
      sourceReliability: 'high',
      hasSourceName: true,
      hasPublishedAt: true,
    });
    expect(score).toBe(100);
  });

  it('is lowest for a low-relevance, unknown-reliability, incomplete record', () => {
    const score = calculateMentionConfidence({
      relevanceScore: 10,
      sourceReliability: 'unknown',
      hasSourceName: false,
      hasPublishedAt: false,
    });
    expect(score).toBeLessThan(30);
  });

  it('never exceeds 100', () => {
    const score = calculateMentionConfidence({
      relevanceScore: 100,
      sourceReliability: 'high',
      hasSourceName: true,
      hasPublishedAt: true,
    });
    expect(score).toBeLessThanOrEqual(100);
  });
});
