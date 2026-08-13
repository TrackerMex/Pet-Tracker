import { z } from 'zod';
import { REMINDER_TYPES } from '@/modules/reminders/domain/entities/reminder.entity';

export const REMINDER_TITLE_MAX_LENGTH = 120;
export const REMINDER_MAX_ADVANCE_MINUTES = 10_080;

const FutureDueAtSchema = z.iso
  .datetime({ offset: true })
  .refine((value) => new Date(value).getTime() > Date.now(), {
    message: 'Due date must be in the future',
  });

const ReminderTitleSchema = z
  .string()
  .trim()
  .min(1)
  .max(REMINDER_TITLE_MAX_LENGTH);
const AdvanceMinutesSchema = z
  .number()
  .int()
  .min(0)
  .max(REMINDER_MAX_ADVANCE_MINUTES);

export const CreateReminderSchema = z.strictObject({
  type: z.enum(REMINDER_TYPES),
  title: ReminderTitleSchema,
  dueAt: FutureDueAtSchema,
  advanceMinutes: AdvanceMinutesSchema.optional(),
});

export type CreateReminderDto = z.infer<typeof CreateReminderSchema>;

const CancelReminderSchema = z.strictObject({
  status: z.literal('cancelled'),
});

const EditReminderSchema = z
  .strictObject({
    dueAt: FutureDueAtSchema.optional(),
    advanceMinutes: AdvanceMinutesSchema.optional(),
    title: ReminderTitleSchema.optional(),
  })
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: 'At least one field is required',
  });

export const UpdateReminderSchema = z.union([
  CancelReminderSchema,
  EditReminderSchema,
]);

export type UpdateReminderDto = z.infer<typeof UpdateReminderSchema>;
