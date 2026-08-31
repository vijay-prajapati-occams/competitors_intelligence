import { formatTimeAgo, formatExactDate } from '@/lib/format-time-ago';
import type { NewsMention } from '@/types/news';

export function NewsSourceMeta({ mention, className }: { mention: NewsMention; className?: string }) {
  return (
    <div className={className}>
      <span className="font-medium text-foreground">{mention.sourceName || mention.sourceDomain}</span>
      {mention.publishedAt && (
        <>
          {' · '}
          <span title={formatExactDate(mention.publishedAt)}>{formatTimeAgo(mention.publishedAt)}</span>
        </>
      )}
    </div>
  );
}
