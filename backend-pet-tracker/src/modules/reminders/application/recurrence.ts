import type { ReminderRecurrence } from '@/modules/reminders/domain/entities/reminder.entity';
import { InvalidRecurrenceError } from '@/modules/reminders/domain/errors/reminder.errors';
import { addCalendarMonths } from '@/modules/health/application/vaccine-date';
import { localDayOf, shiftDay, sameLocalTimeOn } from '@/pipeline/local-day';

export function assertValidRecurrence(
  dueAt: Date,
  recurrence: Pick<ReminderRecurrence, 'unit' | 'every'> | null,
  until: string | null,
  timeZone: string,
): void {
  if (
    until !== null &&
    (recurrence === null || until < localDayOf(dueAt.getTime(), timeZone))
  ) {
    throw new InvalidRecurrenceError();
  }
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
  const { unit, every, anchorAt, until } = reminder.recurrence;
  const anchor = anchorAt.getTime();
  const day = localDayOf(anchor, timeZone);
  // ponytail: ~3650 daily steps in ten years or 8760 hourly per year; skip k by division if long outages become common.
  for (let k = 1; ; k++) {
    let occurrence: number;
    if (unit === 'hour') {
      occurrence = anchor + k * every * 3_600_000;
    } else {
      const targetDay =
        unit === 'day' || unit === 'week'
          ? shiftDay(day, k * every * (unit === 'week' ? 7 : 1))
          : addCalendarMonths(day, k * every * (unit === 'year' ? 12 : 1));
      occurrence = sameLocalTimeOn(anchor, targetDay, timeZone);
    }
    if (
      occurrence <= reminder.dueAt.getTime() ||
      occurrence - reminder.advanceMinutes * 60_000 <= now.getTime()
    )
      continue;
    return until !== null && localDayOf(occurrence, timeZone) > until
      ? null
      : new Date(occurrence);
  }
}
