import {
  Reminder,
  ReminderProps,
} from '@/modules/reminders/domain/entities/reminder.entity';

export const REMINDER_REPOSITORY = Symbol('ReminderRepository');

export type NewReminder = Omit<ReminderProps, 'id'>;

export interface ReminderRepository {
  create(data: NewReminder): Promise<Reminder>;
  findById(id: string): Promise<Reminder | null>;
  findDue(now: Date): Promise<Reminder[]>;
  markEnqueued(id: string, at: Date): Promise<void>;
  markSent(id: string): Promise<boolean>;
}
