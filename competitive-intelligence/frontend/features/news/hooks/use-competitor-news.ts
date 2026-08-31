'use client';

import { useCallback, useEffect, useState } from 'react';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';
import type { NewsFilters, PaginatedNews } from '@/types/news';

interface UseCompetitorNewsResult {
  data: PaginatedNews | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCompetitorNews(competitorId: string, filters: NewsFilters = {}): UseCompetitorNewsResult {
  const [data, setData] = useState<PaginatedNews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  useEffect(() => {
    if (!competitorId) return;
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state for the new request before it resolves
    setIsLoading(true);
    setError(null);

    newsService
      .getCompetitorNews(competitorId, filters)
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Unable to load news intelligence.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    competitorId,
    filters.page,
    filters.limit,
    filters.search,
    filters.category,
    filters.sentiment,
    filters.source,
    filters.from,
    filters.to,
    filters.isRead,
    filters.isBookmarked,
    filters.sort,
    refetchIndex,
  ]);

  return { data, isLoading, error, refetch };
}
