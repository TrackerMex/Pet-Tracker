import type { Reminder } from '../api/types';

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

export function splitReminders(reminders: Reminder[], now: Date): { upcoming: Reminder[]; past: Reminder[] } {
  const isUpcoming = (reminder: Reminder) => reminder.status !== 'cancelled' && daysUntil(now, new Date(reminder.dueAt)) >= 0;
  return {
    upcoming: reminders.filter(isUpcoming),
    past: reminders.filter((reminder) => !isUpcoming(reminder)),
  };
}
