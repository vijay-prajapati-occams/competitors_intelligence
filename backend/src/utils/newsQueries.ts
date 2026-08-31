export interface CompetitorQueryInput {
  name: string;
  domain: string;
}

/**
 * Deterministic, no-LLM query set. Kept to 4 queries per competitor to bound
 * SerpApi usage (MVP budget: 3-5 queries/competitor).
 */
export function buildCompetitorNewsQueries(competitor: CompetitorQueryInput): string[] {
  const quotedName = `"${competitor.name}"`;

  return [
    quotedName,
    `${quotedName} funding OR partnership OR acquisition`,
    `${quotedName} launch OR product`,
    `"${competitor.domain}"`,
  ];
}
