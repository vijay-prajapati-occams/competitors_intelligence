import { NewsCategory, NewsSentiment } from '../types';

/**
 * Deterministic keyword rules for Phase 2. No OpenAI/LLM classification yet —
 * ordered by specificity so e.g. "acquires" wins over a looser "expansion" match.
 */
const CATEGORY_KEYWORDS: Array<{ category: NewsCategory; keywords: string[] }> = [
  {
    category: 'acquisition',
    keywords: ['acquisition', 'acquires', 'acquired', 'merger', 'merges', 'buys', 'to buy'],
  },
  {
    category: 'funding',
    keywords: ['funding', 'fundraise', 'raises', 'raised', 'series a', 'series b', 'series c', 'investment', 'venture', 'valuation'],
  },
  {
    category: 'partnership',
    keywords: ['partnership', 'partners with', 'collaboration', 'strategic alliance', 'teams up with'],
  },
  {
    category: 'product_launch',
    keywords: ['launches', 'launch', 'introduces', 'unveils', 'new product', 'new platform', 'new feature', 'rolls out'],
  },
  {
    category: 'leadership',
    keywords: ['appoints', 'appointed', 'chief executive', 'ceo', 'cfo', 'cto', 'cmo', 'president', 'steps down', 'names new'],
  },
  {
    category: 'security',
    keywords: ['breach', 'security incident', 'cyberattack', 'vulnerability', 'hacked', 'data leak'],
  },
  {
    category: 'legal',
    keywords: ['lawsuit', 'sues', 'sued', 'court', 'regulator', 'antitrust', 'litigation', 'settlement'],
  },
  {
    category: 'expansion',
    keywords: ['expands', 'expansion', 'new office', 'new market', 'international expansion', 'opens in'],
  },
  {
    category: 'pricing',
    keywords: ['pricing', 'price increase', 'subscription', 'raises prices', 'new pricing tier'],
  },
  {
    category: 'award',
    keywords: ['award', 'wins award', 'named to', 'recognized as', 'ranked among'],
  },
  {
    category: 'customer_win',
    keywords: ['signs with', 'chooses', 'selects', 'new customer', 'client win'],
  },
  {
    category: 'research',
    keywords: ['study finds', 'survey', 'publishes report', 'research shows', 'whitepaper'],
  },
  {
    category: 'marketing',
    keywords: ['campaign', 'rebrand', 'marketing push', 'ad campaign'],
  },
];

const NEGATIVE_KEYWORDS = [
  'breach',
  'lawsuit',
  'sues',
  'sued',
  'hacked',
  'vulnerability',
  'layoffs',
  'decline',
  'fined',
  'recall',
  'outage',
  'data leak',
  'cyberattack',
];

const POSITIVE_KEYWORDS = [
  'raises',
  'wins',
  'launches',
  'expands',
  'partners with',
  'appoints',
  'award',
  'record',
  'growth',
  'unveils',
  'strong quarter',
];

export function classifyCategory(title: string, description = ''): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();

  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

export function classifySentiment(title: string, description = ''): NewsSentiment {
  const text = `${title} ${description}`.toLowerCase();

  if (NEGATIVE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return 'negative';
  }

  if (POSITIVE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return 'positive';
  }

  return 'neutral';
}

export interface ClassifiedMention {
  category: NewsCategory;
  sentiment: NewsSentiment;
}

export function classifyNewsMention(title: string, description = ''): ClassifiedMention {
  return {
    category: classifyCategory(title, description),
    sentiment: classifySentiment(title, description),
  };
}
