import type { ReminderType } from '../api/types';
import type { TranslationKey } from '../i18n/catalog';
import type { CategorySlot } from './category-palette';

export const REMINDER_TYPE_META: Record<
  ReminderType,
  { labelKey: TranslationKey; emoji: string; category: CategorySlot }
> = {
  vaccine: {
    labelKey: 'reminderType.vaccine',
    emoji: '💉',
    category: 'blue',
  },
  deworming: {
    labelKey: 'reminderType.deworming',
    emoji: '🪱',
    category: 'violet',
  },
  medication: {
    labelKey: 'reminderType.medication',
    emoji: '💊',
    category: 'amber',
  },
  appointment: {
    labelKey: 'reminderType.appointment',
    emoji: '🩺',
    category: 'green',
  },
  weight: {
    labelKey: 'reminderType.weight',
    emoji: '⚖️',
    category: 'neutral',
  },
  food: {
    labelKey: 'reminderType.food',
    emoji: '🍖',
    category: 'rose',
  },
  custom: {
    labelKey: 'reminderType.other',
    emoji: '📌',
    category: 'neutral',
  },
};
