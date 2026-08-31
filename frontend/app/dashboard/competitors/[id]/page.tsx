'use client';

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingBlock } from '@/components/states/loading-state';
import { ErrorState } from '@/components/states/error-state';
import { ComingSoon } from '@/components/layout/coming-soon';
import { useCompetitor } from '@/features/competitors/hooks/use-competitor';
import { CompetitorDetailHeader } from '@/features/competitors/components/competitor-detail-header';
import { CompetitorOverviewTab } from '@/features/competitors/components/competitor-overview-tab';
import { CompetitorNewsTab } from '@/features/competitors/components/competitor-news-tab';
import { COMPETITOR_TABS } from '@/features/competitors/tab-config';
import { usePageTitle } from '@/hooks/use-page-title';

export default function CompetitorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { competitor, isLoading, error, refetch } = useCompetitor(id);

  usePageTitle(competitor?.name ?? 'Competitor Details');

  if (isLoading) {
    return <LoadingBlock className="h-96 w-full rounded-xl" />;
  }

  if (error || !competitor) {
    return <ErrorState message={error ?? 'Competitor not found'} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <CompetitorDetailHeader competitor={competitor} onRefetch={refetch} />

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          {COMPETITOR_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <CompetitorOverviewTab competitor={competitor} />
        </TabsContent>

        <TabsContent value="news">
          <CompetitorNewsTab competitorId={competitor._id} />
        </TabsContent>

        {COMPETITOR_TABS.filter((tab) => tab.value !== 'overview' && tab.value !== 'news').map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ComingSoon title={tab.label} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
