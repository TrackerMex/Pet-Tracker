import { useChunkyLip } from '../../theme/chunky-lip';
import { router, type Href } from 'expo-router';
import { Button } from 'heroui-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell } from 'reicon-react-native';

import { createReminder } from '../../api/reminders';
import type { ReminderType } from '../../api/types';
import { DateField } from '../../components/date-field';
import { FieldErrorMessage } from '../../components/field-error-message';
import { ScreenHeader } from '../../components/screen-header';
import type { FieldIssues } from '../../utils/account-rules';
import { validateReminder } from '../../utils/form-rules';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { hhmmToLocalDate, isoToLocalDate, localDateToIso, timeToHhmm } from '../../utils/civil-date';
import { combineDateAndTime } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';

const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent';

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
  const chunkyLip = useChunkyLip();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [muted, accentStrong] = useThemeColors(['muted', 'accent-strong']);
  const [type, setType] = useState<ReminderType>('vaccine');
  const [title, setTitle] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState(initialTime);
  const [advanceMinutes, setAdvanceMinutes] = useState(10080);
  const [now, setNow] = useState(Date.now);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'title' | 'date'>>({});

  async function handleSubmit() {
    setFormError(null);
    const dueAt = date ? combineDateAndTime(date, time) : null;
    const issues = validateReminder({ title, dueAt, nowMs: Date.now() });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0 || dueAt === null) return;
    const trimmedTitle = title.trim();

    setSubmitting(true);

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
  const notifyAt = pickedDueAt ? new Date(pickedDueAt.getTime() - selectedAdvance * 60000) : null;

  return (
    <KeyboardAvoidingView
      testID="screen-add-reminder"
      className="flex-1"
      behavior="padding"
    >
      <ScrollView
        testID="add-reminder-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          gap: 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
      >
        <ScreenHeader
          testID="add-reminder"
          size={24}
          backFallback="/reminders"
          title={t('addReminder.addReminder')}
        />
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
                  style={selected ? chunkyLip.primaryCompact : undefined}
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
          <FieldErrorMessage testID="title-input" issue={fieldErrors.title} />
        </View>

        <View className="flex-row gap-2.5">
          <View className="flex-3 gap-1.5">
            <Text className="text-sm font-extrabold text-foreground">
              {t('addReminder.date')}
            </Text>
            <DateField
              testID="date-field"
              pickerTestID="date-picker"
              value={date === null ? null : localDateToIso(date)}
              onChange={(next) => { setDate(next === null ? null : isoToLocalDate(next)); setNow(Date.now()); }}
              minDate={localDateToIso(new Date())}
              placeholder={t('addReminder.selectDate')}
            />
            <FieldErrorMessage testID="date-field" issue={fieldErrors.date} />
          </View>
          <View className="flex-2 gap-1.5">
            <Text className="text-sm font-extrabold text-foreground">
              {t('addReminder.time')}
            </Text>
            <DateField
              testID="time-field"
              pickerTestID="time-picker"
              mode="time"
              value={timeToHhmm(time)}
              onChange={(next) => {
                if (next !== null) {
                  const picked = hhmmToLocalDate(next);
                  if (picked !== null) setTime(picked);
                }
                setNow(Date.now());
              }}
            />
          </View>
        </View>

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
                  style={selected ? chunkyLip.primaryCompact : undefined}
                  disabled={disabled}
                  className={`${selected ? SELECTED_CHIP : 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default'}${disabled ? ' opacity-50' : ''}`}
                  onPress={() => setAdvanceMinutes(option.minutes)}
                >
                  <Text className={`text-sm font-extrabold ${selected ? 'text-accent-foreground' : 'text-foreground'}`}>
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {notifyAt ? (
          <View
            testID="add-reminder-preview"
            className="flex-row items-center gap-2.5 rounded-tile bg-surface-secondary px-3.5 py-3"
            style={CONTINUOUS_CORNER}
          >
            <Bell size={20} color={accentStrong} />
            <Text testID="add-reminder-preview-text" className="flex-1 text-13 font-semibold text-foreground">
              {t('addReminder.notifyPreview', {
                date: notifyAt.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
                time: notifyAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
              })}
            </Text>
          </View>
        ) : null}

        <Button
          testID="add-reminder-submit"
          className="mt-auto h-14 rounded-16 bg-accent" style={chunkyLip.primary}
          isDisabled={submitting}
          onPress={() => void handleSubmit()}
        >
          <Text className="text-17 font-extrabold text-accent-foreground">
            {t('addReminder.saveReminder')}
          </Text>
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
