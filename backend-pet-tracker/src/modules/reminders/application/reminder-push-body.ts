import { isSupportedTimeZone } from '@/pipeline/local-day';

export function reminderPushBody(
  title: string,
  dueAt: Date,
  timeZone: string | null,
): string {
  const zone =
    timeZone !== null && isSupportedTimeZone(timeZone) ? timeZone : 'UTC';
  const parts = new Intl.DateTimeFormat('es-MX', {
    timeZone: zone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(dueAt);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `Recordatorio: ${title} · ${values.day} de ${values.month} a las ${values.hour}:${values.minute}`;
}
