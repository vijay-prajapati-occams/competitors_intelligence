export type TrendDirection = 'up' | 'down';

export interface KpiCardData {
  label: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
}

export const KPI_CARDS: KpiCardData[] = [
  { label: 'Active Competitors', value: '12', changePercent: 9.1, trend: 'up' },
  { label: 'Important Changes', value: '27', changePercent: 14.3, trend: 'up' },
  { label: 'New Keywords', value: '184', changePercent: 6.2, trend: 'up' },
  { label: 'Lost Keywords', value: '41', changePercent: -3.4, trend: 'down' },
  { label: 'New Backlinks', value: '96', changePercent: 11.7, trend: 'up' },
  { label: 'News Mentions', value: '23', changePercent: -2.1, trend: 'down' },
];

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CompetitorThreatScore {
  name: string;
  score: number;
}

export const THREAT_OVERVIEW = {
  overallScore: 7.8,
  riskLevel: 'High' as RiskLevel,
  competitorScores: [
    { name: 'Competitor A', score: 8.4 },
    { name: 'Competitor B', score: 7.1 },
    { name: 'Competitor C', score: 6.8 },
  ] satisfies CompetitorThreatScore[],
};

export type ActivitySeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ActivityFeedItem {
  id: string;
  competitorName: string;
  eventType: string;
  description: string;
  severity: ActivitySeverity;
  time: string;
}

export const ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: '1',
    competitorName: 'Competitor A',
    eventType: 'Updated pricing page',
    description: 'Enterprise tier price increased by 12% and a new "Business" plan was introduced.',
    severity: 'High',
    time: '2 hours ago',
  },
  {
    id: '2',
    competitorName: 'Competitor B',
    eventType: 'Published new AI service',
    description: 'Launched an AI-powered insights add-on targeting mid-market customers.',
    severity: 'Medium',
    time: '5 hours ago',
  },
  {
    id: '3',
    competitorName: 'Competitor C',
    eventType: 'Added 8 job openings',
    description: 'Opened new roles across sales and engineering, signaling expansion plans.',
    severity: 'Low',
    time: 'Yesterday',
  },
  {
    id: '4',
    competitorName: 'Competitor A',
    eventType: 'Domain migration detected',
    description: 'Marketing site moved to a new domain structure, temporarily affecting rankings.',
    severity: 'Critical',
    time: '2 days ago',
  },
];
