const DAY_MS = 86_400_000;

export function calendarDaysUntil(date: string, now: Date): number {
  const [year, month, day] = date.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const days = Math.round((target - today) / DAY_MS);

  return days === 0 ? 0 : days;
}

export function fmtDate(date: string, locale: string): string {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function fmtMinutes(minutes: number | null): string {
  if (minutes === null) return '—';
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function fmtKm(meters: number | null): string {
  return meters === null ? '—' : `${(meters / 1000).toFixed(1)} km`;
}

export function fmtCount(count: number | null): string {
  return count === null ? '—' : String(count);
}

export function fmtKg(kg: number | null): string {
  return kg === null ? '—' : `${kg} kg`;
}
