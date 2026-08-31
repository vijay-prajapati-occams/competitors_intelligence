'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingRows } from '@/components/states/loading-state';
import { useCompetitors } from '@/features/competitors/hooks/use-competitors';
import { CompetitorFiltersBar } from '@/features/competitors/components/competitor-filters';
import { CompetitorTable } from '@/features/competitors/components/competitor-table';
import { DeleteCompetitorDialog } from '@/features/competitors/components/delete-competitor-dialog';
import * as competitorService from '@/services/competitor.service';
import { ApiError } from '@/services/api';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Competitor, CompetitorFilters } from '@/types/competitor';

export default function CompetitorsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<NonNullable<CompetitorFilters['type']>>('all');
  const [competitorToDelete, setCompetitorToDelete] = useState<Competitor | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const { competitors, isLoading, error, refetch } = useCompetitors({
    type,
    search: debouncedSearch,
  });

  async function handleTogglePause(competitor: Competitor) {
    const nextStatus = competitor.status === 'active' ? 'paused' : 'active';
    try {
      await competitorService.setCompetitorStatus(competitor._id, nextStatus);
      toast.success(`${competitor.name} ${nextStatus === 'paused' ? 'paused' : 'resumed'}`);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update competitor');
    }
  }

  async function handleDelete(competitor: Competitor) {
    try {
      await competitorService.deleteCompetitor(competitor._id);
      toast.success(`${competitor.name} deleted`);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete competitor');
      throw err;
    }
  }

  const isEmpty = !isLoading && !error && competitors.length === 0 && !debouncedSearch && type === 'all';
  const isNoResults = !isLoading && !error && competitors.length === 0 && !isEmpty;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Track and manage the competitors you monitor.</p>
        <Button nativeButton={false} render={<Link href="/dashboard/competitors/add" />}>
          <Plus />
          Add Competitor
        </Button>
      </div>

      <CompetitorFiltersBar search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} />

      {isLoading && <LoadingRows rows={5} />}

      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && isEmpty && (
        <EmptyState
          icon={Users}
          title="No competitors added yet."
          description="Add your first competitor to begin building your competitive intelligence workspace."
          action={
            <Button nativeButton={false} render={<Link href="/dashboard/competitors/add" />}>
              <Plus />
              Add Competitor
            </Button>
          }
        />
      )}

      {!isLoading && !error && isNoResults && (
        <EmptyState
          icon={Users}
          title="No competitors match your filters."
          description="Try a different search term or clear the active filters."
        />
      )}

      {!isLoading && !error && competitors.length > 0 && (
        <CompetitorTable
          competitors={competitors}
          onTogglePause={handleTogglePause}
          onDelete={setCompetitorToDelete}
        />
      )}

      <DeleteCompetitorDialog
        competitor={competitorToDelete}
        onOpenChange={(open) => !open && setCompetitorToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
