export function civilTodayIso(
  timeZone: string | undefined,
  now: Date = new Date(),
): string {
  const { year, month, day } = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );

  if (!year || !month || !day) throw new Error('Missing date part');
  return `${year}-${month}-${day}`;
}
