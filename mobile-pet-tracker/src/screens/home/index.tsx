import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { Button, Card as HeroUICard, Skeleton } from 'heroui-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bacteria,
  Battery,
  Bell,
  Bone,
  CalendarPlus,
  ChevronRight,
  FileText,
  Map,
  Moon,
  Pill,
  Stethoscope,
  Syringe,
  Walk,
  Weight,
  Wifi,
  WifiOff,
  type IconComponent,
} from 'reicon-react-native';

import { getDailyActivity } from '../../api/activity';
import { getPet, listPets, type PetsState } from '../../api/pets';
import {
  activityKeys,
  petKeys,
  reminderKeys,
} from '../../api/query-keys';
import { listReminders } from '../../api/reminders';
import type { DayEntry, ReminderType } from '../../api/types';
import { Card } from '../../components/card';
import { PetHeroHeader } from '../../components/pet-hero-header';
import { PetSwitcher } from '../../components/pet-switcher';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';
import {
  calendarDaysUntil,
  fmtCount,
  fmtDate,
  fmtKg,
  fmtKm,
  fmtMinutes,
  localDayOf,
  upcomingReminders,
} from './format';
import { WeeklyActivityChart } from './weekly-activity-chart';

const WEEKLY_ACTIVITY_SKELETON_HEIGHT = 408;

const REMINDER_ROW_ICONS: Record<ReminderType, IconComponent> = {
  vaccine: Syringe,
  deworming: Bacteria,
  medication: Pill,
  appointment: Stethoscope,
  weight: Weight,
  food: Bone,
  custom: Bell,
};

const QUICK_ACTIONS = [
  {
    testID: 'quick-action-weight',
    Icon: Weight,
    labelKey: 'home.quickActionWeight',
    slot: 'violet',
    href: (_petId: string) => '/weight-log',
  },
  {
    testID: 'quick-action-reminder',
    Icon: CalendarPlus,
    labelKey: 'home.quickActionReminder',
    slot: 'amber',
    href: (_petId: string) => '/add-reminder',
  },
  {
    testID: 'quick-action-documents',
    Icon: FileText,
    labelKey: 'home.quickActionDocuments',
    slot: 'blue',
    href: (petId: string) => `/pets/${petId}/docs`,
  },
] as const;

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function fmtLastSeen(
  iso: string | null,
  locale: string,
  t: ReturnType<typeof useTranslate>,
): string {
  return iso === null
    ? t('home.noLocationDataYet')
    : t('home.lastSeen', { date: new Date(iso).toLocaleString(locale) });
}

function dueCountdown(
  days: number,
  t: ReturnType<typeof useTranslate>,
): { text: string; label: string } {
  if (days < 0) {
    const overdue = t('home.nextVaccineOverdue');
    return { text: overdue, label: overdue };
  }

  if (days === 0) {
    const today = t('home.nextVaccineToday');
    return { text: today, label: today };
  }

  return {
    text: t('home.nextVaccineDays', { days }),
    label: t('home.nextVaccineDaysLeft', { days }),
  };
}

export function HomeScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const viewOnMapLabel = t('home.viewOnMap');
  const { selectedPetId, selectPet } = useSelectedPet();
  const [activitySelection, setActivitySelection] = useState<{
    day: DayEntry;
    petId: string;
  } | null>(null);
  const insets = useSafeAreaInsets();
  const [accent, success, warning, muted, vaccineInk] = useThemeColors([
    'accent-strong',
    'success',
    'warning',
    'muted',
    'category-blue-strong',
  ]);
  const quickActionInks = useThemeColors(
    QUICK_ACTIONS.map(({ slot }) => `category-${slot}-strong`),
  );
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const detail = useQuery({
    queryKey: petKeys.detail(selectedPetId ?? ''),
    queryFn: () => getPet(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const activity = useQuery({
    queryKey: activityKeys.daily(selectedPetId ?? ''),
    queryFn: () => getDailyActivity(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const reminders = useQuery({
    queryKey: reminderKeys.list(selectedPetId ?? ''),
    queryFn: () => listReminders(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const upcoming =
    reminders.data?.kind === 'ok'
      ? upcomingReminders(reminders.data.reminders, new Date())
      : [];
  const reminderRowInks = useThemeColors(
    [upcoming[0], upcoming[1], upcoming[2]].map((reminder) => {
      const slot = reminder
        ? REMINDER_TYPE_META[reminder.type].category
        : 'neutral';
      return slot === 'neutral' ? 'muted' : `category-${slot}-strong`;
    }),
  );
  const nextVaccine =
    detail.data?.kind === 'ok' ? detail.data.pet.nextVaccine : null;
  const nextVaccineDays = nextVaccine
    ? calendarDaysUntil(nextVaccine.nextDoseAt, new Date())
    : null;
  const nextVaccineCountdown =
    nextVaccineDays === null ? null : dueCountdown(nextVaccineDays, t);
  const refetchPets = pets.refetch;
  const refetchDetail = detail.refetch;
  const today =
    activity.data?.kind === 'ok'
      ? activity.data.days[activity.data.days.length - 1]
      : undefined;
  const petList = pets.data?.kind === 'ok' ? pets.data.pets : [];
  const hasPets = petList.length > 0;
  const latestActivityDay =
    activity.data?.kind === 'ok'
      ? activity.data.days[activity.data.days.length - 1]
      : undefined;
  const selectedActivityDay =
    activitySelection?.petId === selectedPetId
      ? activitySelection.day
      : null;
  const selectedToday =
    selectedActivityDay !== null &&
    selectedActivityDay.date === latestActivityDay?.date;

  useFocusEffect(
    useCallback(() => {
      refetchPets();
      refetchDetail();
    }, [refetchDetail, refetchPets]),
  );

  return (
    <ScrollView
      testID="screen-home"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: 16,
        paddingBottom: insets.bottom + 96,
      }}
    >
      {/*
        El hero va a sangre, así que el `padding: 24` y el
        `paddingTop: insets.top + 12` de §Dimensiones bajan a envoltorios de
        dentro (excepción A9). El paddingTop lo asume el slot del hero.
      */}
      {hasPets ? (
        <PetHeroHeader
          pet={detail.data?.kind === 'ok' ? detail.data.pet : null}
          variant="bleed"
          highlight={
            today
              ? { value: fmtCount(today.walkCount), label: t('home.walks') }
              : undefined
          }
        >
          <View testID="home-hero-actions" className="flex-row items-center gap-3">
            <View className="flex-1">
              <PetSwitcher
                pets={petList}
                selectedPetId={selectedPetId}
                onSelect={selectPet}
              />
            </View>
            <Pressable
              testID="home-alerts-bell"
              accessibilityRole="button"
              accessibilityLabel={t('home.alertsBell')}
              className="size-11 items-center justify-center rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              onPress={() => router.push('/alerts')}
            >
              <Bell size={24} color={muted} />
            </Pressable>
          </View>
        </PetHeroHeader>
      ) : null}

      {hasPets ? null : (
        <View
          testID="home-states"
          style={{
            paddingHorizontal: 24,
            paddingTop: insets.top + 12,
            gap: 16,
          }}
        >
          <Text className="text-2xl font-black text-foreground">
            {t('home.home')}
          </Text>

          {pets.data === undefined ? (
            <Skeleton
              testID="home-loading"
              className="h-12 w-full rounded-card"
            />
          ) : null}

          {pets.data && isPetsError(pets.data) ? (
            <View className="items-start gap-3">
              <Text testID="home-error" className="text-danger">
                {t('common.somethingWentWrong')}
              </Text>
              <Button
                testID="home-retry"
                onPress={() => void pets.refetch()}
              >
                {t('common.retry')}
              </Button>
            </View>
          ) : null}

          {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
            <Text testID="home-empty" className="text-muted">
              {t('common.noPetsYet')}
            </Text>
          ) : null}
        </View>
      )}

      <View testID="home-content" style={{ paddingHorizontal: 24, gap: 16 }}>
        {detail.data?.kind === 'error' || detail.data?.kind === 'unreachable' ? (
          <HeroUICard testID="pet-hero-error" className="items-start gap-3 p-4">
            <Text className="text-danger">
              {t('common.somethingWentWrong')}
            </Text>
            <Button
              testID="pet-hero-retry"
              onPress={() => void detail.refetch()}
            >
              {t('common.retry')}
            </Button>
          </HeroUICard>
        ) : null}

        {selectedPetId ? (
          <Card testID="summary-card" className="gap-4">
            <Text
              testID="summary-card-title"
              className="text-base font-bold text-foreground"
            >
              {t('home.summaryTitle')}
            </Text>

            {activity.data === undefined ? (
              <Skeleton testID="summary-skeleton" className="h-16 w-full rounded-xl" />
            ) : null}

            {activity.data?.kind === 'no-tracking' ? (
              <Text testID="summary-note" className="font-normal text-muted">
                {t('home.activityNeedsCollar')}
              </Text>
            ) : null}

            {activity.data?.kind === 'error' ||
            activity.data?.kind === 'unreachable' ||
            activity.data?.kind === 'missing-config' ? (
              <Text testID="summary-note" className="font-normal text-muted">
                {t('home.couldNotLoadActivity')}
              </Text>
            ) : null}

            {activity.data?.kind === 'ok' ? (
              <View className="flex-row">
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Weight size={20} color={muted} />
                  <Text
                    testID="summary-weight"
                    className="text-sm font-bold text-foreground"
                    style={TABULAR_NUMS}
                  >
                    {fmtKg(
                      detail.data?.kind === 'ok'
                        ? detail.data.pet.currentWeightKg
                        : null,
                    )}
                  </Text>
                  <Text className="text-2xs font-normal text-muted">
                    {t('home.weight')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Walk size={20} color={muted} />
                  <Text
                    testID="summary-activity"
                    className="text-sm font-bold text-foreground"
                    style={TABULAR_NUMS}
                  >
                    {fmtMinutes(today?.activeMinutes ?? null)}
                  </Text>
                  <Text className="text-2xs font-normal text-muted">
                    {t('home.activity')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1 border-r border-border">
                  <Moon size={20} color={muted} />
                  <Text
                    testID="summary-sleep"
                    className="text-sm font-bold text-foreground"
                    style={TABULAR_NUMS}
                  >
                    {fmtMinutes(today?.restMinutes ?? null)}
                  </Text>
                  <Text className="text-2xs font-normal text-muted">
                    {t('home.sleep')}
                  </Text>
                </View>
                <View className="flex-1 items-center gap-1">
                  <Map size={20} color={muted} />
                  <Text
                    testID="summary-distance"
                    className="text-sm font-bold text-foreground"
                    style={TABULAR_NUMS}
                  >
                    {fmtKm(today?.distanceM ?? null)}
                  </Text>
                  <Text className="text-2xs font-normal text-muted">
                    {t('home.distance')}
                  </Text>
                </View>
              </View>
            ) : null}
          </Card>
        ) : null}

        {detail.data?.kind === 'ok' ? (
          <>
            <Card
              testID="collar-card"
              className="gap-3 bg-default"
            >
              <View className="flex-row items-center gap-3">
                <View className="size-9 items-center justify-center rounded-full bg-accent-soft">
                  {detail.data.pet.device === null ? (
                    <Moon size={20} color={accent} />
                  ) : detail.data.pet.device.connectivity === 'online' ? (
                    <Wifi size={20} color={accent} />
                  ) : (
                    <WifiOff size={20} color={accent} />
                  )}
                </View>
                <Text
                  testID="collar-status"
                  className="text-base font-bold text-foreground"
                >
                  {detail.data.pet.device === null
                    ? t('home.free')
                    : detail.data.pet.device.connectivity === 'online'
                      ? t('home.online')
                      : t('home.offline')}
                </Text>
              </View>
              {detail.data.pet.device ? (
                <View className="flex-row items-center gap-2">
                  <Battery
                    size={18}
                    color={
                      detail.data.pet.device.batteryPct === null
                        ? muted
                        : detail.data.pet.device.batteryPct > 60
                          ? success
                          : warning
                    }
                  />
                  <Text
                    testID="collar-battery"
                    style={TABULAR_NUMS}
                    className={
                      detail.data.pet.device.batteryPct === null
                        ? 'font-normal text-muted'
                        : detail.data.pet.device.batteryPct > 60
                          ? 'font-semibold text-success'
                          : 'font-semibold text-warning-strong'
                    }
                  >
                    {detail.data.pet.device.batteryPct === null
                      ? '—'
                      : `${detail.data.pet.device.batteryPct}%`}
                  </Text>
                </View>
              ) : (
                <Text className="font-normal text-muted">
                  {t('home.noCollar')}
                </Text>
              )}
              {detail.data.pet.device === null ? (
                    <Pressable
                      accessibilityRole="button"
                      testID="collar-pair-link"
                      className="min-h-11 items-center justify-center rounded-xl bg-accent-soft px-4"
                      style={CONTINUOUS_CORNER}
                      onPress={() => router.push('/pairing')}
                >
                  <Text className="font-bold text-foreground">
                    {t('home.pairCollar')}
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          </>
        ) : null}

        {selectedPetId ? (
          <View testID="quick-actions" className="gap-3">
            <Text
              testID="quick-actions-title"
              className="text-xs font-semibold uppercase tracking-widest text-muted"
            >
              {t('home.quickActions')}
            </Text>
            <View testID="quick-actions-row" className="flex-row gap-3">
              {QUICK_ACTIONS.map(
                ({ testID, Icon, labelKey, slot, href }, index) => (
                  <Pressable
                    key={testID}
                    testID={testID}
                    accessibilityRole="button"
                    className={`min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 ${CATEGORY_SLOTS[slot].surface}`}
                    style={CONTINUOUS_CORNER}
                    onPress={() => router.push(href(selectedPetId))}
                  >
                    <Icon size={24} color={quickActionInks[index]} />
                    <Text className="text-2xs font-semibold text-foreground">
                      {t(labelKey)}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        ) : null}

        {selectedPetId && activity.data === undefined ? (
          <Skeleton
            testID="weekly-activity-skeleton"
            className="w-full rounded-card"
            style={{ height: WEEKLY_ACTIVITY_SKELETON_HEIGHT }}
          />
        ) : null}

        {activity.data?.kind === 'ok' ? (
          <>
            <WeeklyActivityChart
              key={selectedPetId}
              days={activity.data.days}
              weekComparison={activity.data.weekComparison}
              onSelectDay={(day) => {
                if (selectedPetId) {
                  setActivitySelection({ day, petId: selectedPetId });
                }
              }}
            />
            {selectedToday ? (
              <Button
                testID="weekly-activity-day-map"
                className="min-h-11 w-full rounded-xl bg-accent"
                onPress={() => router.push('/map')}
              >
                <Button.Label className="font-bold text-accent-foreground">
                  {viewOnMapLabel}
                </Button.Label>
              </Button>
            ) : null}
          </>
        ) : null}

        {selectedPetId ? (
          <View testID="reminders-section" className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text
                testID="reminders-section-title"
                className="text-base font-bold text-foreground"
              >
                {t('home.reminders')}
              </Text>
              <Pressable
                testID="reminders-see-all"
                accessibilityRole="button"
                className="min-h-11 justify-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={() => router.push('/reminders')}
              >
                <Text className="text-xs font-semibold text-accent-strong">
                  {t('home.remindersSeeAll')}
                </Text>
              </Pressable>
            </View>

            <View testID="reminders-section-body" className="gap-2">
              {detail.data === undefined ? (
                <Skeleton
                  testID="reminders-section-skeleton"
                  className="h-16 w-full rounded-card"
                />
              ) : null}

              {nextVaccine && nextVaccineCountdown ? (
                <Card
                  testID="reminders-next-vaccine"
                  className="flex-row items-center gap-3"
                >
                  <View
                    className={`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`}
                  >
                    <Syringe size={20} color={vaccineInk} />
                  </View>
                  <View className="flex-1">
                    <Text
                      testID="reminders-next-vaccine-name"
                      className="text-sm font-semibold text-foreground"
                    >
                      {nextVaccine.name}
                    </Text>
                    <Text
                      testID="reminders-next-vaccine-date"
                      className="text-xs font-normal text-muted"
                    >
                      {fmtDate(nextVaccine.nextDoseAt, locale)}
                    </Text>
                  </View>
                  <Text
                    testID="reminders-next-vaccine-days"
                    accessibilityLabel={nextVaccineCountdown.label}
                    style={TABULAR_NUMS}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}`}
                  >
                    {nextVaccineCountdown.text}
                  </Text>
                </Card>
              ) : null}

              {detail.data?.kind === 'ok' &&
              !detail.data.pet.nextVaccine &&
              upcoming.length === 0 ? (
                <Card
                  testID="reminders-none-upcoming"
                  className="flex-row items-center gap-3"
                >
                  <View
                    className={`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`}
                  >
                    <Syringe size={20} color={muted} />
                  </View>
                  <Text className="flex-1 text-sm font-normal text-muted">
                    {t('home.noUpcomingVaccine')}
                  </Text>
                </Card>
              ) : null}

              {upcoming.map((reminder, index) => {
                const dueDay = localDayOf(reminder.dueAt);
                const countdown = dueCountdown(
                  calendarDaysUntil(dueDay, new Date()),
                  t,
                );
                const Icon = REMINDER_ROW_ICONS[reminder.type];
                const slot = REMINDER_TYPE_META[reminder.type].category;

                return (
                  <Card
                    key={reminder.id}
                    testID={`reminders-item-${reminder.id}`}
                    className="flex-row items-center gap-3"
                  >
                    <View
                      className={`size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`}
                    >
                      <Icon size={20} color={reminderRowInks[index]} />
                    </View>
                    <View className="flex-1">
                      <Text
                        testID={`reminders-item-${reminder.id}-title`}
                        className="text-sm font-semibold text-foreground"
                      >
                        {reminder.title}
                      </Text>
                      <Text
                        testID={`reminders-item-${reminder.id}-date`}
                        className="text-xs font-normal text-muted"
                      >
                        {fmtDate(dueDay, locale)}
                      </Text>
                    </View>
                    <Text
                      testID={`reminders-item-${reminder.id}-days`}
                      accessibilityLabel={countdown.label}
                      style={TABULAR_NUMS}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}`}
                    >
                      {countdown.text}
                    </Text>
                  </Card>
                );
              })}
            </View>
          </View>
        ) : null}

        {detail.data?.kind === 'ok' && detail.data.pet.device ? (
          <Card
            testID="last-position-card"
            className="gap-2 bg-default"
            onPress={() => router.push('/map')}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="size-9 items-center justify-center rounded-full bg-accent-soft">
                  <Map size={20} color={accent} />
                </View>
                <Text className="font-semibold text-accent-strong">
                  {viewOnMapLabel}
                </Text>
              </View>
              <ChevronRight size={20} color={accent} />
            </View>
            <Text testID="last-position-time" className="font-normal text-muted">
              {fmtLastSeen(detail.data.pet.lastCommunicationAt, locale, t)}
            </Text>
          </Card>
        ) : null}
      </View>
    </ScrollView>
  );
}
