import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CompetitorStatus } from '@/types/competitor';

export function CompetitorStatusBadge({ status }: { status: CompetitorStatus }) {
  const isActive = status === 'active';

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-medium',
        isActive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-muted-foreground')} />
      {isActive ? 'Active' : 'Paused'}
    </Badge>
  );
}
