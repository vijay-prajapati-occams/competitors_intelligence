import { api } from '@/services/api';
import type {
  GlobalNewsFilters,
  NewsCollectionSummary,
  NewsFilters,
  NewsMention,
  PaginatedNews,
  UpdateNewsMentionInput,
} from '@/types/news';

function buildQuery(filters?: NewsFilters | GlobalNewsFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();

  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.sentiment) params.set('sentiment', filters.sentiment);
  if (filters.source) params.set('source', filters.source);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.isRead !== undefined) params.set('isRead', String(filters.isRead));
  if (filters.isBookmarked !== undefined) params.set('isBookmarked', String(filters.isBookmarked));
  if (filters.sort) params.set('sort', filters.sort);
  if ('competitorId' in filters && filters.competitorId) params.set('competitorId', filters.competitorId);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getNews(filters?: GlobalNewsFilters): Promise<PaginatedNews> {
  return api.get<PaginatedNews>(`/news${buildQuery(filters)}`);
}

export async function getCompetitorNews(competitorId: string, filters?: NewsFilters): Promise<PaginatedNews> {
  return api.get<PaginatedNews>(`/competitors/${competitorId}/news${buildQuery(filters)}`);
}

export async function getNewsMention(id: string): Promise<NewsMention> {
  return api.get<NewsMention>(`/news/${id}`);
}

export async function collectCompetitorNews(competitorId: string): Promise<NewsCollectionSummary> {
  return api.post<NewsCollectionSummary>(`/competitors/${competitorId}/news/collect`);
}

export async function updateNewsMention(id: string, payload: UpdateNewsMentionInput): Promise<NewsMention> {
  return api.patch<NewsMention>(`/news/${id}`, payload);
}

export async function bookmarkMention(id: string, isBookmarked: boolean): Promise<NewsMention> {
  return updateNewsMention(id, { isBookmarked });
}

export async function markAsRead(id: string): Promise<NewsMention> {
  return updateNewsMention(id, { isRead: true });
}

export async function archiveMention(id: string): Promise<NewsMention> {
  return api.patch<NewsMention>(`/news/${id}/archive`);
}
