export type NewsCategory =
  | 'funding'
  | 'partnership'
  | 'acquisition'
  | 'product_launch'
  | 'leadership'
  | 'award'
  | 'expansion'
  | 'customer_win'
  | 'legal'
  | 'security'
  | 'pricing'
  | 'marketing'
  | 'research'
  | 'general';

export type NewsSentiment = 'positive' | 'neutral' | 'negative';

export type SourceReliability = 'high' | 'medium' | 'unknown';

export interface NewsMentionCompetitor {
  _id: string;
  name: string;
  domain: string;
  logo?: string;
}

export interface NewsMention {
  _id: string;
  organizationId: string;
  competitorId: string | NewsMentionCompetitor;

  title: string;
  description?: string;
  sourceName?: string;
  sourceDomain: string;
  sourceUrl: string;
  imageUrl?: string;

  publishedAt?: string;
  discoveredAt: string;

  category: NewsCategory;
  sentiment: NewsSentiment;

  searchQuery: string;
  provider: string;

  isRead: boolean;
  isBookmarked: boolean;
  isArchived: boolean;

  metadata: {
    relevanceScore: number;
    confidence: number;
    sourceReliability: SourceReliability;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedNews {
  items: NewsMention[];
  pagination: Pagination;
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: NewsCategory;
  sentiment?: NewsSentiment;
  source?: string;
  from?: string;
  to?: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  sort?: 'newest' | 'oldest';
}

export interface GlobalNewsFilters extends NewsFilters {
  competitorId?: string;
}

export interface NewsCollectionSummary {
  queriesRun: number;
  resultsFound: number;
  newMentions: number;
  duplicatesSkipped: number;
}

export interface UpdateNewsMentionInput {
  isRead?: boolean;
  isBookmarked?: boolean;
  isArchived?: boolean;
  category?: NewsCategory;
}
