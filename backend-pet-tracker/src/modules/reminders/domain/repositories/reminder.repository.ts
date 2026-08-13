import {
  Reminder,
  ReminderProps,
} from '@/modules/reminders/domain/entities/reminder.entity';

export const REMINDER_REPOSITORY = Symbol('ReminderRepository');

export type NewReminder = Omit<ReminderProps, 'id'>;

export interface ReminderRepository {
  create(data: NewReminder): Promise<Reminder>;
}
