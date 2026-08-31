'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CATEGORY_LABELS } from '@/features/news/components/news-category-badge';
import type { Competitor } from '@/types/competitor';
import type { NewsCategory, NewsSentiment } from '@/types/news';

export interface NewsFilterValue {
  search: string;
  competitorId?: string;
  category?: NewsCategory;
  sentiment?: NewsSentiment;
  source: string;
  from: string;
  to: string;
  isRead?: boolean;
  sort: 'newest' | 'oldest';
}

export const DEFAULT_NEWS_FILTER_VALUE: NewsFilterValue = {
  search: '',
  source: '',
  from: '',
  to: '',
  sort: 'newest',
};

interface NewsFilterBarProps {
  value: NewsFilterValue;
  onChange: (patch: Partial<NewsFilterValue>) => void;
  onClear: () => void;
  competitors?: Competitor[];
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [NewsCategory, string][];

const SENTIMENT_SELECT_LABELS: Record<string, string> = {
  all: 'All sentiment',
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
};

const READ_STATUS_LABELS: Record<string, string> = {
  all: 'All',
  unread: 'Unread',
  read: 'Read',
};

function FilterFields({ value, onChange, competitors }: Omit<NewsFilterBarProps, 'onClear'>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {competitors && (
        <Select
          value={value.competitorId ?? 'all'}
          onValueChange={(next) => onChange({ competitorId: next === 'all' ? undefined : (next as string) })}
        >
          <SelectTrigger size="sm" className="w-full sm:w-44">
            <SelectValue placeholder="Competitor">
              {(current: string) =>
                current === 'all' || !current
                  ? 'All competitors'
                  : (competitors.find((c) => c._id === current)?.name ?? 'All competitors')
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All competitors</SelectItem>
            {competitors.map((competitor) => (
              <SelectItem key={competitor._id} value={competitor._id}>
                {competitor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={value.category ?? 'all'}
        onValueChange={(next) => onChange({ category: next === 'all' ? undefined : (next as NewsCategory) })}
      >
        <SelectTrigger size="sm" className="w-full sm:w-40">
          <SelectValue placeholder="Category">
            {(current: string) => (current === 'all' || !current ? 'All categories' : CATEGORY_LABELS[current as NewsCategory])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORY_OPTIONS.map(([category, label]) => (
            <SelectItem key={category} value={category}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.sentiment ?? 'all'}
        onValueChange={(next) => onChange({ sentiment: next === 'all' ? undefined : (next as NewsSentiment) })}
      >
        <SelectTrigger size="sm" className="w-full sm:w-32">
          <SelectValue placeholder="Sentiment">
            {(current: string) => SENTIMENT_SELECT_LABELS[current] ?? 'All sentiment'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sentiment</SelectItem>
          <SelectItem value="positive">Positive</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="negative">Negative</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.isRead === undefined ? 'all' : value.isRead ? 'read' : 'unread'}
        onValueChange={(next) =>
          onChange({ isRead: next === 'all' ? undefined : next === 'read' })
        }
      >
        <SelectTrigger size="sm" className="w-full sm:w-32">
          <SelectValue placeholder="Read status">
            {(current: string) => READ_STATUS_LABELS[current] ?? 'All'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value.sort} onValueChange={(next) => onChange({ sort: next as 'newest' | 'oldest' })}>
        <SelectTrigger size="sm" className="w-full sm:w-32">
          <SelectValue placeholder="Sort">{(current: string) => (current === 'oldest' ? 'Oldest' : 'Newest')}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>

      <Input
        value={value.source}
        onChange={(event) => onChange({ source: event.target.value })}
        placeholder="Source"
        className="w-full sm:w-36"
      />

      <div className="flex w-full items-center gap-1.5 sm:w-auto">
        <Input
          type="date"
          value={value.from}
          onChange={(event) => onChange({ from: event.target.value })}
          className="w-full sm:w-36"
          aria-label="From date"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={value.to}
          onChange={(event) => onChange({ to: event.target.value })}
          className="w-full sm:w-36"
          aria-label="To date"
        />
      </div>
    </div>
  );
}

export function NewsFilterBar({ value, onChange, onClear, competitors }: NewsFilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search headlines or descriptions"
            className="pl-8"
          />
        </div>

        <Button variant="outline" className="sm:hidden" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal />
          Filters
        </Button>

        <Button variant="ghost" onClick={onClear} className="hidden sm:inline-flex">
          Clear All
        </Button>
      </div>

      <div className="hidden sm:block">
        <FilterFields value={value} onChange={onChange} competitors={competitors} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4 pt-0">
            <FilterFields value={value} onChange={onChange} competitors={competitors} />
            <Button variant="outline" onClick={onClear}>
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
