import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import { env } from '../../config/env';
import { Organization } from '../../models/Organization';
import { Competitor, ICompetitor } from '../../models/Competitor';
import { NewsMention } from '../../models/NewsMention';
import { NewsSearchResult } from '../../providers/news/news.provider.interface';
import { ListNewsQuery } from '../../validators/news.validator';
import * as newsService from '../news.service';

/**
 * Integration tests against a real local MongoDB replica set
 * (competitive-intelligence-test db) — these exercise dedupe, org isolation,
 * and pagination end-to-end through the actual Mongoose models/indexes.
 */

beforeAll(async () => {
  await mongoose.connect(env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Promise.all([Organization.deleteMany({}), Competitor.deleteMany({}), NewsMention.deleteMany({})]);
});

async function createOrg(name: string) {
  return Organization.create({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    createdBy: new Types.ObjectId(),
  });
}

async function createCompetitor(organizationId: Types.ObjectId, name: string, domain: string): Promise<ICompetitor> {
  return Competitor.create({
    organizationId,
    name,
    domain,
    competitorType: 'direct',
    createdBy: new Types.ObjectId(),
  });
}

function fakeResult(overrides: Partial<NewsSearchResult> = {}): NewsSearchResult {
  return {
    title: 'Acme AI raises $20M Series A',
    description: 'Funding round led by a top-tier venture firm.',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2026/01/15/acme-ai-raises-20m/',
    publishedAt: new Date('2026-01-15T10:00:00Z'),
    ...overrides,
  };
}

function defaultQuery(): ListNewsQuery {
  return { page: 1, limit: 20, sort: 'newest' };
}

describe('news.service — deduplication', () => {
  it('skips saving a candidate that already exists for the competitor', async () => {
    const org = await createOrg('Org A');
    const competitor = await createCompetitor(org._id, 'Acme AI', 'acme.ai');
    const candidate = newsService.normalizeMention(fakeResult(), competitor, '"Acme AI"');

    const first = await newsService.saveMentions(org._id, competitor._id as Types.ObjectId, [candidate]);
    expect(first).toEqual({ newMentions: 1, duplicatesSkipped: 0 });

    const second = await newsService.saveMentions(org._id, competitor._id as Types.ObjectId, [candidate]);
    expect(second).toEqual({ newMentions: 0, duplicatesSkipped: 1 });

    const count = await NewsMention.countDocuments({ organizationId: org._id });
    expect(count).toBe(1);
  });

  it('treats tracking-param variants of the same URL as duplicates', async () => {
    const org = await createOrg('Org A');
    const competitor = await createCompetitor(org._id, 'Acme AI', 'acme.ai');

    const first = newsService.normalizeMention(
      fakeResult({ sourceUrl: 'https://www.techcrunch.com/2026/01/15/acme-ai-raises-20m/' }),
      competitor,
      '"Acme AI"'
    );
    const second = newsService.normalizeMention(
      fakeResult({
        sourceUrl: 'https://techcrunch.com/2026/01/15/acme-ai-raises-20m?utm_source=twitter&utm_medium=social',
      }),
      competitor,
      '"Acme AI"'
    );

    await newsService.saveMentions(org._id, competitor._id as Types.ObjectId, [first]);
    const result = await newsService.saveMentions(org._id, competitor._id as Types.ObjectId, [second]);

    expect(result).toEqual({ newMentions: 0, duplicatesSkipped: 1 });
  });

  it('deduplicateMentions collapses duplicates within the same batch', async () => {
    const org = await createOrg('Org A');
    const competitor = await createCompetitor(org._id, 'Acme AI', 'acme.ai');

    const a = newsService.normalizeMention(fakeResult(), competitor, '"Acme AI"');
    const b = newsService.normalizeMention(fakeResult(), competitor, '"Acme AI" funding');

    expect(newsService.deduplicateMentions([a, b])).toHaveLength(1);
  });
});

describe('news.service — organization isolation', () => {
  it('never returns another organization\'s mentions from the global feed', async () => {
    const orgA = await createOrg('Org A');
    const orgB = await createOrg('Org B');
    const competitorA = await createCompetitor(orgA._id, 'Acme AI', 'acme.ai');
    const competitorB = await createCompetitor(orgB._id, 'Beta Corp', 'beta.com');

    await newsService.saveMentions(orgA._id, competitorA._id as Types.ObjectId, [
      newsService.normalizeMention(fakeResult(), competitorA, '"Acme AI"'),
    ]);
    await newsService.saveMentions(orgB._id, competitorB._id as Types.ObjectId, [
      newsService.normalizeMention(
        fakeResult({ title: 'Beta Corp launches new platform', sourceUrl: 'https://example.com/beta' }),
        competitorB,
        '"Beta Corp"'
      ),
    ]);

    const feedA = await newsService.getMentions(orgA._id, defaultQuery());
    expect(feedA.items).toHaveLength(1);
    expect(feedA.items[0].title).toContain('Acme AI');

    const feedB = await newsService.getMentions(orgB._id, defaultQuery());
    expect(feedB.items).toHaveLength(1);
    expect(feedB.items[0].title).toContain('Beta Corp');
  });

  it('404s when requesting competitor-scoped news for a competitor outside the org', async () => {
    const orgA = await createOrg('Org A');
    const orgB = await createOrg('Org B');
    const competitorA = await createCompetitor(orgA._id, 'Acme AI', 'acme.ai');

    await expect(
      newsService.getCompetitorMentions(orgB._id, (competitorA._id as Types.ObjectId).toString(), defaultQuery())
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('news.service — pagination', () => {
  it('paginates the global feed correctly, newest first', async () => {
    const org = await createOrg('Org A');
    const competitor = await createCompetitor(org._id, 'Acme AI', 'acme.ai');

    const candidates = Array.from({ length: 5 }, (_, index) =>
      newsService.normalizeMention(
        fakeResult({
          title: `Acme AI story ${index}`,
          sourceUrl: `https://example.com/story-${index}`,
          publishedAt: new Date(Date.UTC(2026, 0, 10 + index)),
        }),
        competitor,
        '"Acme AI"'
      )
    );
    await newsService.saveMentions(org._id, competitor._id as Types.ObjectId, candidates);

    const page1 = await newsService.getMentions(org._id, { ...defaultQuery(), limit: 2, page: 1 });
    const page2 = await newsService.getMentions(org._id, { ...defaultQuery(), limit: 2, page: 2 });

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page1.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
    expect(page1.items[0].title).toBe('Acme AI story 4');
    expect(page1.items[1].title).toBe('Acme AI story 3');
    expect(page2.items[0].title).toBe('Acme AI story 2');
  });
});
