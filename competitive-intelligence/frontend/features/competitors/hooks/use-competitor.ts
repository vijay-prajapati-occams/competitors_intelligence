'use client';

import { useCallback, useEffect, useState } from 'react';
import * as competitorService from '@/services/competitor.service';
import { ApiError } from '@/services/api';
import type { Competitor } from '@/types/competitor';

interface UseCompetitorResult {
  competitor: Competitor | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCompetitor(id: string): UseCompetitorResult {
  const [competitor, setCompetitor] = useState<Competitor | null>(null);
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
      .getCompetitor(id)
      .then((data) => {
        if (isMounted) setCompetitor(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Failed to load competitor');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, refetchIndex]);

  return { competitor, isLoading, error, refetch };
}
