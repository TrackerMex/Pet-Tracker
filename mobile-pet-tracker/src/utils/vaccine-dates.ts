import type { Vaccine } from '../api/types';

export function addCalendarMonthsIso(iso: string, months: number): string {
  const date = new Date(`${iso}T00:00:00.000Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export function splitVaccines(vaccines: Vaccine[], today: string): { upcoming: Vaccine[]; past: Vaccine[] } {
  const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
  return {
    upcoming: vaccines.filter(vaccine => vaccine.nextDoseAt !== null && vaccine.nextDoseAt > today)
      .sort((a, b) => compare(a.nextDoseAt!, b.nextDoseAt!) || compare(a.id, b.id)),
    past: vaccines.filter(vaccine => vaccine.nextDoseAt === null || vaccine.nextDoseAt <= today)
      .sort((a, b) => compare(b.nextDoseAt ?? b.appliedAt, a.nextDoseAt ?? a.appliedAt) || compare(a.id, b.id)),
  };
}
