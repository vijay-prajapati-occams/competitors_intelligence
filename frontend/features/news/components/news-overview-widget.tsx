'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveDataBadge } from '@/features/news/components/live-data-badge';
import { NewsCategoryBadge } from '@/features/news/components/news-category-badge';
import { formatTimeAgo } from '@/lib/format-time-ago';
import { useNewsFeed } from '@/features/news/hooks/use-news-feed';
import { useNewsSummary } from '@/features/news/hooks/use-news-summary';

export function NewsOverviewWidget() {
  const { summary, isLoading: isSummaryLoading } = useNewsSummary();
  const { data, isLoading: isFeedLoading } = useNewsFeed({ page: 1, limit: 3, sort: 'newest' });

  const isLoading = isSummaryLoading || isFeedLoading;
  const latest = data?.items ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle>News Mentions</CardTitle>
          <LiveDataBadge />
        </div>
        <Link href="/dashboard/news" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatBlock label="This week" value={summary?.mentionsThisWeek} isLoading={isLoading} />
          <StatBlock label="Unread" value={summary?.unreadMentions} isLoading={isLoading} />
          <StatBlock label="Total tracked" value={summary?.totalMentions} isLoading={isLoading} />
        </div>

        {!isFeedLoading && latest.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No competitor mentions collected yet. Visit News & Mentions to run your first refresh.
          </p>
        )}

        {latest.length > 0 && (
          <ul className="flex flex-col divide-y divide-border">
            {latest.map((mention) => (
              <li key={mention._id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <NewsCategoryBadge category={mention.category} />
                  {mention.publishedAt && (
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(mention.publishedAt)}</span>
                  )}
                </div>
                <Link href={`/dashboard/news/${mention._id}`} className="text-sm font-medium text-foreground hover:underline">
                  {mention.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function StatBlock({ label, value, isLoading }: { label: string; value?: number; isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {isLoading || value === undefined ? (
        <Skeleton className="h-6 w-10" />
      ) : (
        <span className="text-lg font-semibold text-foreground">{value}</span>
      )}
    </div>
  );
}
