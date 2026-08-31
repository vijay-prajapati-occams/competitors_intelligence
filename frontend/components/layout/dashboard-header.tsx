'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Menu, Search, Bell, Building2, LogOut, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NAV_ITEMS } from '@/lib/nav-items';
import { useAuth } from '@/hooks/use-auth';
import { usePageTitleContext } from '@/hooks/use-page-title';

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U';
}

function useDefaultTitle(pathname: string): string {
  return useMemo(() => {
    const match = [...NAV_ITEMS].sort((a, b) => b.href.length - a.href.length).find((item) => {
      if (item.href === '/dashboard') return pathname === '/dashboard';
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    });
    return match?.label ?? 'Dashboard';
  }, [pathname]);
}

export function DashboardHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { title } = usePageTitleContext();
  const defaultTitle = useDefaultTitle(pathname);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <h1 className="truncate text-base font-semibold text-foreground">{title ?? defaultTitle}</h1>

      <div className="hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted-foreground lg:flex">
        <Building2 className="h-3.5 w-3.5" />
        <span className="max-w-[160px] truncate">{user?.organizationName ?? 'My Organization'}</span>
      </div>

      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search competitors, keywords…" className="pl-8" />
      </div>

      <Button variant="ghost" size="icon-sm" className="ml-auto md:ml-0" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 gap-2 px-1.5" />}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
            {user?.firstName}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <UserRound />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
