import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DemoDataBadge } from '@/features/dashboard/components/demo-data-badge';
import { SeverityBadge } from '@/features/dashboard/components/severity-badge';
import { ACTIVITY_FEED } from '@/features/dashboard/mock-data';

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Recent Competitive Activity</CardTitle>
        <DemoDataBadge />
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y divide-border">
          {ACTIVITY_FEED.map((item) => (
            <li key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                  {item.competitorName
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.competitorName}</span>
                    <span className="text-sm text-muted-foreground">{item.eventType}</span>
                  </div>
                  <SeverityBadge severity={item.severity} />
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
