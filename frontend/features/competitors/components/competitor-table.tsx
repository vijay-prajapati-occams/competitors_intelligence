'use client';

import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CompetitorTypeBadge } from '@/features/competitors/components/competitor-type-badge';
import { CompetitorStatusBadge } from '@/features/competitors/components/competitor-status-badge';
import { CompetitorActionsMenu } from '@/features/competitors/components/competitor-actions-menu';
import type { Competitor } from '@/types/competitor';

interface CompetitorTableProps {
  competitors: Competitor[];
  onTogglePause: (competitor: Competitor) => void;
  onDelete: (competitor: Competitor) => void;
}

export function CompetitorTable({ competitors, onTogglePause, onDelete }: CompetitorTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitors.map((competitor) => (
            <TableRow key={competitor._id}>
              <TableCell className="font-medium text-foreground">
                <Link href={`/dashboard/competitors/${competitor._id}`} className="hover:underline">
                  {competitor.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{competitor.domain}</TableCell>
              <TableCell>
                <CompetitorTypeBadge type={competitor.competitorType} />
              </TableCell>
              <TableCell className="text-muted-foreground">{competitor.industry || '—'}</TableCell>
              <TableCell className="text-muted-foreground">{competitor.country || '—'}</TableCell>
              <TableCell>
                <CompetitorStatusBadge status={competitor.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Date(competitor.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <CompetitorActionsMenu
                  competitor={competitor}
                  onTogglePause={onTogglePause}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
