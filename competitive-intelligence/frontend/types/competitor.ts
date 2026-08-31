export type CompetitorType = 'direct' | 'indirect' | 'emerging' | 'benchmark';

export type CompetitorStatus = 'active' | 'paused';

export interface Competitor {
  _id: string;
  organizationId: string;
  name: string;
  domain: string;
  logo?: string;
  description?: string;
  industry?: string;
  country?: string;
  competitorType: CompetitorType;
  status: CompetitorStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorFormValues {
  name: string;
  domain: string;
  industry?: string;
  country?: string;
  competitorType: CompetitorType;
  description?: string;
  notes?: string;
}

export interface CompetitorFilters {
  type?: CompetitorType | 'all';
  search?: string;
}
