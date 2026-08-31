function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededValue(seed: number, min: number, max: number): number {
  const range = max - min;
  return min + (Math.abs(seed) % (range + 1));
}

export interface CompetitorIntelligenceSummary {
  threatScore: number;
  websiteChanges: number;
  seoMovement: number;
  newsMentions: number;
}

export function getMockIntelligence(competitorId: string): CompetitorIntelligenceSummary {
  const seed = hashSeed(competitorId);

  return {
    threatScore: Number((seededValue(seed, 40, 95) / 10).toFixed(1)),
    websiteChanges: seededValue(seed >>> 2, 2, 24),
    seoMovement: seededValue(seed >>> 4, -15, 15),
    newsMentions: seededValue(seed >>> 6, 0, 18),
  };
}
