'use client';

import { useEffect, useState } from 'react';
import * as newsService from '@/services/news.service';
import type { NewsCategory } from '@/types/news';

export interface NewsSummary {
  totalMentions: number;
  mentionsThisWeek: number;
  highValueEvents: number;
  unreadMentions: number;
}

const HIGH_VALUE_CATEGORIES: NewsCategory[] = [
  'funding',
  'acquisition',
  'partnership',
  'product_launch',
  'leadership',
  'expansion',
];

function startOfWeekIso(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  return start.toISOString();
}

interface UseNewsSummaryResult {
  summary: NewsSummary | null;
  isLoading: boolean;
}

/**
 * Rolls the summary cards up from the same paginated /news endpoint (limit=1,
 * only `pagination.total` is read) instead of a dedicated stats endpoint —
 * keeps every number backed by a real query rather than client-side math over
 * a page of results.
 */
export function useNewsSummary(competitorId?: string, refreshKey = 0): UseNewsSummaryResult {
  const [summary, setSummary] = useState<NewsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state for the new request before it resolves
    setIsLoading(true);

    const fetchTotal = (filters: Parameters<typeof newsService.getNews>[0]) =>
      newsService.getNews({ ...filters, competitorId, limit: 1 }).then((result) => result.pagination.total);

    Promise.all([
      fetchTotal({}),
      fetchTotal({ from: startOfWeekIso() }),
      fetchTotal({ isRead: false }),
      Promise.all(HIGH_VALUE_CATEGORIES.map((category) => fetchTotal({ category }))),
    ])
      .then(([totalMentions, mentionsThisWeek, unreadMentions, highValueCounts]) => {
        if (!isMounted) return;
        setSummary({
          totalMentions,
          mentionsThisWeek,
          unreadMentions,
          highValueEvents: highValueCounts.reduce((sum, count) => sum + count, 0),
        });
      })
      .catch(() => {
        if (isMounted) setSummary(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [competitorId, refreshKey]);

  return { summary, isLoading };
}
