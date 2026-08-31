import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NewsSentiment } from '@/types/news';

const SENTIMENT_LABELS: Record<NewsSentiment, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
};

const SENTIMENT_STYLES: Record<NewsSentiment, string> = {
  positive: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  negative: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export function SentimentBadge({ sentiment, className }: { sentiment: NewsSentiment; className?: string }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', SENTIMENT_STYLES[sentiment], className)}>
      {SENTIMENT_LABELS[sentiment]}
    </Badge>
  );
}
