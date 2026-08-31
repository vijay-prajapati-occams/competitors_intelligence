import { api } from '@/services/api';
import { Competitor, CompetitorFilters, CompetitorFormValues, CompetitorStatus } from '@/types/competitor';

function buildQuery(filters?: CompetitorFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.set('type', filters.type);
  if (filters.search) params.set('search', filters.search);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getCompetitors(filters?: CompetitorFilters): Promise<Competitor[]> {
  return api.get<Competitor[]>(`/competitors${buildQuery(filters)}`);
}

export async function getCompetitor(id: string): Promise<Competitor> {
  return api.get<Competitor>(`/competitors/${id}`);
}

export async function createCompetitor(payload: CompetitorFormValues): Promise<Competitor> {
  return api.post<Competitor>('/competitors', payload);
}

export async function updateCompetitor(
  id: string,
  payload: Partial<CompetitorFormValues>
): Promise<Competitor> {
  return api.patch<Competitor>(`/competitors/${id}`, payload);
}

export async function setCompetitorStatus(id: string, status: CompetitorStatus): Promise<Competitor> {
  return api.patch<Competitor>(`/competitors/${id}`, { status });
}

export async function deleteCompetitor(id: string): Promise<void> {
  await api.delete<null>(`/competitors/${id}`);
}
