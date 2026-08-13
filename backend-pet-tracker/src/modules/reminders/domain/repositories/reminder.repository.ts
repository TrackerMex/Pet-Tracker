import {
  Reminder,
  ReminderProps,
} from '@/modules/reminders/domain/entities/reminder.entity';

export const REMINDER_REPOSITORY = Symbol('ReminderRepository');

export type NewReminder = Omit<ReminderProps, 'id'>;
export type ReminderChanges = Partial<
  Pick<ReminderProps, 'dueAt' | 'advanceMinutes' | 'title'>
>;

export interface ReminderRepository {
  create(data: NewReminder): Promise<Reminder>;
  findById(id: string): Promise<Reminder | null>;
  reschedule(
    id: string,
    changes: ReminderChanges,
    newScheduleName: string,
  ): Promise<Reminder>;
  cancel(id: string): Promise<Reminder>;
  findDue(now: Date): Promise<Reminder[]>;
  markEnqueued(id: string, at: Date): Promise<void>;
  markSent(id: string): Promise<boolean>;
}
