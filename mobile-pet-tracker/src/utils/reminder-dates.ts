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
    Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) -
    Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  ) / DAY_MS;
}
