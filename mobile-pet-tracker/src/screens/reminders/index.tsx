import { useChunkyLip } from '../../theme/chunky-lip';
import {
  BottomSheet,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Repeat, Trash } from 'reicon-react-native';

import { listPets } from '../../api/pets';
import { petKeys, reminderKeys } from '../../api/query-keys';
import {
  cancelReminderSeries,
  deleteReminder,
  listReminders,
  type RemindersState,
} from '../../api/reminders';
import type { Recurrence, Reminder } from '../../api/types';
import { isoToLocalDate } from '../../utils/civil-date';
import { EmptyState } from '../../components/empty-state';
import { PetSwitcher } from '../../components/pet-switcher';
import { PopIn } from '../../components/pop-in';
import { RiseIn } from '../../components/rise-in';
import { ScreenHeader } from '../../components/screen-header';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { MOTION_REMINDERS_STAGGER_MS } from '../../theme/motion';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { daysUntil } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';

function isRemindersError(state: RemindersState): boolean {
  return ['error', 'unreachable', 'missing-config', 'not-found'].includes(
    state.kind,
  );
}

function cadenceText(recurrence: Recurrence, t: ReturnType<typeof useTranslate>): string {
  const { unit, every } = recurrence;
  switch (unit) {
    case 'hour': return every === 1 ? t('reminders.cadenceHour') : t('reminders.cadenceHours', { count: every });
    case 'day': return every === 1 ? t('reminders.cadenceDay') : t('reminders.cadenceDays', { count: every });
    case 'week': return every === 1 ? t('reminders.cadenceWeek') : t('reminders.cadenceWeeks', { count: every });
    case 'month': return every === 1 ? t('reminders.cadenceMonth') : t('reminders.cadenceMonths', { count: every });
    case 'year': return every === 1 ? t('reminders.cadenceYear') : t('reminders.cadenceYears', { count: every });
  }
}

export function RemindersScreen() {
  const chunkyLip = useChunkyLip();
  const queryClient = useQueryClient();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const selectedPetIdRef = useRef<string | null>(selectedPetId);
  const appliedRoutePetIdRef = useRef<string | null>(null);
  const insets = useSafeAreaInsets();
  const [blueInk, amberInk, greenInk, violetInk, roseInk, muted, accentForeground, danger, accentStrong] = useThemeColors([
    'category-blue-strong', 'category-amber-strong', 'category-green-strong',
    'category-violet-strong', 'category-rose-strong', 'muted', 'accent-foreground', 'danger', 'accent-strong',
  ]);
  const [now, setNow] = useState(Date.now);
  const [surface] = useThemeColors(['surface']);
  const categoryInk = {
    blue: blueInk, amber: amberInk, green: greenInk,
    violet: violetInk, rose: roseInk, neutral: muted,
  };
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  useEffect(() => {
    if (typeof petId === 'string' && petId !== appliedRoutePetIdRef.current && pets.data?.kind === 'ok'
      && pets.data.pets.some(({ id }) => id === petId)) {
      appliedRoutePetIdRef.current = petId;
      selectPet(petId);
    }
  }, [petId, pets.data, selectPet]);
  const reminders = useQuery({
    queryKey: reminderKeys.list(selectedPetId ?? ''),
    queryFn: () => listReminders(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const refetchReminders = reminders.refetch;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Reminder | null>(null);
  const [cancelCandidate, setCancelCandidate] = useState<Reminder | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    selectedPetIdRef.current = selectedPetId;
  }, [selectedPetId]);

  useFocusEffect(
    useCallback(() => {
      setNow(Date.now());
      if (selectedPetIdRef.current !== null) {
        refetchReminders();
      }
      return () => {
        setDeleteCandidate(null);
        setCancelCandidate(null);
        setActionError(null);
      };
    }, [refetchReminders]),
  );

  const handleDelete = useCallback(
    async (reminderId: string) => {
      if (!selectedPetId) return;
      setDeletingId(reminderId);
      setActionError(null);

      try {
        const result = await deleteReminder(
          baseUrl,
          token ?? '',
          selectedPetId,
          reminderId,
        );

        switch (result.kind) {
          case 'ok':
          case 'not-found':
            refetchReminders();
            return;
          case 'forbidden':
            setActionError(t('reminders.errorForbidden'));
            return;
          case 'unreachable':
            setActionError(t('common.cannotReachServer'));
            return;
          case 'unauthorized':
            await signOut();
            return;
          case 'error':
          case 'missing-config':
            setActionError(t('common.somethingWentWrong'));
        }
      } catch {
        setActionError(t('common.somethingWentWrong'));
      } finally {
        setDeletingId(null);
      }
    }, [baseUrl, refetchReminders, selectedPetId, signOut, t, token],
  );

  const handleCancelSeries = useCallback(
    async (reminderId: string) => {
      if (!selectedPetId) return;
      setDeletingId(reminderId);
      setActionError(null);
      try {
        const result = await cancelReminderSeries(baseUrl, token ?? '', reminderId);
        switch (result.kind) {
          case 'ok':
          case 'not-found':
          case 'not-editable':
            await queryClient.invalidateQueries({ queryKey: reminderKeys.list(selectedPetId) });
            return;
          case 'forbidden':
            setActionError(t('reminders.errorCancelForbidden'));
            return;
          case 'unreachable':
            setActionError(t('common.cannotReachServer'));
            return;
          case 'unauthorized':
            await signOut();
            return;
          case 'error':
          case 'missing-config':
            setActionError(t('common.somethingWentWrong'));
        }
      } catch {
        setActionError(t('common.somethingWentWrong'));
      } finally {
        setDeletingId(null);
      }
    }, [baseUrl, queryClient, selectedPetId, signOut, t, token],
  );

  const cancelSelectedReminder = useCallback(() => {
    if (!cancelCandidate) return;
    const reminderId = cancelCandidate.id;
    setCancelCandidate(null);
    void handleCancelSeries(reminderId);
  }, [cancelCandidate, handleCancelSeries]);

  const confirmDelete = useCallback((reminder: Reminder) => {
    setActionError(null);
    setDeleteCandidate(reminder);
  }, []);

  const dismissDeleteSheet = useCallback(() => {
    setDeleteCandidate(null);
    setCancelCandidate(null);
  }, []);

  const deleteSelectedReminder = useCallback(() => {
    if (!deleteCandidate) return;
    const reminderId = deleteCandidate.id;
    setDeleteCandidate(null);
    void handleDelete(reminderId);
  }, [deleteCandidate, handleDelete]);

  const cancelPetName = pets.data?.kind === 'ok' ? pets.data.pets.find(({ id }) => id === cancelCandidate?.petId)?.name : undefined;
  const petsEmpty = pets.data?.kind === 'ok' && pets.data.pets.length === 0;
  if (petsEmpty) {
    return (
      <View
        testID="reminders-no-pets-frame"
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top + 12, paddingHorizontal: 20 }}
      >
        <ScreenHeader testID="reminders-no-pets-header" backFallback="/profile" />
        <View testID="reminders-no-pets-screen" className="flex-1 items-center justify-center p-6 bg-background">
          <EmptyState
            testID="reminders-no-pets"
            pose="talk"
            title={t('common.noPetsYet')}
            body={t('common.noPetsBody')}
            action={{ label: t('profile.addPet'), onPress: () => router.push('/pets/add') }}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      testID="screen-reminders"
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 12,
        gap: 14,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <ScreenHeader
        testID="reminders"
        backFallback="/profile"
        title={t('reminders.reminders')}
        accessory={
          <Button
            testID="reminders-add-link"
            className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}
            onPress={() => router.push('/add-reminder' as Href)}
          >
            <Plus size={16} color={accentForeground} />
            <Button.Label className="text-sm font-extrabold text-accent-foreground">
              {t('reminders.new')}
            </Button.Label>
          </Button>
        }
      />

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {selectedPetId && reminders.data === undefined ? (
        <View testID="reminders-loading" className="gap-3">
          {[0, 1, 2].map((index) => (
            <Skeleton
              key={index}
              testID={`reminder-row-skeleton-${index + 1}`}
              className="h-20 w-full rounded-card"
            />
          ))}
        </View>
      ) : null}

      {selectedPetId !== null && !petsEmpty && reminders.data && isRemindersError(reminders.data) ? (
        <View className="items-start gap-3">
          <Text testID="reminders-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button
            testID="reminders-retry"
            onPress={() => void reminders.refetch()}
          >
            <Button.Label>{t('common.retry')}</Button.Label>
          </Button>
        </View>
      ) : null}

      {reminders.data?.kind === 'ok' &&
      reminders.data.reminders.length === 0 ? (
        <EmptyState
          testID="reminders-empty"
          pose="clipboard"
          title={t('reminders.noRemindersYet')}
          body={t('reminders.emptyBody')}
          action={{ label: t('reminders.new'), onPress: () => router.push('/add-reminder' as Href) }}
        />
      ) : null}

      {actionError ? (
        <Text testID="reminders-action-error" className="text-danger">
          {actionError}
        </Text>
      ) : null}

      {reminders.data?.kind === 'ok' &&
      reminders.data.reminders.length > 0 ? (
        <>
          <View testID="reminders-pills" className="flex-row gap-2">
            <View
              testID="pill-active"
              className="flex-1 rounded-16 px-3 py-2.5 bg-surface-secondary"
              style={CONTINUOUS_CORNER}
            >
              <Text
                className="text-2xl font-black text-accent-strong"
                style={TABULAR_NUMS}
              >
                {
                  reminders.data.reminders.filter(
                    ({ status }) => status === 'scheduled',
                  ).length
                }
              </Text>
              <Text className="text-xs font-bold text-muted">
                {t('reminders.active')}
              </Text>
            </View>
            <View
              testID="pill-week"
              className={`flex-1 rounded-16 px-3 py-2.5 ${CATEGORY_SLOTS.amber.surface}`}
              style={CONTINUOUS_CORNER}
            >
              <Text
                className={`text-2xl font-black ${CATEGORY_SLOTS.amber.ink}`}
                style={TABULAR_NUMS}
              >
                {
                  reminders.data.reminders.filter((reminder) => {
                    const days = daysUntil(
                      new Date(now),
                      new Date(reminder.dueAt),
                    );
                    return (
                      reminder.status === 'scheduled' &&
                      days >= 0 &&
                      days <= 7
                    );
                  }).length
                }
              </Text>
              <Text className={`text-xs font-bold ${CATEGORY_SLOTS.amber.ink}`}>
                {t('reminders.thisWeek')}
              </Text>
            </View>
            <View
              testID="pill-inactive"
              className="flex-1 rounded-16 px-3 py-2.5 bg-default"
              style={CONTINUOUS_CORNER}
            >
              <Text
                className="text-2xl font-black text-muted"
                style={TABULAR_NUMS}
              >
                {
                  reminders.data.reminders.filter(
                    ({ status }) => status !== 'scheduled',
                  ).length
                }
              </Text>
              <Text className="text-xs font-bold text-muted">
                {t('reminders.inactive')}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {reminders.data.reminders.map((reminder, i) => {
              const meta = REMINDER_TYPE_META[reminder.type];
              const due = new Date(reminder.dueAt);
              const days = daysUntil(new Date(now), due);
              const inactive = reminder.status !== 'scheduled';
              const recurrence = inactive ? null : reminder.recurrence;
              const isSeries = Boolean(recurrence);
              const until = reminder.recurrenceUntil ? isoToLocalDate(reminder.recurrenceUntil) : null;
              const repeatUntil = until
                ? until.getFullYear() === new Date(now).getFullYear()
                  ? t('reminders.untilDay', { date: until.toLocaleDateString(locale, { day: 'numeric', month: 'short' }) })
                  : t('reminders.untilMonth', { date: new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(until) })
                : '';
              const upcoming = !inactive && days === 0;
              const slot = CATEGORY_SLOTS[meta.category];
              const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
              const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

              return (
                <RiseIn key={reminder.id} testID={`reminders-entry-${reminder.id}`} delayMs={i * MOTION_REMINDERS_STAGGER_MS}>
                  <View
                    testID={`reminder-row-${reminder.id}`}
                    className={`flex-row items-center gap-3 rounded-22 bg-surface p-3.5 ${upcoming ? 'border-2 border-category-amber' : 'border border-border'}${inactive ? ' opacity-50' : ''}`}
                    style={CONTINUOUS_CORNER}
                  >
                    <View
                      testID={`reminder-tile-${reminder.id}`}
                      className={`size-11.5 items-center justify-center rounded-14 ${slot.surface}`}
                      style={CONTINUOUS_CORNER}
                    >
                      <meta.Icon size={22} color={categoryInk[meta.category]} />
                    </View>
                    <View className="min-w-0 flex-1 gap-0.75">
                      <View className="flex-row items-center justify-between">
                        <Text className={`text-xs font-extrabold ${slot.ink}`}>
                          {t(meta.labelKey)}
                        </Text>
                        {upcoming ? (
                          <PopIn testID={`reminder-upcoming-pop-${reminder.id}`}>
                            <Text
                              testID={`reminder-upcoming-${reminder.id}`}
                              className={`rounded-full px-2 py-0.75 text-11 font-extrabold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}`}
                            >
                              {t('reminders.upcoming')}
                            </Text>
                          </PopIn>
                        ) : null}
                      </View>
                      <Text className="text-base font-extrabold text-foreground">
                        {reminder.title}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Text className="text-13 font-normal text-muted">
                          {t('reminders.dueAt', { date, time })}
                        </Text>
                        {inactive ? (
                          <Text
                            testID={`reminder-status-${reminder.id}`}
                            className="text-13 font-semibold text-muted"
                          >
                            {reminder.status === 'sent'
                              ? t('reminders.sent')
                              : t('reminders.cancelled')}
                          </Text>
                        ) : (
                          <Text className="text-13 font-normal text-muted">
                            {t('reminders.dueInDays', { days })}
                          </Text>
                        )}
                      </View>
                      {recurrence ? (
                        <View testID={`reminder-repeats-${reminder.id}`} className="flex-row items-center gap-1">
                          <Repeat size={14} color={accentStrong} />
                          <Text className="text-13 font-bold text-accent-strong">
                            {t('reminders.repeatsEvery', { cadence: cadenceText(recurrence, t), until: repeatUntil })}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Button
                      testID={isSeries ? `reminder-cancel-series-${reminder.id}` : `reminder-delete-${reminder.id}`}
                      accessibilityLabel={isSeries ? t('reminders.cancelSeriesA11y', { title: reminder.title }) : undefined}
                      className={`h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}`}
                      isDisabled={deletingId === reminder.id}
                      variant="danger-soft"
                      onPress={() => {
                        if (isSeries) {
                          setActionError(null);
                          setDeleteCandidate(null);
                          setCancelCandidate(reminder);
                        } else {
                          setCancelCandidate(null);
                          confirmDelete(reminder);
                        }
                      }}
                    >
                      <Text className="text-13 font-extrabold text-danger">
                        {isSeries ? t('reminders.cancelSeries') : t('reminders.delete')}
                      </Text>
                    </Button>
                  </View>
                </RiseIn>
              );
            })}
          </View>
        </>
      ) : null}

      <View testID="reminders-delete-host">
        <BottomSheet
          index={deleteCandidate === null && cancelCandidate === null ? -1 : 0}
          enablePanDownToClose
          onClose={dismissDeleteSheet}
          snapPoints={['50%', '100%']}
          backgroundStyle={{ backgroundColor: surface }}
        >
          <BottomSheetView>
            {cancelCandidate ? (
              <View testID="reminders-cancel-series-sheet" className="items-center gap-3 bg-surface px-5 pb-9 pt-3">
                <View testID="reminders-cancel-series-icon" className={`size-14 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`}>
                  <Repeat size={26} color={danger} />
                </View>
                <Text className="text-center text-xl font-black text-foreground">{t('reminders.cancelSeriesTitle')}</Text>
                <Text testID="reminders-cancel-series-reference" className="text-center text-base font-semibold text-foreground">
                  {t('reminders.cancelSeriesReference', { title: cancelCandidate.title, cadence: cancelCandidate.recurrence ? cadenceText(cancelCandidate.recurrence, t) : '' })}
                </Text>
                <Text className="text-center text-sm font-normal text-muted">
                  {cancelPetName
                    ? t('reminders.cancelSeriesBody', { title: cancelCandidate.title, pet: cancelPetName })
                    : t('reminders.cancelSeriesBodyNoPet', { title: cancelCandidate.title })}
                </Text>
                <View className="w-full gap-3">
                  <Button testID="reminders-cancel-series-confirm" className="h-14 w-full rounded-16 bg-danger" style={chunkyLip.danger} variant="danger" onPress={cancelSelectedReminder}>
                    <Text className="text-17 font-extrabold text-danger-foreground">{t('reminders.cancelSeriesConfirm')}</Text>
                  </Button>
                  <Button testID="reminders-cancel-series-keep" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} variant="outline" onPress={dismissDeleteSheet}>
                    <Text className="text-17 font-extrabold text-foreground">{t('reminders.keepSeries')}</Text>
                  </Button>
                </View>
              </View>
            ) : (
            <View
              testID="reminders-delete-sheet"
              className="items-center gap-3 bg-surface px-5 pb-9 pt-3"
            >
              <View
                testID="reminders-delete-icon"
                className={`size-14 items-center justify-center rounded-full ${CATEGORY_SLOTS.rose.surface}`}
              >
                <Trash size={26} color={danger} />
              </View>
              <Text className="text-center text-xl font-black text-foreground">
                {t('reminders.deleteReminder')}
              </Text>
              <Text
                testID="reminders-delete-reference"
                className="text-center text-base font-semibold text-foreground"
              >
                {deleteCandidate?.title ?? ''}
              </Text>
              <Text className="text-center text-sm font-normal text-muted">
                {t('reminders.deleteSheetBody')}
              </Text>
              <View className="w-full gap-3">
                <Button
                  testID="reminders-delete-confirm"
                  className="h-14 w-full rounded-16 bg-danger" style={chunkyLip.danger}
                  variant="danger"
                  onPress={deleteSelectedReminder}
                >
                  <Text className="text-17 font-extrabold text-danger-foreground">
                    {t('reminders.delete')}
                  </Text>
                </Button>
                <Button
                  testID="reminders-delete-cancel"
                  className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral}
                  variant="outline"
                  onPress={dismissDeleteSheet}
                >
                  <Text className="text-17 font-extrabold text-foreground">
                    {t('reminders.cancel')}
                  </Text>
                </Button>
              </View>
            </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </ScrollView>
  );
}
