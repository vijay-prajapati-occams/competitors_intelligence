import { FilterQuery, Types } from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { NewsMention, INewsMention } from '../models/NewsMention';
import { ApiUsage } from '../models/ApiUsage';
import { Competitor, ICompetitor } from '../models/Competitor';
import { NewsProvider, NewsSearchResult } from '../providers/news/news.provider.interface';
import { serpApiNewsProvider } from '../providers/news/serpApiNews.provider';
import { buildCompetitorNewsQueries } from '../utils/newsQueries';
import { normalizeSourceUrl, buildMentionContentHash } from '../utils/normalizeUrl';
import { calculateMentionRelevance, calculateMentionConfidence } from '../utils/newsRelevance';
import { classifyNewsMention } from '../utils/newsClassification';
import { getSourceReliability } from '../utils/sourceReliability';
import { ListNewsQuery, ListCompetitorNewsQuery, UpdateNewsMentionInput } from '../validators/news.validator';

const newsProvider: NewsProvider = serpApiNewsProvider;

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectionSummary {
  queriesRun: number;
  resultsFound: number;
  newMentions: number;
  duplicatesSkipped: number;
}

interface MentionCandidate {
  organizationId: Types.ObjectId;
  competitorId: Types.ObjectId;
  title: string;
  description?: string;
  sourceName?: string;
  sourceDomain: string;
  sourceUrl: string;
  normalizedUrl: string;
  contentHash: string;
  imageUrl?: string;
  publishedAt?: Date;
  discoveredAt: Date;
  category: ReturnType<typeof classifyNewsMention>['category'];
  sentiment: ReturnType<typeof classifyNewsMention>['sentiment'];
  searchQuery: string;
  provider: string;
  providerId?: string;
  metadata: {
    relevanceScore: number;
    confidence: number;
    sourceReliability: ReturnType<typeof getSourceReliability>;
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findCompetitorOrThrow(organizationId: Types.ObjectId, competitorId: string): Promise<ICompetitor> {
  const competitor = await Competitor.findOne({ _id: competitorId, organizationId });
  if (!competitor) {
    throw new AppError('Competitor not found', 404);
  }
  return competitor;
}

async function findMentionOrThrow(organizationId: Types.ObjectId, id: string): Promise<INewsMention> {
  const mention = await NewsMention.findOne({ _id: id, organizationId });
  if (!mention) {
    throw new AppError('News mention not found', 404);
  }
  return mention;
}

/**
 * Extracted so a race with another request hitting the unique
 * (organizationId, competitorId, normalizedUrl) index fails soft, not 500s.
 */
function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: number }).code === 11000;
}

export function normalizeMention(
  raw: NewsSearchResult,
  competitor: ICompetitor,
  searchQuery: string
): MentionCandidate {
  let sourceDomain: string;
  try {
    sourceDomain = new URL(raw.sourceUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    sourceDomain = (raw.sourceName ?? 'unknown-source').toLowerCase();
  }

  const normalizedUrl = normalizeSourceUrl(raw.sourceUrl);
  const contentHash = buildMentionContentHash(raw.title, sourceDomain, raw.publishedAt);
  const relevanceScore = calculateMentionRelevance({
    title: raw.title,
    description: raw.description,
    competitorName: competitor.name,
    competitorDomain: competitor.domain,
  });
  const sourceReliability = getSourceReliability(sourceDomain);
  const confidence = calculateMentionConfidence({
    relevanceScore,
    sourceReliability,
    hasSourceName: Boolean(raw.sourceName),
    hasPublishedAt: Boolean(raw.publishedAt),
  });
  const { category, sentiment } = classifyMention(raw.title, raw.description);

  return {
    organizationId: competitor.organizationId,
    competitorId: competitor._id as Types.ObjectId,
    title: raw.title,
    description: raw.description,
    sourceName: raw.sourceName,
    sourceDomain,
    sourceUrl: raw.sourceUrl,
    normalizedUrl,
    contentHash,
    imageUrl: raw.imageUrl,
    publishedAt: raw.publishedAt,
    discoveredAt: new Date(),
    category,
    sentiment,
    searchQuery,
    provider: newsProvider.name,
    providerId: raw.providerId,
    metadata: { relevanceScore, confidence, sourceReliability },
  };
}

export function classifyMention(title: string, description?: string): ReturnType<typeof classifyNewsMention> {
  return classifyNewsMention(title, description ?? '');
}

/** In-batch dedupe — collapses duplicates the provider returned across queries. */
export function deduplicateMentions<T extends { normalizedUrl: string; contentHash: string }>(candidates: T[]): T[] {
  const seenUrls = new Set<string>();
  const seenHashes = new Set<string>();
  const unique: T[] = [];

  for (const candidate of candidates) {
    if (seenUrls.has(candidate.normalizedUrl) || seenHashes.has(candidate.contentHash)) {
      continue;
    }
    seenUrls.add(candidate.normalizedUrl);
    seenHashes.add(candidate.contentHash);
    unique.push(candidate);
  }

  return unique;
}

/** Persists candidates, skipping anything already stored for this competitor. */
export async function saveMentions(
  organizationId: Types.ObjectId,
  competitorId: Types.ObjectId,
  candidates: MentionCandidate[]
): Promise<{ newMentions: number; duplicatesSkipped: number }> {
  let newMentions = 0;

  for (const candidate of candidates) {
    const existing = await NewsMention.findOne({
      organizationId,
      competitorId,
      $or: [{ normalizedUrl: candidate.normalizedUrl }, { contentHash: candidate.contentHash }],
    })
      .select('_id')
      .lean();

    if (existing) continue;

    try {
      await NewsMention.create(candidate);
      newMentions++;
    } catch (error) {
      if (isDuplicateKeyError(error)) continue;
      throw error;
    }
  }

  return { newMentions, duplicatesSkipped: candidates.length - newMentions };
}

async function recordApiUsage(organizationId: Types.ObjectId, competitorId: Types.ObjectId, query: string): Promise<void> {
  await ApiUsage.create({
    organizationId,
    provider: newsProvider.name,
    endpoint: 'google_news',
    requests: 1,
    estimatedCost: env.SERPAPI_ESTIMATED_COST_PER_REQUEST ?? null,
    metadata: { competitorId: competitorId.toString(), query },
  });
}

async function assertCollectionNotOnCooldown(organizationId: Types.ObjectId, competitorId: Types.ObjectId): Promise<void> {
  if (env.NEWS_REFRESH_COOLDOWN_MINUTES <= 0) return;

  const cooldownStart = new Date(Date.now() - env.NEWS_REFRESH_COOLDOWN_MINUTES * 60_000);
  const recentUsage = await ApiUsage.findOne({
    organizationId,
    provider: newsProvider.name,
    'metadata.competitorId': competitorId.toString(),
    createdAt: { $gte: cooldownStart },
  })
    .select('_id')
    .lean();

  if (recentUsage) {
    throw new AppError('News was refreshed recently. Please try again later.', 429);
  }
}

export async function searchCompetitorNews(
  competitor: ICompetitor,
  queries: string[]
): Promise<Array<{ raw: NewsSearchResult; searchQuery: string }>> {
  const tagged: Array<{ raw: NewsSearchResult; searchQuery: string }> = [];
  let succeededAtLeastOnce = false;

  for (const query of queries) {
    try {
      const results = await newsProvider.searchNews(query);
      await recordApiUsage(competitor.organizationId, competitor._id as Types.ObjectId, query);
      succeededAtLeastOnce = true;
      for (const raw of results) {
        tagged.push({ raw, searchQuery: query });
      }
    } catch (error) {
      console.error(`News collection query failed ("${query}"):`, error instanceof Error ? error.message : error);
    }
  }

  if (!succeededAtLeastOnce && queries.length > 0) {
    throw new AppError(
      'Unable to collect competitor news. Check the news provider configuration or try again.',
      502
    );
  }

  return tagged;
}

export async function collectCompetitorNews(
  organizationId: Types.ObjectId,
  competitorId: string
): Promise<CollectionSummary> {
  const competitor = await findCompetitorOrThrow(organizationId, competitorId);

  if (!newsProvider.isConfigured()) {
    throw new AppError(
      'News provider is not configured. Set SERPAPI_API_KEY to enable live collection.',
      503
    );
  }

  await assertCollectionNotOnCooldown(organizationId, competitor._id as Types.ObjectId);

  const queries = buildCompetitorNewsQueries({ name: competitor.name, domain: competitor.domain });
  const tagged = await searchCompetitorNews(competitor, queries);

  const candidates = tagged
    .map(({ raw, searchQuery }) => normalizeMention(raw, competitor, searchQuery))
    .filter((candidate) => candidate.metadata.relevanceScore >= env.NEWS_MIN_RELEVANCE_SCORE);

  const uniqueCandidates = deduplicateMentions(candidates);
  const { newMentions } = await saveMentions(organizationId, competitor._id as Types.ObjectId, uniqueCandidates);

  const resultsFound = tagged.length;

  return {
    queriesRun: queries.length,
    resultsFound,
    newMentions,
    duplicatesSkipped: resultsFound - newMentions,
  };
}

interface CommonNewsFilters {
  search?: string;
  category?: string;
  sentiment?: string;
  source?: string;
  from?: Date;
  to?: Date;
  isRead?: boolean;
  isBookmarked?: boolean;
  sort: 'newest' | 'oldest';
  page: number;
  limit: number;
}

function buildFilterQuery(
  base: FilterQuery<INewsMention>,
  filters: CommonNewsFilters
): FilterQuery<INewsMention> {
  const query: FilterQuery<INewsMention> = { ...base };

  if (filters.category) query.category = filters.category;
  if (filters.sentiment) query.sentiment = filters.sentiment;
  if (filters.source) query.sourceName = new RegExp(escapeRegex(filters.source), 'i');
  if (filters.isRead !== undefined) query.isRead = filters.isRead;
  if (filters.isBookmarked !== undefined) query.isBookmarked = filters.isBookmarked;

  if (filters.from || filters.to) {
    query.publishedAt = {
      ...(filters.from ? { $gte: filters.from } : {}),
      ...(filters.to ? { $lte: filters.to } : {}),
    };
  }

  if (filters.search) {
    const regex = new RegExp(escapeRegex(filters.search), 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }

  return query;
}

async function paginateMentions(
  query: FilterQuery<INewsMention>,
  filters: CommonNewsFilters
): Promise<PaginatedResult<INewsMention>> {
  const sortDirection = filters.sort === 'oldest' ? 1 : -1;

  const [items, total] = await Promise.all([
    NewsMention.find(query)
      .sort({ publishedAt: sortDirection, _id: sortDirection })
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .populate('competitorId', 'name domain logo'),
    NewsMention.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getMentions(
  organizationId: Types.ObjectId,
  filters: ListNewsQuery
): Promise<PaginatedResult<INewsMention>> {
  const base: FilterQuery<INewsMention> = { organizationId, isArchived: false };
  if (filters.competitorId) {
    base.competitorId = new Types.ObjectId(filters.competitorId);
  }

  return paginateMentions(buildFilterQuery(base, filters), filters);
}

export async function getCompetitorMentions(
  organizationId: Types.ObjectId,
  competitorId: string,
  filters: ListCompetitorNewsQuery
): Promise<PaginatedResult<INewsMention>> {
  await findCompetitorOrThrow(organizationId, competitorId);

  const base: FilterQuery<INewsMention> = { organizationId, competitorId, isArchived: false };
  return paginateMentions(buildFilterQuery(base, filters), filters);
}

export async function getMentionById(organizationId: Types.ObjectId, id: string): Promise<INewsMention> {
  const mention = await NewsMention.findOne({ _id: id, organizationId }).populate(
    'competitorId',
    'name domain logo'
  );
  if (!mention) {
    throw new AppError('News mention not found', 404);
  }
  return mention;
}

export async function updateMention(
  organizationId: Types.ObjectId,
  id: string,
  input: UpdateNewsMentionInput
): Promise<INewsMention> {
  const mention = await findMentionOrThrow(organizationId, id);

  if (input.isRead !== undefined) mention.isRead = input.isRead;
  if (input.isBookmarked !== undefined) mention.isBookmarked = input.isBookmarked;
  if (input.isArchived !== undefined) mention.isArchived = input.isArchived;
  if (input.category !== undefined) mention.category = input.category;

  await mention.save();
  return mention;
}

export async function archiveMention(organizationId: Types.ObjectId, id: string): Promise<INewsMention> {
  const mention = await findMentionOrThrow(organizationId, id);
  mention.isArchived = true;
  await mention.save();
  return mention;
}
