import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { KpiCardData } from '@/features/dashboard/mock-data';

export function KpiCard({ label, value, changePercent, trend }: KpiCardData) {
  const isUp = trend === 'up';

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
              isUp
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(changePercent).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
