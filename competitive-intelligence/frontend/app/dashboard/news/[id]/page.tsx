'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Bookmark, ExternalLink, Mail, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingBlock } from '@/components/states/loading-state';
import { ErrorState } from '@/components/states/error-state';
import { NewsCategoryBadge } from '@/features/news/components/news-category-badge';
import { SentimentBadge } from '@/features/news/components/sentiment-badge';
import { formatExactDate, formatTimeAgo } from '@/lib/format-time-ago';
import { useNewsMention } from '@/features/news/hooks/use-news-mention';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';
import { usePageTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';

export default function NewsMentionDetailPage() {
  const params = useParams<{ id: string }>();
  const { mention, isLoading, error, refetch, setMention } = useNewsMention(params.id);

  usePageTitle(mention?.title ?? 'News Mention');

  useEffect(() => {
    if (mention && !mention.isRead) {
      newsService
        .markAsRead(mention._id)
        .then(setMention)
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mention?._id]);

  async function handleToggleBookmark() {
    if (!mention) return;
    try {
      const updated = await newsService.bookmarkMention(mention._id, !mention.isBookmarked);
      setMention(updated);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update bookmark');
    }
  }

  async function handleToggleRead() {
    if (!mention) return;
    try {
      const updated = await newsService.updateNewsMention(mention._id, { isRead: !mention.isRead });
      setMention(updated);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update read status');
    }
  }

  if (isLoading) {
    return <LoadingBlock className="h-96 w-full rounded-xl" />;
  }

  if (error || !mention) {
    return <ErrorState message={error ?? 'News mention not found'} onRetry={refetch} />;
  }

  const competitor = typeof mention.competitorId === 'object' ? mention.competitorId : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/news"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {competitor && <span className="text-sm font-semibold text-foreground">{competitor.name}</span>}
            <NewsCategoryBadge category={mention.category} />
            <SentimentBadge sentiment={mention.sentiment} />
          </div>

          <h1 className="text-xl font-semibold text-foreground">{mention.title}</h1>

          {mention.description && <p className="text-sm text-muted-foreground">{mention.description}</p>}

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>
              Source: <span className="font-medium text-foreground">{mention.sourceName || mention.sourceDomain}</span>
            </span>
            {mention.publishedAt && (
              <span title={formatExactDate(mention.publishedAt)}>
                Published: <span className="font-medium text-foreground">{formatTimeAgo(mention.publishedAt)}</span>
              </span>
            )}
            <span title={formatExactDate(mention.discoveredAt)}>
              Discovered: <span className="font-medium text-foreground">{formatTimeAgo(mention.discoveredAt)}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button nativeButton={false} render={<a href={mention.sourceUrl} target="_blank" rel="noopener noreferrer" />}>
              <ExternalLink />
              Open Original Article
            </Button>
            <Button variant="outline" onClick={handleToggleBookmark}>
              <Bookmark className={cn('h-4 w-4', mention.isBookmarked && 'fill-primary text-primary')} />
              {mention.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button variant="outline" onClick={handleToggleRead}>
              {mention.isRead ? <MailOpen /> : <Mail />}
              {mention.isRead ? 'Mark as unread' : 'Mark as read'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetadataRow label="Category" value={<NewsCategoryBadge category={mention.category} />} />
          <MetadataRow label="Sentiment" value={<SentimentBadge sentiment={mention.sentiment} />} />
          <MetadataRow label="Source Reliability" value={<span className="capitalize">{mention.metadata.sourceReliability}</span>} />
          <MetadataRow label="Data Confidence" value={`${mention.metadata.confidence} / 100`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetadataRow label="Relevance Score" value={`${mention.metadata.relevanceScore} / 100`} />
          <MetadataRow label="Search Query" value={mention.searchQuery} />
          <MetadataRow label="Provider" value={<span className="capitalize">{mention.provider}</span>} />
          <MetadataRow label="Source Domain" value={mention.sourceDomain} />
        </CardContent>
      </Card>
    </div>
  );
}

function MetadataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="text-foreground">{value}</div>
    </div>
  );
}
