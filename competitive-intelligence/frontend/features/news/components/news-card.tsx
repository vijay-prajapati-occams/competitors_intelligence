'use client';

import Link from 'next/link';
import { Bookmark, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NewsCategoryBadge } from '@/features/news/components/news-category-badge';
import { SentimentBadge } from '@/features/news/components/sentiment-badge';
import { NewsSourceMeta } from '@/features/news/components/news-source-meta';
import type { NewsMention } from '@/types/news';

function competitorInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface NewsCardProps {
  mention: NewsMention;
  showCompetitor?: boolean;
  onToggleBookmark: (mention: NewsMention) => void;
  onOpen?: (mention: NewsMention) => void;
}

export function NewsCard({ mention, showCompetitor = true, onToggleBookmark, onOpen }: NewsCardProps) {
  const competitor = typeof mention.competitorId === 'object' ? mention.competitorId : null;

  return (
    <Card className={cn(!mention.isRead && 'border-l-2 border-l-primary')}>
      <CardContent className="flex gap-3 py-1">
        {showCompetitor && (
          <Avatar className="mt-0.5 h-8 w-8 shrink-0">
            <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
              {competitor ? competitorInitials(competitor.name) : '—'}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {showCompetitor && competitor && (
                <span className="text-sm font-semibold text-foreground">{competitor.name}</span>
              )}
              <NewsCategoryBadge category={mention.category} />
            </div>
            <div className="flex items-center gap-1">
              <SentimentBadge sentiment={mention.sentiment} />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={mention.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                onClick={() => onToggleBookmark(mention)}
              >
                <Bookmark className={cn('h-4 w-4', mention.isBookmarked && 'fill-primary text-primary')} />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Open source" nativeButton={false} render={
                <a href={mention.sourceUrl} target="_blank" rel="noopener noreferrer" />
              }>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Link
            href={`/dashboard/news/${mention._id}`}
            onClick={() => onOpen?.(mention)}
            className={cn(
              'text-sm hover:underline',
              mention.isRead ? 'font-medium text-foreground' : 'font-semibold text-foreground'
            )}
          >
            {mention.title}
          </Link>

          {mention.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{mention.description}</p>
          )}

          <NewsSourceMeta mention={mention} className="text-xs text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
