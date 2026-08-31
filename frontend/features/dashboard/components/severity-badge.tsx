import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ActivitySeverity } from '@/features/dashboard/mock-data';

const SEVERITY_STYLES: Record<ActivitySeverity, string> = {
  Low: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  High: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  Critical: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

export function SeverityBadge({ severity }: { severity: ActivitySeverity }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', SEVERITY_STYLES[severity])}>
      {severity} Priority
    </Badge>
  );
}
