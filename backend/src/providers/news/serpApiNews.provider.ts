import { env } from '../../config/env';
import { NewsProvider, NewsSearchResult } from './news.provider.interface';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

interface SerpApiNewsResult {
  title?: string;
  snippet?: string;
  link?: string;
  thumbnail?: string;
  date?: string;
  source?: { name?: string } | string;
  position?: number;
}

interface SerpApiResponse {
  error?: string;
  news_results?: SerpApiNewsResult[];
}

function parsePublishedAt(rawDate: string | undefined): Date | undefined {
  if (!rawDate) return undefined;
  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

class SerpApiNewsProvider implements NewsProvider {
  readonly name = 'serpapi';

  isConfigured(): boolean {
    return Boolean(env.SERPAPI_API_KEY);
  }

  async searchNews(query: string): Promise<NewsSearchResult[]> {
    if (!this.isConfigured()) {
      throw new Error('SERPAPI_NOT_CONFIGURED');
    }

    const url = new URL(SERPAPI_BASE_URL);
    url.searchParams.set('engine', 'google_news');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', env.SERPAPI_API_KEY as string);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`SerpApi request failed with status ${response.status}`);
    }

    const data = (await response.json()) as SerpApiResponse;

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`);
    }

    const results = data.news_results ?? [];

    return results
      .filter((result): result is SerpApiNewsResult & { title: string; link: string } =>
        Boolean(result.title && result.link)
      )
      .map((result) => ({
        title: result.title,
        description: result.snippet,
        sourceName: typeof result.source === 'string' ? result.source : result.source?.name,
        sourceUrl: result.link,
        imageUrl: result.thumbnail,
        publishedAt: parsePublishedAt(result.date),
      }));
  }
}

export const serpApiNewsProvider = new SerpApiNewsProvider();
