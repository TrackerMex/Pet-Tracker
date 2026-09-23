const DAY_MS = 86_400_000;

export function combineDateAndTime(date: Date, time: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0,
  );
}

export function daysUntil(from: Date, to: Date): number {
  return (
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()) -
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
  ) / DAY_MS;
}
