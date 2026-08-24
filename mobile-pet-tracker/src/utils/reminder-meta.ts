import type { ReminderType } from '../api/types';

export const REMINDER_TYPE_META: Record<
  ReminderType,
  { label: string; emoji: string }
> = {
  vaccine: { label: 'Vaccine', emoji: '💉' },
  deworming: { label: 'Deworming', emoji: '🪱' },
  medication: { label: 'Medication', emoji: '💊' },
  appointment: { label: 'Appointment', emoji: '🩺' },
  weight: { label: 'Weight', emoji: '⚖️' },
  food: { label: 'Food', emoji: '🍖' },
  custom: { label: 'Other', emoji: '📌' },
};
