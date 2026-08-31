'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Pencil, Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Competitor } from '@/types/competitor';

interface CompetitorActionsMenuProps {
  competitor: Competitor;
  onTogglePause: (competitor: Competitor) => void;
  onDelete: (competitor: Competitor) => void;
}

export function CompetitorActionsMenu({ competitor, onTogglePause, onDelete }: CompetitorActionsMenuProps) {
  const router = useRouter();
  const isActive = competitor.status === 'active';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/competitors/${competitor._id}`)}>
          <Eye />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/dashboard/competitors/${competitor._id}/edit`)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTogglePause(competitor)}>
          {isActive ? <Pause /> : <Play />}
          {isActive ? 'Pause' : 'Resume'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(competitor)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
