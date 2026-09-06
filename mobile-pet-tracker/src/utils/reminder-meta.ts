import type { ReminderType } from '../api/types';
import type { CategorySlot } from './category-palette';

export const REMINDER_TYPE_META: Record<
  ReminderType,
  { label: string; emoji: string; category: CategorySlot }
> = {
  vaccine: { label: 'Vaccine', emoji: '💉', category: 'blue' },
  deworming: { label: 'Deworming', emoji: '🪱', category: 'violet' },
  medication: { label: 'Medication', emoji: '💊', category: 'amber' },
  appointment: { label: 'Appointment', emoji: '🩺', category: 'green' },
  weight: { label: 'Weight', emoji: '⚖️', category: 'neutral' },
  food: { label: 'Food', emoji: '🍖', category: 'rose' },
  custom: { label: 'Other', emoji: '📌', category: 'neutral' },
};
