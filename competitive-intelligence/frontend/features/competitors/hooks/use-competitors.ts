'use client';

import { useCallback, useEffect, useState } from 'react';
import * as competitorService from '@/services/competitor.service';
import { ApiError } from '@/services/api';
import type { Competitor, CompetitorFilters } from '@/types/competitor';

interface UseCompetitorsResult {
  competitors: Competitor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCompetitors(filters: CompetitorFilters): UseCompetitorsResult {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state for the new request before it resolves
    setIsLoading(true);
    setError(null);

    competitorService
      .getCompetitors(filters)
      .then((data) => {
        if (isMounted) setCompetitors(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Failed to load competitors');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.search, refetchIndex]);

  return { competitors, isLoading, error, refetch };
}
