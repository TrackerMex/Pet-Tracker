export function reminderPushBody(
  title: string,
  dueAt: Date,
  timeZone: string | null,
): string {
  return `Recordatorio: ${title}`;
}
