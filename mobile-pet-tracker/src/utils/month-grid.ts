export function monthOf(day: string): string {
  return day.slice(0, 7);
}

export function shiftMonth(month: string, delta: number): string {
  const [year, number] = month.split('-').map(Number);
  return new Date(Date.UTC(year, number - 1 + delta, 1)).toISOString().slice(0, 7);
}

export function monthRange(month: string): { from: string; to: string } {
  const [year, number] = month.split('-').map(Number);
  const days = new Date(Date.UTC(year, number, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${days}` };
}

export function monthGrid(month: string): Array<string | null> {
  const [year, number] = month.split('-').map(Number);
  const leading = (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7;
  const days = Number(monthRange(month).to.slice(8));
  const length = Math.max(35, Math.ceil((leading + days) / 7) * 7);
  return Array.from({ length }, (_, index) => {
    const day = index - leading + 1;
    return day >= 1 && day <= days ? `${month}-${String(day).padStart(2, '0')}` : null;
  });
}

export function weekdayHeaders(locale: string): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    new Date(Date.UTC(2024, 0, 1 + index)).toLocaleDateString(locale, {
      weekday: 'short', timeZone: 'UTC',
    }),
  );
}

export function monthTitle(month: string, locale: string): string {
  const [year, number] = month.split('-').map(Number);
  return new Date(Date.UTC(year, number - 1, 1)).toLocaleDateString(locale, {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export function longDayLabel(day: string, locale: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date)).toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  });

export function currentMonth(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
