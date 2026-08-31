import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400',
        className
      )}
    >
      <Sparkle className="h-3 w-3" />
      Demo data
    </span>
  );
}
