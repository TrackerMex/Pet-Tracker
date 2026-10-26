import type { ReminderRecurrence } from '@/modules/reminders/domain/entities/reminder.entity';

export function assertValidRecurrence(
  dueAt: Date,
  recurrence: Pick<ReminderRecurrence, 'unit' | 'every'> | null,
  until: string | null,
  timeZone: string,
): void {
  void dueAt;
  void recurrence;
  void until;
  void timeZone;
}

export function nextOccurrence(
  reminder: {
    dueAt: Date;
    advanceMinutes: number;
    recurrence: ReminderRecurrence;
  },
  now: Date,
  timeZone: string,
): Date | null {
  void now;
  void timeZone;
  return reminder.dueAt;
}
