'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Building2, Pencil, Pause, Play, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CompetitorTypeBadge } from '@/features/competitors/components/competitor-type-badge';
import { CompetitorStatusBadge } from '@/features/competitors/components/competitor-status-badge';
import { DeleteCompetitorDialog } from '@/features/competitors/components/delete-competitor-dialog';
import * as competitorService from '@/services/competitor.service';
import { ApiError } from '@/services/api';
import type { Competitor } from '@/types/competitor';

interface CompetitorDetailHeaderProps {
  competitor: Competitor;
  onRefetch: () => void;
}

export function CompetitorDetailHeader({ competitor, onRefetch }: CompetitorDetailHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isActive = competitor.status === 'active';

  async function handleTogglePause() {
    const nextStatus = isActive ? 'paused' : 'active';
    try {
      await competitorService.setCompetitorStatus(competitor._id, nextStatus);
      toast.success(`${competitor.name} ${nextStatus === 'paused' ? 'paused' : 'resumed'}`);
      onRefetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update competitor');
    }
  }

  async function handleDelete() {
    try {
      await competitorService.deleteCompetitor(competitor._id);
      toast.success(`${competitor.name} deleted`);
      router.push('/dashboard/competitors');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete competitor');
      throw err;
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold text-foreground">{competitor.name}</h2>
            <a
              href={`https://${competitor.domain}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              {competitor.domain}
            </a>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <CompetitorTypeBadge type={competitor.competitorType} />
              <CompetitorStatusBadge status={competitor.status} />
              {competitor.industry && (
                <span className="text-xs text-muted-foreground">{competitor.industry}</span>
              )}
              {competitor.country && (
                <span className="text-xs text-muted-foreground">· {competitor.country}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <Button variant="outline" disabled>
                <Sparkles />
                Run Analysis
              </Button>
            </TooltipTrigger>
            <TooltipContent>Available in Phase 2</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/dashboard/competitors/${competitor._id}/edit`} />}
          >
            <Pencil />
            Edit
          </Button>

          <Button variant="outline" onClick={handleTogglePause}>
            {isActive ? <Pause /> : <Play />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>

          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <DeleteCompetitorDialog
        competitor={showDeleteDialog ? competitor : null}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}
