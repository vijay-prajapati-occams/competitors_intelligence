import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DemoDataBadge } from '@/features/dashboard/components/demo-data-badge';
import { THREAT_OVERVIEW } from '@/features/dashboard/mock-data';

const RISK_COLORS: Record<string, string> = {
  Low: 'text-emerald-600 dark:text-emerald-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  High: 'text-orange-600 dark:text-orange-400',
  Critical: 'text-red-600 dark:text-red-400',
};

export function ThreatOverview() {
  const { overallScore, riskLevel, competitorScores } = THREAT_OVERVIEW;
  const maxScore = Math.max(...competitorScores.map((c) => c.score));

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle>Competitive Threat Overview</CardTitle>
          <DemoDataBadge />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall Threat Score</p>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {overallScore.toFixed(1)} <span className="text-base font-normal text-muted-foreground">/ 10</span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk Level</p>
            <p className={cn('flex items-center gap-1.5 text-xl font-semibold', RISK_COLORS[riskLevel])}>
              <AlertTriangle className="h-5 w-5" />
              {riskLevel}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Competitor threat scores
          </p>
          {competitorScores.map((competitor) => (
            <div key={competitor.name} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-sm text-foreground">{competitor.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(competitor.score / maxScore) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-medium text-foreground">
                {competitor.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
