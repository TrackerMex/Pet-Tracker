import { ReminderType } from '@/modules/reminders/domain/entities/reminder.entity';

export interface CreateReminderDto {
  type: ReminderType;
  title: string;
  dueAt: string;
  advanceMinutes?: number;
}
