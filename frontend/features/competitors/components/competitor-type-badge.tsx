import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CompetitorType } from '@/types/competitor';

const TYPE_LABELS: Record<CompetitorType, string> = {
  direct: 'Direct',
  indirect: 'Indirect',
  emerging: 'Emerging',
  benchmark: 'Benchmark',
};

const TYPE_STYLES: Record<CompetitorType, string> = {
  direct: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  indirect: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  emerging: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  benchmark: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
};

export function CompetitorTypeBadge({ type }: { type: CompetitorType }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', TYPE_STYLES[type])}>
      {TYPE_LABELS[type]}
    </Badge>
  );
}
