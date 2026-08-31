'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CompetitorFilters } from '@/types/competitor';

const TYPE_TABS: { value: NonNullable<CompetitorFilters['type']>; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'direct', label: 'Direct' },
  { value: 'indirect', label: 'Indirect' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'benchmark', label: 'Benchmark' },
];

interface CompetitorFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: NonNullable<CompetitorFilters['type']>;
  onTypeChange: (value: NonNullable<CompetitorFilters['type']>) => void;
}

export function CompetitorFiltersBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: CompetitorFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {TYPE_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            size="sm"
            variant={type === tab.value ? 'default' : 'outline'}
            className={cn(type !== tab.value && 'text-muted-foreground')}
            onClick={() => onTypeChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or domain"
          className="pl-8"
        />
      </div>
    </div>
  );
}
