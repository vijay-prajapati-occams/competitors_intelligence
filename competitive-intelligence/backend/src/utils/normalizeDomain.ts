export function normalizeDomain(rawDomain: string): string {
  let domain = rawDomain.trim().toLowerCase();

  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];
  domain = domain.replace(/\.$/, '');

  return domain;
}
