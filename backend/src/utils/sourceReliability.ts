import { SourceReliability } from '../types';

const HIGH_RELIABILITY_DOMAINS = [
  'reuters.com',
  'apnews.com',
  'bloomberg.com',
  'wsj.com',
  'ft.com',
  'nytimes.com',
  'techcrunch.com',
  'forbes.com',
  'cnbc.com',
  'businesswire.com',
  'prnewswire.com',
  'globenewswire.com',
];

const MEDIUM_RELIABILITY_DOMAINS = [
  'venturebeat.com',
  'theverge.com',
  'engadget.com',
  'zdnet.com',
  'businessinsider.com',
  'axios.com',
];

export function getSourceReliability(sourceDomain: string): SourceReliability {
  const domain = sourceDomain.toLowerCase();

  if (HIGH_RELIABILITY_DOMAINS.some((known) => domain === known || domain.endsWith(`.${known}`))) {
    return 'high';
  }

  if (MEDIUM_RELIABILITY_DOMAINS.some((known) => domain === known || domain.endsWith(`.${known}`))) {
    return 'medium';
  }

  return 'unknown';
}
