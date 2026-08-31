export interface NewsSearchResult {
  title: string;
  description?: string;
  sourceName?: string;
  sourceUrl: string;
  imageUrl?: string;
  publishedAt?: Date;
  providerId?: string;
}

/**
 * Replaceable news-search abstraction. Controllers/services must go through
 * this interface, never call a concrete provider (e.g. SerpApi) directly.
 */
export interface NewsProvider {
  readonly name: string;
  isConfigured(): boolean;
  searchNews(query: string): Promise<NewsSearchResult[]>;
}
