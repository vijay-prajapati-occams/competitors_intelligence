'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CompetitorForm } from '@/features/competitors/components/competitor-form';
import { usePageTitle } from '@/hooks/use-page-title';
import * as competitorService from '@/services/competitor.service';
import type { CompetitorFormSchemaValues } from '@/features/competitors/schemas';

export default function AddCompetitorPage() {
  usePageTitle('Add Competitor');
  const router = useRouter();

  async function handleSubmit(values: CompetitorFormSchemaValues) {
    const competitor = await competitorService.createCompetitor(values);
    toast.success(`${competitor.name} added successfully`);
    router.push(`/dashboard/competitors/${competitor._id}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add a competitor</CardTitle>
          <CardDescription>
            Provide a few details about the competitor you want to start tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompetitorForm
            submitLabel="Add Competitor"
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/competitors')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
