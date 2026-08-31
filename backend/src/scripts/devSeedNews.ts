/* Manual verification aid only — seeds a few realistic NewsMention docs by
 * running them through the real normalize/classify/relevance pipeline, as if
 * SerpApi had returned them. Not part of the Phase 2 deliverable. */
import mongoose from 'mongoose';
import { env } from '../config/env';
import { Organization } from '../models/Organization';
import { Competitor } from '../models/Competitor';
import { normalizeMention, saveMentions, deduplicateMentions } from '../services/news.service';
import type { NewsSearchResult } from '../providers/news/news.provider.interface';

async function run(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);

  const org = await Organization.findOne({ slug: 'demo-organization' });
  if (!org) throw new Error('Demo organization not found — run `npm run seed` first.');

  const competitors = await Competitor.find({ organizationId: org._id }).sort({ name: 1 });
  if (competitors.length === 0) throw new Error('No competitors found for demo organization.');

  const now = Date.now();
  const day = (n: number) => new Date(now - n * 86_400_000);

  const fixtures: Array<{ competitorIndex: number; result: NewsSearchResult; query: string }> = [
    {
      competitorIndex: 0,
      query: '"Competitor A"',
      result: {
        title: 'Competitor A raises $45M Series B to expand enterprise sales',
        description: 'The round was led by a top-tier venture firm and will fund international expansion.',
        sourceName: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/2026/08/20/competitor-a-raises-45m-series-b/',
        publishedAt: day(2),
      },
    },
    {
      competitorIndex: 0,
      query: '"Competitor A" launch OR product',
      result: {
        title: 'Competitor A launches new AI-powered analytics platform',
        description: 'The new platform targets mid-market customers with automated reporting.',
        sourceName: 'VentureBeat',
        sourceUrl: 'https://venturebeat.com/ai/competitor-a-launches-analytics-platform/',
        publishedAt: day(5),
      },
    },
    {
      competitorIndex: 1,
      query: '"Competitor B" funding OR partnership OR acquisition',
      result: {
        title: 'Competitor B partners with Microsoft on enterprise automation',
        description: 'The partnership expands Competitor B’s reach into regulated industries.',
        sourceName: 'Reuters',
        sourceUrl: 'https://reuters.com/technology/competitor-b-microsoft-partnership/',
        publishedAt: day(1),
      },
    },
    {
      competitorIndex: 1,
      query: '"Competitor B"',
      result: {
        title: 'Competitor B discloses security incident affecting customer data',
        description: 'The company says it has notified affected customers and regulators.',
        sourceName: 'Bloomberg',
        sourceUrl: 'https://bloomberg.com/news/competitor-b-security-incident/',
        publishedAt: day(9),
      },
    },
    {
      competitorIndex: 2,
      query: '"Competitor C" CEO',
      result: {
        title: 'Competitor C appoints new Chief Marketing Officer',
        description: 'The hire signals a renewed push into brand marketing ahead of a product refresh.',
        sourceName: 'Forbes',
        sourceUrl: 'https://forbes.com/sites/competitor-c-appoints-cmo/',
        publishedAt: day(14),
      },
    },
  ];

  let inserted = 0;
  for (const fixture of fixtures) {
    const competitor = competitors[fixture.competitorIndex % competitors.length];
    const candidate = normalizeMention(fixture.result, competitor, fixture.query);
    const unique = deduplicateMentions([candidate]);
    const { newMentions } = await saveMentions(org._id, competitor._id as mongoose.Types.ObjectId, unique);
    inserted += newMentions;
  }

  console.log(`Dev-seeded ${inserted} news mentions across ${competitors.length} competitors.`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
