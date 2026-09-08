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
