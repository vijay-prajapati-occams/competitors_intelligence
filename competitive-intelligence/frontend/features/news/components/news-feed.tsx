import { NewsCard } from '@/features/news/components/news-card';
import type { NewsMention } from '@/types/news';

interface NewsFeedProps {
  mentions: NewsMention[];
  showCompetitor?: boolean;
  onToggleBookmark: (mention: NewsMention) => void;
  onOpen?: (mention: NewsMention) => void;
}

export function NewsFeed({ mentions, showCompetitor, onToggleBookmark, onOpen }: NewsFeedProps) {
  return (
    <div className="flex flex-col gap-3">
      {mentions.map((mention) => (
        <NewsCard
          key={mention._id}
          mention={mention}
          showCompetitor={showCompetitor}
          onToggleBookmark={onToggleBookmark}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
