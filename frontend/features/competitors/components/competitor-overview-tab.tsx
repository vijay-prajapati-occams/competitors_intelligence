import { Gauge, Globe2, TrendingUp, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoDataBadge } from '@/features/dashboard/components/demo-data-badge';
import { getMockIntelligence } from '@/features/competitors/mock-intelligence';
import type { Competitor } from '@/types/competitor';

export function CompetitorOverviewTab({ competitor }: { competitor: Competitor }) {
  const intelligence = getMockIntelligence(competitor._id);

  const cards = [
    {
      label: 'Threat Score',
      value: `${intelligence.threatScore.toFixed(1)} / 10`,
      icon: Gauge,
    },
    {
      label: 'Website Changes',
      value: `${intelligence.websiteChanges} this month`,
      icon: Globe2,
    },
    {
      label: 'SEO Movement',
      value: `${intelligence.seoMovement > 0 ? '+' : ''}${intelligence.seoMovement} keywords`,
      icon: TrendingUp,
    },
    {
      label: 'News Mentions',
      value: `${intelligence.newsMentions} this month`,
      icon: Newspaper,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <card.icon className="h-4 w-4 text-muted-foreground" />
                <DemoDataBadge />
              </div>
              <span className="text-lg font-semibold text-foreground">{card.value}</span>
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </span>
              <p className="text-foreground">
                {competitor.description || 'No description added yet.'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </span>
              <p className="text-foreground">{competitor.notes || 'No notes added yet.'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monitoring status</span>
              <span className="font-medium capitalize text-foreground">{competitor.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date added</span>
              <span className="font-medium text-foreground">
                {new Date(competitor.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last updated</span>
              <span className="font-medium text-foreground">
                {new Date(competitor.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
