import { Drop, ForkKnife, Pill, PinTack, Stethoscope, Syringe, Weight } from 'reicon-react-native';
import type { ReminderType } from '../api/types';
import type { TranslationKey } from '../i18n/catalog';
import type { CategorySlot } from './category-palette';

export const REMINDER_TYPE_META: Record<
  ReminderType,
  { labelKey: TranslationKey; Icon: typeof Syringe; category: CategorySlot }
> = {
  vaccine: {
    labelKey: 'reminderType.vaccine',
    Icon: Syringe,
    category: 'blue',
  },
  deworming: {
    labelKey: 'reminderType.deworming',
    Icon: Drop,
    category: 'violet',
  },
  medication: {
    labelKey: 'reminderType.medication',
    Icon: Pill,
    category: 'amber',
  },
  appointment: {
    labelKey: 'reminderType.appointment',
    Icon: Stethoscope,
    category: 'green',
  },
  weight: {
    labelKey: 'reminderType.weight',
    Icon: Weight,
    category: 'neutral',
  },
  food: {
    labelKey: 'reminderType.food',
    Icon: ForkKnife,
    category: 'rose',
  },
  custom: {
    labelKey: 'reminderType.other',
    Icon: PinTack,
    category: 'neutral',
  },
};
