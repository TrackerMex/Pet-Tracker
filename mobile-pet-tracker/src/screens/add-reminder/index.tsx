import { useQuery } from '@tanstack/react-query';
import { useChunkyLip } from '../../theme/chunky-lip';
import { router, type Href } from 'expo-router';
import { Button } from 'heroui-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Minus, Plus, Repeat } from 'reicon-react-native';

import { createReminder } from '../../api/reminders';
import { listPets } from '../../api/pets';
import { petKeys } from '../../api/query-keys';
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

const REPEAT_OPTIONS = [
  { key: 'once', labelKey: 'addReminder.repeatOnce' },
  { key: 'day', labelKey: 'addReminder.repeatDaily' },
  { key: 'week', labelKey: 'addReminder.repeatWeekly' },
  { key: 'month', labelKey: 'addReminder.repeatMonthly' },
  { key: 'year', labelKey: 'addReminder.repeatYearly' },
  { key: 'hour', labelKey: 'addReminder.repeatHourly' },
] as const;

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

function summaryText(
  repeat: (typeof REPEAT_OPTIONS)[number]['key'],
  every: number,
  notifyAt: Date,
  until: Date | null,
  locale: string,
  t: ReturnType<typeof useTranslate>,
  pet?: string,
): string {
  const time = notifyAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  if (repeat === 'once') {
    return t('addReminder.notifyPreview', {
      date: notifyAt.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
      time,
    });
  }
  const end = until ? t('addReminder.summaryUntil', {
    date: until.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
  }) : '';
  const params = { time, until: end };
  if (repeat === 'hour') {
    if (24 % every === 0 && every >= 6) {
      const times = Array.from({ length: 24 / every }, (_, index) =>
        new Date(notifyAt.getTime() + index * every * 3600000).toLocaleTimeString(locale, {
          hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
        }),
      );
      const list = times.slice(0, -1).join(', ');
      const last = times[times.length - 1];
      const doses = times.length === 1 ? times[0] : t('addReminder.dosesJoin', { list, last });
      return t('addReminder.summaryHoursDoses', { ...params, pet: pet ?? '', doses });
    }
    return every === 1
      ? t('addReminder.summaryHourly', params)
      : t('addReminder.summaryHours', { ...params, count: every });
  }
  switch (repeat) {
    case 'day': return t('addReminder.summaryDaily', params);
    case 'week': return t('addReminder.summaryWeekly', {
      ...params, weekday: notifyAt.toLocaleDateString(locale, { weekday: 'long' }),
    });
    case 'month': return every === 1
      ? t('addReminder.summaryMonthly', { ...params, day: notifyAt.getDate() })
      : t('addReminder.summaryMonthlyN', { ...params, day: notifyAt.getDate(), count: every });
    case 'year': return t('addReminder.summaryYearly', {
      ...params, date: notifyAt.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
    });
  }
}

function AddReminderContent({ petId }: { petId: string }) {
  const chunkyLip = useChunkyLip();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  const petName = pets.data?.kind === 'ok' ? pets.data.pets.find(({ id }) => id === petId)?.name : undefined;
  const [muted, accentStrong, foreground] = useThemeColors(['muted', 'accent-strong', 'foreground']);
  const [repeat, setRepeat] = useState<(typeof REPEAT_OPTIONS)[number]['key']>('once');
  const [hourEvery, setHourEvery] = useState(8);
  const [monthEvery, setMonthEvery] = useState(1);
  const [until, setUntil] = useState<Date | null>(null);
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
        advanceMinutes: repeat === 'hour' ? 0 : effectiveAdvance(dueAt, advanceMinutes, Date.now()),
        ...(repeat === 'once' ? {} : {
          recurrence: { unit: repeat, every: repeat === 'month' ? monthEvery : repeat === 'hour' ? hourEvery : 1 },
          ...(until === null ? {} : { recurrenceUntil: localDateToIso(until) }),
        }),
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

  const every = repeat === 'month' ? monthEvery : hourEvery;
  const maxEvery = repeat === 'month' ? 12 : 24;
  const setEvery = repeat === 'month' ? setMonthEvery : setHourEvery;
  const pickedDueAt = date ? combineDateAndTime(date, time) : null;
  const selectedAdvance = repeat === 'hour' ? 0 : effectiveAdvance(pickedDueAt, advanceMinutes, now);
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
          <ScrollView
            testID="type-chips-row"
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mr-5"
            contentContainerStyle={{ gap: 8, paddingRight: 20 }}
          >
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
          </ScrollView>
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
              onChange={(next) => {
                const picked = next === null ? null : isoToLocalDate(next);
                setDate(picked);
                if (picked && until && picked.getTime() > until.getTime()) setUntil(null);
                setNow(Date.now());
              }}
              minDate={localDateToIso(new Date(now))}
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
          <Text className="text-sm font-extrabold text-foreground">{t('addReminder.repeat')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {REPEAT_OPTIONS.map((option) => {
              const selected = repeat === option.key;
              return (
                <Pressable
                  key={option.key}
                  testID={`repeat-chip-${option.key}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  hitSlop={TOUCH_SLOP}
                  className={selected ? SELECTED_CHIP : 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default'}
                  style={selected ? chunkyLip.primaryCompact : undefined}
                  onPress={() => setRepeat(option.key)}
                >
                  <Text className={`text-sm font-extrabold ${selected ? 'text-accent-foreground' : 'text-foreground'}`}>{t(option.labelKey)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {repeat === 'hour' || repeat === 'month' ? (
          <View className="gap-2">
            <View testID="repeat-stepper" className="flex-row items-center gap-3 rounded-16 bg-default p-2" style={CONTINUOUS_CORNER}>
              <Text className="text-15 font-extrabold text-foreground">{t('addReminder.every')}</Text>
              <Pressable
                testID="repeat-every-less"
                accessibilityRole="button"
                accessibilityLabel={repeat === 'month' ? t('addReminder.monthLess') : t('addReminder.hourLess')}
                accessibilityState={{ disabled: every === 1 }}
                disabled={every === 1}
                hitSlop={TOUCH_SLOP}
                className={`size-11 items-center justify-center rounded-full border-2 border-lip-gray bg-surface${every === 1 ? ' opacity-50' : ''}`}
                onPress={() => setEvery((value) => Math.max(1, value - 1))}
              >
                <Minus size={20} color={foreground} />
              </Pressable>
              <Text testID="repeat-every-value" accessibilityLiveRegion="polite" className="min-w-21 text-center text-22 font-black text-foreground">
                {repeat === 'month'
                  ? every === 1 ? t('addReminder.monthsValueOne') : t('addReminder.monthsValue', { count: every })
                  : every === 1 ? t('addReminder.hoursValueOne') : t('addReminder.hoursValue', { count: every })}
              </Text>
              <Pressable
                testID="repeat-every-more"
                accessibilityRole="button"
                accessibilityLabel={repeat === 'month' ? t('addReminder.monthMore') : t('addReminder.hourMore')}
                accessibilityState={{ disabled: every === maxEvery }}
                disabled={every === maxEvery}
                hitSlop={TOUCH_SLOP}
                className={`size-11 items-center justify-center rounded-full border-2 border-lip-gray bg-surface${every === maxEvery ? ' opacity-50' : ''}`}
                onPress={() => setEvery((value) => Math.min(maxEvery, value + 1))}
              >
                <Plus size={20} color={foreground} />
              </Pressable>
            </View>
            <Text testID="repeat-every-help" className="text-13 font-semibold text-muted">{repeat === 'month' ? t('addReminder.monthsRange') : t('addReminder.hoursRange')}</Text>
          </View>
        ) : null}

        {repeat !== 'once' ? (
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-extrabold text-foreground">{t('addReminder.until')}</Text>
              <Text className="text-13 font-semibold text-muted">{t('addReminder.optional')}</Text>
            </View>
            <DateField
              testID="until-field"
              pickerTestID="until-picker"
              allowClear
              value={until === null ? null : localDateToIso(until)}
              onChange={(next) => setUntil(next === null ? null : isoToLocalDate(next))}
              minDate={localDateToIso(date ?? new Date(now))}
              placeholder={t('addReminder.untilPlaceholder')}
            />
          </View>
        ) : null}

        {repeat !== 'hour' ? (
        <View className="gap-2">
          <Text className="text-sm font-extrabold text-foreground">
            {t('addReminder.alert')}
          </Text>
          <ScrollView
            testID="advance-chips-row"
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mr-5"
            contentContainerStyle={{ gap: 8, paddingRight: 20 }}
          >
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
          </ScrollView>
        </View>

        ) : null}

        {notifyAt ? (
          <View
            testID="add-reminder-preview"
            className="flex-row items-center gap-2.5 rounded-tile bg-surface-secondary px-3.5 py-3"
            style={CONTINUOUS_CORNER}
          >
            {repeat === 'once' ? <Bell size={20} color={accentStrong} /> : <Repeat size={20} color={accentStrong} />}
            <Text testID="add-reminder-preview-text" className="flex-1 text-13 font-semibold text-foreground">
              {summaryText(repeat, every, notifyAt, until, locale, t, petName)}
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
