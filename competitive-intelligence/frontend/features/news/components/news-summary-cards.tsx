'use client';

import { Newspaper, CalendarDays, Flame, MailWarning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsSummary } from '@/features/news/hooks/use-news-summary';

interface NewsSummaryCardsProps {
  competitorId?: string;
  refreshKey?: number;
}

export function NewsSummaryCards({ competitorId, refreshKey = 0 }: NewsSummaryCardsProps) {
  const { summary, isLoading } = useNewsSummary(competitorId, refreshKey);

  const cards = [
    { label: 'Total Mentions', value: summary?.totalMentions, icon: Newspaper },
    { label: 'Mentions This Week', value: summary?.mentionsThisWeek, icon: CalendarDays },
    { label: 'High-Value Events', value: summary?.highValueEvents, icon: Flame },
    { label: 'Unread Mentions', value: summary?.unreadMentions, icon: MailWarning },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex flex-col gap-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            {isLoading || card.value === undefined ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-foreground">{card.value}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
