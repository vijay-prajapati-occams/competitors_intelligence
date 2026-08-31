'use client';

import { useCallback, useEffect, useState } from 'react';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';
import type { NewsMention } from '@/types/news';

interface UseNewsMentionResult {
  mention: NewsMention | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setMention: (mention: NewsMention) => void;
}

export function useNewsMention(id: string): UseNewsMentionResult {
  const [mention, setMention] = useState<NewsMention | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state for the new request before it resolves
    setIsLoading(true);
    setError(null);

    newsService
      .getNewsMention(id)
      .then((data) => {
        if (isMounted) setMention(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Unable to load this mention.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, refetchIndex]);

  return { mention, isLoading, error, refetch, setMention };
}
