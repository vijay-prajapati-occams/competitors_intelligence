'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/nav-items';

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon className={cn('h-4.5 w-4.5 shrink-0', active && 'text-primary')} />
            {!collapsed && (
              <span className="flex flex-1 items-center justify-between gap-2 truncate">
                {item.label}
                {item.comingSoon && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground group-hover:bg-background">
                    Soon
                  </span>
                )}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
