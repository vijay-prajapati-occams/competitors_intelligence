const UNITS: Array<{ limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86400, divisor: 3600, unit: 'hour' },
  { limit: 604800, divisor: 86400, unit: 'day' },
  { limit: 2629800, divisor: 604800, unit: 'week' },
  { limit: 31557600, divisor: 2629800, unit: 'month' },
  { limit: Infinity, divisor: 31557600, unit: 'year' },
];

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

export function formatTimeAgo(date: string | Date): string {
  const target = new Date(date).getTime();
  if (Number.isNaN(target)) return '';

  const diffSeconds = Math.round((target - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const { divisor, unit } = UNITS.find((entry) => absSeconds < entry.limit) ?? UNITS[UNITS.length - 1];
  return rtf.format(Math.round(diffSeconds / divisor), unit);
}

export function formatExactDate(date: string | Date): string {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
