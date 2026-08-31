'use client';

import { useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarLogo } from '@/components/layout/sidebar-logo';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { SidebarUser } from '@/components/layout/sidebar-user';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PageTitleProvider } from '@/hooks/use-page-title';

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <PageTitleProvider>
      <div className="flex min-h-screen bg-muted/30">
        <aside
          className={cn(
            'sticky top-0 hidden h-screen flex-col border-r border-border bg-background transition-all duration-200 md:flex',
            collapsed ? 'w-16' : 'w-64'
          )}
        >
          <SidebarLogo collapsed={collapsed} />
          <SidebarNav collapsed={collapsed} />
          <SidebarUser collapsed={collapsed} />
          <div className="flex justify-center border-t border-border py-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarLogo />
            </SheetHeader>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <SidebarUser />
          </SheetContent>
        </Sheet>

        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </PageTitleProvider>
  );
}
