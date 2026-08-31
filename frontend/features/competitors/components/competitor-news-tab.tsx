'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useCompetitorNews } from '@/features/news/hooks/use-competitor-news';
import { NewsFeed } from '@/features/news/components/news-feed';
import { NewsLoadingSkeleton } from '@/features/news/components/news-loading-skeleton';
import { NewsEmptyState } from '@/features/news/components/news-empty-state';
import { ErrorState } from '@/components/states/error-state';
import { RefreshNewsButton } from '@/features/news/components/refresh-news-button';
import { Button } from '@/components/ui/button';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';
import type { NewsMention } from '@/types/news';

export function CompetitorNewsTab({ competitorId }: { competitorId: string }) {
  const { data, isLoading, error, refetch } = useCompetitorNews(competitorId, { limit: 5, sort: 'newest' });

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Recent Mentions</h3>
        <div className="flex items-center gap-2">
          <RefreshNewsButton competitorId={competitorId} onCollected={refetch} />
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/dashboard/news?competitorId=${competitorId}`} />}
          >
            View All News
          </Button>
        </div>
      </div>

      {isLoading && <NewsLoadingSkeleton rows={3} />}

      {!isLoading && error && <ErrorState message="Unable to load news intelligence." onRetry={refetch} />}

      {!isLoading && !error && isEmpty && <NewsEmptyState />}

      {!isLoading && !error && items.length > 0 && (
        <NewsFeed
          mentions={items}
          showCompetitor={false}
          onToggleBookmark={handleToggleBookmark}
          onOpen={handleOpenMention}
        />
      )}
    </div>
  );
}
