import { SourceReliability } from '../types';

export interface RelevanceInput {
  title: string;
  description?: string;
  competitorName: string;
  competitorDomain: string;
}

/**
 * Rejects obviously-unrelated search results before they're ever stored.
 * Deterministic for Phase 2 — no embeddings/LLM relevance scoring yet.
 */
export function calculateMentionRelevance({
  title,
  description = '',
  competitorName,
  competitorDomain,
}: RelevanceInput): number {
  const haystack = `${title} ${description}`.toLowerCase();
  const name = competitorName.trim().toLowerCase();
  const domain = competitorDomain.trim().toLowerCase();
  const domainRoot = domain.split('.')[0];

  let score = 0;

  if (name && haystack.includes(name)) {
    score += 60;
  }

  if (domain && (haystack.includes(domain) || (domainRoot.length > 2 && haystack.includes(domainRoot)))) {
    score += 30;
  }

  if (name && title.toLowerCase().includes(name)) {
    score += 10;
  }

  return Math.min(100, score);
}

export interface ConfidenceInput {
  relevanceScore: number;
  sourceReliability: SourceReliability;
  hasSourceName: boolean;
  hasPublishedAt: boolean;
}

/**
 * "Data Confidence" — a transparency signal about how complete/trustworthy
 * the metadata is, not an AI-generated confidence score.
 */
export function calculateMentionConfidence({
  relevanceScore,
  sourceReliability,
  hasSourceName,
  hasPublishedAt,
}: ConfidenceInput): number {
  let score = 0;

  if (relevanceScore >= 90) score += 40;
  else if (relevanceScore >= 60) score += 25;
  else score += 10;

  if (sourceReliability === 'high') score += 30;
  else if (sourceReliability === 'medium') score += 15;

  if (hasSourceName) score += 15;
  if (hasPublishedAt) score += 15;

  return Math.min(100, score);
}
