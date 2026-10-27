export const REMINDER_TYPES = [
  'vaccine',
  'deworming',
  'medication',
  'appointment',
  'weight',
  'food',
  'custom',
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];
export type ReminderStatus = 'scheduled' | 'sent' | 'cancelled';

export interface ReminderProps {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  dueAt: Date;
  advanceMinutes: number;
  channel: 'push';
  status: ReminderStatus;
  scheduleName: string | null;
  enqueuedAt: Date | null;
  createdBy: string;
  recurrence: ReminderRecurrence | null;
}

export class Reminder implements ReminderProps {
  readonly id: string;
  readonly petId: string;
  readonly type: ReminderType;
  readonly title: string;
  readonly dueAt: Date;
  readonly advanceMinutes: number;
  readonly channel: 'push';
  readonly status: ReminderStatus;
  readonly scheduleName: string | null;
  readonly enqueuedAt: Date | null;
  readonly createdBy: string;
  readonly recurrence: ReminderRecurrence | null;

  constructor(props: ReminderProps) {
    Object.assign(this, props);
  }
}

export const RECURRENCE_UNITS = [
  'hour',
  'day',
  'week',
  'month',
  'year',
] as const;
export type RecurrenceUnit = (typeof RECURRENCE_UNITS)[number];
export interface ReminderRecurrence {
  unit: RecurrenceUnit;
  every: number;
  anchorAt: Date;
  until: string | null;
}
