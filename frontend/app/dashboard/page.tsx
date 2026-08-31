import { KpiCard } from '@/features/dashboard/components/kpi-card';
import { ThreatOverview } from '@/features/dashboard/components/threat-overview';
import { ActivityFeed } from '@/features/dashboard/components/activity-feed';
import { NewsOverviewWidget } from '@/features/news/components/news-overview-widget';
import { KPI_CARDS } from '@/features/dashboard/mock-data';

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      <ThreatOverview />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <NewsOverviewWidget />
      </div>
    </div>
  );
}
