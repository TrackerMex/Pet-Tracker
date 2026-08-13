import { z } from 'zod';
import { REMINDER_TYPES } from '@/modules/reminders/domain/entities/reminder.entity';

export const REMINDER_TITLE_MAX_LENGTH = 120;
export const REMINDER_MAX_ADVANCE_MINUTES = 10_080;

const FutureDueAtSchema = z.iso
  .datetime({ offset: true })
  .refine((value) => new Date(value).getTime() > Date.now(), {
    message: 'Due date must be in the future',
  });

export const CreateReminderSchema = z.strictObject({
  type: z.enum(REMINDER_TYPES),
  title: z.string().trim().min(1).max(REMINDER_TITLE_MAX_LENGTH),
  dueAt: FutureDueAtSchema,
  advanceMinutes: z
    .number()
    .int()
    .min(0)
    .max(REMINDER_MAX_ADVANCE_MINUTES)
    .optional(),
});

export type CreateReminderDto = z.infer<typeof CreateReminderSchema>;

export interface UpdateReminderDto {
  dueAt?: string;
  advanceMinutes?: number;
  title?: string;
}
