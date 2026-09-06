import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { Redirect, router, type Href } from 'expo-router';
import { Button } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import { createReminder } from '../../api/reminders';
import type { ReminderType } from '../../api/types';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { combineDateAndTime } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';

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

function initialTime(): Date {
  const time = new Date();
  time.setHours(9, 0, 0, 0);
  return time;
}

function AddReminderContent({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [foreground, muted] = useThemeColors(['foreground', 'muted']);
  const [type, setType] = useState<ReminderType>('vaccine');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState(initialTime);
  const [advanceMinutes, setAdvanceMinutes] = useState(10080);
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
        advanceMinutes,
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

  return (
    <ScrollView
      testID="screen-add-reminder"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={t('addReminder.backToReminders')}
          accessibilityRole="button"
          testID="add-reminder-back"
          hitSlop={TOUCH_SLOP}
          className="size-10 items-center justify-center rounded-full bg-default"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <Text className="text-2xl font-black text-foreground">
          {t('addReminder.addReminder')}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t('addReminder.type')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {REMINDER_TYPES.map(([reminderType, meta]) => {
            const selected = type === reminderType;

            return (
              <Pressable
                key={reminderType}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`type-chip-${reminderType}`}
                hitSlop={TOUCH_SLOP}
                className={
                  selected
                    ? 'rounded-full border border-accent bg-accent-soft px-3 py-2'
                    : 'rounded-full border border-border bg-default px-3 py-2'
                }
                onPress={() => setType(reminderType)}
              >
                <Text className="text-sm font-semibold text-foreground">
                  {`${meta.emoji} ${t(meta.labelKey)}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t('addReminder.title')}
        </Text>
        <TextInput
          testID="title-input"
          className="rounded-xl bg-default px-4 py-3 text-foreground"
          style={CONTINUOUS_CORNER}
          maxLength={120}
          placeholder={t('addReminder.reminderTitle')}
          placeholderTextColor={muted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t('addReminder.date')}
          </Text>
          <Pressable
            accessibilityRole="button"
            testID="date-field"
            className="rounded-xl border border-border bg-default px-4 py-3"
            style={CONTINUOUS_CORNER}
            onPress={() => setShowDatePicker(true)}
          >
            <Text className={date ? 'text-foreground' : 'text-muted'}>
              {date
                ? date.toLocaleDateString(locale)
                : t('addReminder.selectDate')}
            </Text>
          </Pressable>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t('addReminder.time')}
          </Text>
          <Pressable
            accessibilityRole="button"
            testID="time-field"
            className="rounded-xl border border-border bg-default px-4 py-3"
            style={CONTINUOUS_CORNER}
            onPress={() => setShowTimePicker(true)}
          >
            <Text className="text-foreground">
              {time.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
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
            value={date ?? new Date()}
            onDismiss={() => setShowDatePicker(false)}
            onValueChange={(_event, selectedDate) => {
              setDate(selectedDate);
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
              setShowTimePicker(false);
            }}
          />
        </Host>
      ) : null}

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t('addReminder.alert')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {ADVANCE_OPTIONS.map((option) => {
            const selected = advanceMinutes === option.minutes;

            return (
              <Pressable
                key={option.minutes}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`advance-chip-${option.minutes}`}
                hitSlop={TOUCH_SLOP}
                className={
                  selected
                    ? 'rounded-full border border-accent bg-accent-soft px-3 py-2'
                    : 'rounded-full border border-border bg-default px-3 py-2'
                }
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
        className="rounded-xl bg-accent"
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
  );
}

export function AddReminderScreen() {
  const { selectedPetId } = useSelectedPet();

  if (selectedPetId === null) {
    return <Redirect href={'/reminders' as Href} />;
  }

  return <AddReminderContent petId={selectedPetId} />;
}
