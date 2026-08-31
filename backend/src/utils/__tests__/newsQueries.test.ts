import { describe, expect, it } from 'vitest';
import { buildCompetitorNewsQueries } from '../newsQueries';

describe('buildCompetitorNewsQueries', () => {
  it('generates a bounded, deterministic set of queries', () => {
    const queries = buildCompetitorNewsQueries({ name: 'Acme AI', domain: 'acme.ai' });

    expect(queries).toEqual([
      '"Acme AI"',
      '"Acme AI" funding OR partnership OR acquisition',
      '"Acme AI" launch OR product',
      '"acme.ai"',
    ]);
  });

  it('stays within the 3-5 query MVP budget', () => {
    const queries = buildCompetitorNewsQueries({ name: 'Any Competitor', domain: 'any.com' });
    expect(queries.length).toBeGreaterThanOrEqual(3);
    expect(queries.length).toBeLessThanOrEqual(5);
  });

  it('is deterministic for the same input', () => {
    const input = { name: 'Acme AI', domain: 'acme.ai' };
    expect(buildCompetitorNewsQueries(input)).toEqual(buildCompetitorNewsQueries(input));
  });
});
