'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingBlock } from '@/components/states/loading-state';
import { ErrorState } from '@/components/states/error-state';
import { CompetitorForm } from '@/features/competitors/components/competitor-form';
import { useCompetitor } from '@/features/competitors/hooks/use-competitor';
import { usePageTitle } from '@/hooks/use-page-title';
import * as competitorService from '@/services/competitor.service';
import type { CompetitorFormSchemaValues } from '@/features/competitors/schemas';

export default function EditCompetitorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { competitor, isLoading, error, refetch } = useCompetitor(id);

  usePageTitle(competitor ? `Edit ${competitor.name}` : 'Edit Competitor');

  async function handleSubmit(values: CompetitorFormSchemaValues) {
    const updated = await competitorService.updateCompetitor(id, values);
    toast.success(`${updated.name} updated successfully`);
    router.push(`/dashboard/competitors/${updated._id}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {isLoading && <LoadingBlock className="h-96 w-full rounded-xl" />}

      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && competitor && (
        <Card>
          <CardHeader>
            <CardTitle>Edit competitor</CardTitle>
            <CardDescription>Update the details for {competitor.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompetitorForm
              submitLabel="Save changes"
              defaultValues={{
                name: competitor.name,
                domain: competitor.domain,
                industry: competitor.industry ?? '',
                country: competitor.country ?? '',
                competitorType: competitor.competitorType,
                description: competitor.description ?? '',
                notes: competitor.notes ?? '',
              }}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/dashboard/competitors/${competitor._id}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
