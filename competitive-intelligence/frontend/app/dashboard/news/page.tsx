'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ErrorState } from '@/components/states/error-state';
import { useNewsFeed } from '@/features/news/hooks/use-news-feed';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePageTitle } from '@/hooks/use-page-title';
import { NewsSummaryCards } from '@/features/news/components/news-summary-cards';
import {
  NewsFilterBar,
  DEFAULT_NEWS_FILTER_VALUE,
  type NewsFilterValue,
} from '@/features/news/components/news-filter-bar';
import { NewsFeed } from '@/features/news/components/news-feed';
import { NewsLoadingSkeleton } from '@/features/news/components/news-loading-skeleton';
import { NewsEmptyState } from '@/features/news/components/news-empty-state';
import { NewsPagination } from '@/features/news/components/news-pagination';
import { RefreshNewsButton } from '@/features/news/components/refresh-news-button';
import * as competitorService from '@/services/competitor.service';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';
import type { Competitor } from '@/types/competitor';
import type { NewsMention } from '@/types/news';

export default function NewsPage() {
  return (
    <Suspense fallback={<NewsLoadingSkeleton rows={5} />}>
      <NewsPageContent />
    </Suspense>
  );
}

function NewsPageContent() {
  usePageTitle('News & Mentions');

  const searchParams = useSearchParams();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [filterValue, setFilterValue] = useState<NewsFilterValue>(() => ({
    ...DEFAULT_NEWS_FILTER_VALUE,
    competitorId: searchParams.get('competitorId') ?? undefined,
  }));
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
  const [isCollectingFromEmptyState, setIsCollectingFromEmptyState] = useState(false);

  const debouncedSearch = useDebouncedValue(filterValue.search, 300);

  useEffect(() => {
    competitorService
      .getCompetitors()
      .then(setCompetitors)
      .catch(() => {
        /* Filter dropdown degrades to "no competitors" — not fatal for the feed itself. */
      });
  }, []);

  const { data, isLoading, error, refetch } = useNewsFeed({
    page,
    limit,
    search: debouncedSearch || undefined,
    category: filterValue.category,
    sentiment: filterValue.sentiment,
    source: filterValue.source || undefined,
    from: filterValue.from ? new Date(filterValue.from).toISOString() : undefined,
    to: filterValue.to ? new Date(filterValue.to).toISOString() : undefined,
    isRead: filterValue.isRead,
    sort: filterValue.sort,
    competitorId: filterValue.competitorId,
  });

  function handleFilterChange(patch: Partial<NewsFilterValue>) {
    setFilterValue((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  function handleClear() {
    setFilterValue(DEFAULT_NEWS_FILTER_VALUE);
    setPage(1);
  }

  function handleCollected() {
    refetch();
    setSummaryRefreshKey((key) => key + 1);
  }

  async function handleCollectFromEmptyState() {
    if (!filterValue.competitorId) return;
    setIsCollectingFromEmptyState(true);
    try {
      const summary = await newsService.collectCompetitorNews(filterValue.competitorId);
      toast.success(`${summary.newMentions} new mention${summary.newMentions === 1 ? '' : 's'} found.`);
      handleCollected();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Unable to collect competitor news. Check the news provider configuration or try again.'
      );
    } finally {
      setIsCollectingFromEmptyState(false);
    }
  }

  async function handleToggleBookmark(mention: NewsMention) {
    try {
      await newsService.bookmarkMention(mention._id, !mention.isBookmarked);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update bookmark');
    }
  }

  function handleOpenMention(mention: NewsMention) {
    if (!mention.isRead) {
      newsService.markAsRead(mention._id).catch(() => {});
    }
  }

  const items = data?.items ?? [];
  const isEmpty = !isLoading && !error && items.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Track public news, announcements, launches, partnerships, funding events, and other important
          competitor activity.
        </p>

        {filterValue.competitorId ? (
          <RefreshNewsButton competitorId={filterValue.competitorId} onCollected={handleCollected} />
        ) : (
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <Button variant="outline" disabled>
                <RefreshCw />
                Refresh Intelligence
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select a competitor to refresh its news</TooltipContent>
          </Tooltip>
        )}
      </div>

      <NewsSummaryCards competitorId={filterValue.competitorId} refreshKey={summaryRefreshKey} />

      <NewsFilterBar
        value={filterValue}
        onChange={handleFilterChange}
        onClear={handleClear}
        competitors={competitors}
      />

      {isLoading && <NewsLoadingSkeleton rows={5} />}

      {!isLoading && error && <ErrorState message="Unable to load news intelligence." onRetry={refetch} />}

      {!isLoading && !error && isEmpty && (
        <NewsEmptyState
          onRefresh={filterValue.competitorId ? handleCollectFromEmptyState : undefined}
          isRefreshing={isCollectingFromEmptyState}
        />
      )}

      {!isLoading && !error && items.length > 0 && (
        <>
          <NewsFeed mentions={items} onToggleBookmark={handleToggleBookmark} onOpen={handleOpenMention} />
          {data && (
            <NewsPagination
              pagination={data.pagination}
              onPageChange={setPage}
              onLimitChange={(next) => {
                setLimit(next);
                setPage(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
