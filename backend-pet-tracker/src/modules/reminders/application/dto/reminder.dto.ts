import { z } from 'zod';
import { isCalendarDate } from '@/pipeline/local-day';
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

export const RecurrenceSchema = z.discriminatedUnion('unit', [
  z.strictObject({
    unit: z.literal('hour'),
    every: z.number().int().min(1).max(24),
  }),
  z.strictObject({
    unit: z.literal('day'),
    every: z.number().int().min(1).max(365),
  }),
  z.strictObject({
    unit: z.literal('week'),
    every: z.number().int().min(1).max(52),
  }),
  z.strictObject({
    unit: z.literal('month'),
    every: z.number().int().min(1).max(12),
  }),
  z.strictObject({
    unit: z.literal('year'),
    every: z.number().int().min(1).max(10),
  }),
]);
export const RecurrenceUntilSchema = z.string().refine(isCalendarDate);

export const CreateReminderSchema = z.strictObject({
  type: z.enum(REMINDER_TYPES),
  title: ReminderTitleSchema,
  dueAt: FutureDueAtSchema,
  advanceMinutes: AdvanceMinutesSchema.optional(),
  recurrence: RecurrenceSchema.nullable().optional(),
  recurrenceUntil: RecurrenceUntilSchema.nullable().optional(),
});

export type CreateReminderDto = z.infer<typeof CreateReminderSchema>;

const CancelReminderSchema = z.strictObject({
  status: z.literal('cancelled'),
});

export const EditReminderSchema = z
  .strictObject({
    dueAt: FutureDueAtSchema.optional(),
    advanceMinutes: AdvanceMinutesSchema.optional(),
    recurrence: RecurrenceSchema.nullable().optional(),
    recurrenceUntil: RecurrenceUntilSchema.nullable().optional(),
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
