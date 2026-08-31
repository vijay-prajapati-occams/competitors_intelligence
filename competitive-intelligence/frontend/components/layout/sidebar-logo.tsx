import Link from 'next/link';
import { Radar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex h-14 items-center gap-2 border-b border-border px-4',
        collapsed && 'justify-center px-2'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Radar className="h-4.5 w-4.5" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">CompetitiveIQ</span>
          <span className="text-[11px] text-muted-foreground">Intelligence Platform</span>
        </div>
      )}
    </Link>
  );
}
