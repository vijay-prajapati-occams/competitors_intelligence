'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U';
}

export function SidebarUser({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-border px-3 py-3',
        collapsed && 'justify-center px-2'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
          {getInitials(user.firstName, user.lastName)}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate text-xs capitalize text-muted-foreground">{user.role}</span>
        </div>
      )}
    </div>
  );
}
