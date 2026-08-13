import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';

export interface ReminderResponse {
  id: string;
  petId: string;
  type: Reminder['type'];
  title: string;
  dueAt: string;
  advanceMinutes: number;
  status: Reminder['status'];
}

export function toReminderResponse(reminder: Reminder): ReminderResponse {
  return {
    id: reminder.id,
    petId: reminder.petId,
    type: reminder.type,
    title: reminder.title,
    dueAt: reminder.dueAt.toISOString(),
    advanceMinutes: reminder.advanceMinutes,
    status: reminder.status,
  };
}
