import { Types } from 'mongoose';
import { Competitor, ICompetitor } from '../models/Competitor';
import { AppError } from '../utils/AppError';
import { normalizeDomain } from '../utils/normalizeDomain';
import { CreateCompetitorInput, UpdateCompetitorInput } from '../validators/competitor.validator';

export interface CompetitorListFilters {
  competitorType?: string;
  search?: string;
}

export async function listCompetitors(
  organizationId: Types.ObjectId,
  filters: CompetitorListFilters
): Promise<ICompetitor[]> {
  const query: Record<string, unknown> = { organizationId };

  if (filters.competitorType && filters.competitorType !== 'all') {
    query.competitorType = filters.competitorType;
  }

  if (filters.search) {
    const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    query.$or = [{ name: regex }, { domain: regex }];
  }

  return Competitor.find(query).sort({ createdAt: -1 });
}

export async function createCompetitor(
  organizationId: Types.ObjectId,
  createdBy: Types.ObjectId,
  input: CreateCompetitorInput
): Promise<ICompetitor> {
  const domain = normalizeDomain(input.domain);

  const existing = await Competitor.findOne({ organizationId, domain });
  if (existing) {
    throw new AppError('A competitor with this domain already exists', 409, {
      domain: 'Domain already added',
    });
  }

  return Competitor.create({
    organizationId,
    createdBy,
    name: input.name,
    domain,
    industry: input.industry || undefined,
    country: input.country || undefined,
    competitorType: input.competitorType,
    description: input.description || undefined,
    notes: input.notes || undefined,
  });
}

async function findCompetitorOrThrow(
  organizationId: Types.ObjectId,
  id: string
): Promise<ICompetitor> {
  const competitor = await Competitor.findOne({ _id: id, organizationId });
  if (!competitor) {
    throw new AppError('Competitor not found', 404);
  }
  return competitor;
}

export async function getCompetitorById(organizationId: Types.ObjectId, id: string): Promise<ICompetitor> {
  return findCompetitorOrThrow(organizationId, id);
}

export async function updateCompetitor(
  organizationId: Types.ObjectId,
  id: string,
  input: UpdateCompetitorInput
): Promise<ICompetitor> {
  const competitor = await findCompetitorOrThrow(organizationId, id);

  if (input.domain) {
    const domain = normalizeDomain(input.domain);
    if (domain !== competitor.domain) {
      const existing = await Competitor.findOne({ organizationId, domain, _id: { $ne: competitor._id } });
      if (existing) {
        throw new AppError('A competitor with this domain already exists', 409, {
          domain: 'Domain already added',
        });
      }
      competitor.domain = domain;
    }
  }

  if (input.name !== undefined) competitor.name = input.name;
  if (input.industry !== undefined) competitor.industry = input.industry || undefined;
  if (input.country !== undefined) competitor.country = input.country || undefined;
  if (input.competitorType !== undefined) competitor.competitorType = input.competitorType;
  if (input.description !== undefined) competitor.description = input.description || undefined;
  if (input.notes !== undefined) competitor.notes = input.notes || undefined;
  if (input.status !== undefined) competitor.status = input.status;

  await competitor.save();
  return competitor;
}

export async function setCompetitorStatus(
  organizationId: Types.ObjectId,
  id: string,
  status: 'active' | 'paused'
): Promise<ICompetitor> {
  const competitor = await findCompetitorOrThrow(organizationId, id);
  competitor.status = status;
  await competitor.save();
  return competitor;
}

export async function deleteCompetitor(organizationId: Types.ObjectId, id: string): Promise<void> {
  const competitor = await findCompetitorOrThrow(organizationId, id);
  await competitor.deleteOne();
}
