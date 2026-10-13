export type AlertSection = 'today' | 'week' | 'earlier';

export function alertSection(openedAt: string, now: Date): AlertSection {
  const opened = Date.parse(openedAt);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  if (opened >= startToday.getTime()) return 'today';
  if (opened >= startWeek.getTime()) return 'week';
  return 'earlier';
}
