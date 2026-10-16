import { HeaderHeightContext } from 'expo-router/react-navigation';
import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { router, type Href } from 'expo-router';
import { Button } from 'heroui-native';
import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock } from 'reicon-react-native';

import { createReminder } from '../../api/reminders';
import type { ReminderType } from '../../api/types';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';
import { combineDateAndTime } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';

const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';

const ADVANCE_OPTIONS = [
  { minutes: 0, labelKey: 'addReminder.advanceSameDay' },
  { minutes: 1440, labelKey: 'addReminder.advance1Day' },
  { minutes: 4320, labelKey: 'addReminder.advance3Days' },
  { minutes: 10080, labelKey: 'addReminder.advance7Days' },
] as const;

const REMINDER_TYPES = Object.entries(REMINDER_TYPE_META) as [
  ReminderType,
  (typeof REMINDER_TYPE_META)[ReminderType],
][];

function isAdvancePast(dueAt: Date | null, minutes: number, now: number): boolean {
  return dueAt !== null && dueAt.getTime() - minutes * 60_000 <= now;
}

function effectiveAdvance(dueAt: Date | null, preferred: number, now: number): number {
  return ADVANCE_OPTIONS.filter(
    ({ minutes }) => minutes <= preferred && !isAdvancePast(dueAt, minutes, now),
  ).pop()?.minutes ?? preferred;
}

function initialTime(): Date {
  const time = new Date();
  time.setHours(9, 0, 0, 0);
  return time;
}

function AddReminderContent({ petId }: { petId: string }) {
  const headerHeight = useContext(HeaderHeightContext);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [muted] = useThemeColors(['muted', 'accent-strong']);
  const [type, setType] = useState<ReminderType>('vaccine');
  const [title, setTitle] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState(initialTime);
  const [advanceMinutes, setAdvanceMinutes] = useState(10080);
  const [now, setNow] = useState(Date.now);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError(t('addReminder.titleIsRequired'));
      return;
    }
    if (!date) {
      setFormError(t('addReminder.pickDate'));
      return;
    }

    const dueAt = combineDateAndTime(date, time);
    if (dueAt.getTime() <= Date.now()) {
      setFormError(t('addReminder.dateMustBeFuture'));
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const result = await createReminder(baseUrl, token ?? '', petId, {
        type,
        title: trimmedTitle,
        dueAt: dueAt.toISOString(),
        advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, Date.now()),
      });

      switch (result.kind) {
        case 'ok':
          router.back();
          return;
        case 'forbidden':
          setFormError(t('addReminder.errorForbidden'));
          return;
        case 'invalid':
          setFormError(t('addReminder.dateMustBeFuture'));
          return;
        case 'unreachable':
          setFormError(t('common.cannotReachServer'));
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setFormError(t('common.somethingWentWrong'));
      }
    } catch {
      setFormError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  const pickedDueAt = date ? combineDateAndTime(date, time) : null;
  const selectedAdvance = effectiveAdvance(pickedDueAt, advanceMinutes, now);

  return (
    <KeyboardAvoidingView
      testID="screen-add-reminder"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="add-reminder-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          gap: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Text testID="add-reminder-title" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">
          {t('addReminder.addReminder')}
        </Text>
        <View className="gap-2">
          <Text className="text-sm font-extrabold text-foreground">
            {t('addReminder.type')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {REMINDER_TYPES.map(([reminderType, meta]) => {
              const selected = type === reminderType;
              const slot = CATEGORY_SLOTS[meta.category];

              return (
                <Pressable
                  key={reminderType}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`type-chip-${reminderType}`}
                  hitSlop={TOUCH_SLOP}
                  className={
                    selected
                      ? SELECTED_CHIP
                      : `h-9.5 items-center justify-center rounded-full px-3.5 ${slot.surface}`
                  }
                  onPress={() => setType(reminderType)}
                >
                  <Text className={`text-sm font-extrabold ${selected ? 'text-accent-foreground' : meta.category === 'neutral' ? 'text-foreground' : slot.ink}`}>
                    {t(meta.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-1.5">
          <Text className="text-sm font-extrabold text-foreground">
            {t('addReminder.title')}
          </Text>
          <TextInput
            testID="title-input"
            className={`h-13 rounded-xl bg-default px-3.5 text-base font-semibold text-foreground border-2 ${titleFocused ? 'border-accent' : 'border-transparent'}`}
            style={CONTINUOUS_CORNER}
            maxLength={120}
            placeholder={t('addReminder.reminderTitle')}
            placeholderTextColor={muted}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
          />
        </View>

        <View className="flex-row gap-2.5">
          <View className="flex-3 gap-1.5">
            <Text className="text-sm font-extrabold text-foreground">
              {t('addReminder.date')}
            </Text>
            <Pressable
              accessibilityRole="button"
              testID="date-field"
              className="h-13 flex-row items-center gap-2 rounded-xl bg-default px-3.5"
              style={CONTINUOUS_CORNER}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={18} color={muted} />
              <Text className={`text-base font-semibold ${date ? 'text-foreground' : 'text-muted'}`}>
                {date
                  ? date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
                  : t('addReminder.selectDate')}
              </Text>
            </Pressable>
          </View>
          <View className="flex-2 gap-1.5">
            <Text className="text-sm font-extrabold text-foreground">
              {t('addReminder.time')}
            </Text>
            <Pressable
              accessibilityRole="button"
              testID="time-field"
              className="h-13 flex-row items-center gap-2 rounded-xl bg-default px-3.5"
              style={CONTINUOUS_CORNER}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={18} color={muted} />
              <Text className="text-base font-semibold text-foreground">
                {time.toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                })}
              </Text>
            </Pressable>
          </View>
        </View>

        {showDatePicker ? (
          <Host>
            <ExpoDateTimePicker
              testID="date-picker"
              mode="date"
              minimumDate={new Date()}
              presentation="dialog"
              value={toPickerValue(date ?? new Date())}
              onDismiss={() => setShowDatePicker(false)}
              onValueChange={(_event, selectedDate) => {
                setDate(fromPickerValue(selectedDate));
                setNow(Date.now());
                setShowDatePicker(false);
              }}
            />
          </Host>
        ) : null}

        {showTimePicker ? (
          <Host>
            <ExpoDateTimePicker
              testID="time-picker"
              mode="time"
              presentation="dialog"
              value={time}
              onDismiss={() => setShowTimePicker(false)}
              onValueChange={(_event, selectedTime) => {
                setTime(selectedTime);
                setNow(Date.now());
                setShowTimePicker(false);
              }}
            />
          </Host>
        ) : null}

        <View className="gap-2">
          <Text className="text-sm font-extrabold text-foreground">
            {t('addReminder.alert')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {ADVANCE_OPTIONS.map((option) => {
              const selected = selectedAdvance === option.minutes;
              const disabled = isAdvancePast(pickedDueAt, option.minutes, now);

              return (
                <Pressable
                  key={option.minutes}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`advance-chip-${option.minutes}`}
                  hitSlop={TOUCH_SLOP}
                  disabled={disabled}
                  className={`${selected ? 'rounded-full border border-accent bg-accent-soft px-3 py-2' : 'rounded-full border border-border bg-default px-3 py-2'}${disabled ? ' opacity-50' : ''}`}
                  onPress={() => setAdvanceMinutes(option.minutes)}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button
          testID="add-reminder-submit"
          className="rounded-xl bg-accent border-b-4 border-black/25"
          isDisabled={submitting}
          onPress={() => void handleSubmit()}
        >
          <Button.Label className="font-bold text-accent-foreground">
            {t('addReminder.saveReminder')}
          </Button.Label>
        </Button>

        {formError ? (
          <Text testID="add-reminder-error" className="text-danger">
            {formError}
          </Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function AddReminderScreen() {
  const { selectedPetId } = useSelectedPet();

  useEffect(() => {
    if (selectedPetId === null) router.dismissTo('/reminders' as Href);
  }, [selectedPetId]);

  if (selectedPetId === null) return null;
  return <AddReminderContent petId={selectedPetId} />;
}
