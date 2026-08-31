import { Newspaper, RefreshCw } from 'lucide-react';
import { EmptyState } from '@/components/states/empty-state';
import { Button } from '@/components/ui/button';

interface NewsEmptyStateProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function NewsEmptyState({ title, description, onRefresh, isRefreshing }: NewsEmptyStateProps) {
  return (
    <EmptyState
      icon={Newspaper}
      title={title ?? 'No competitor mentions found yet.'}
      description={
        description ?? 'Refresh intelligence to search public news sources for your competitors.'
      }
      action={
        onRefresh ? (
          <Button onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={isRefreshing ? 'animate-spin' : undefined} />
            Refresh Intelligence
          </Button>
        ) : undefined
      }
    />
  );
}
