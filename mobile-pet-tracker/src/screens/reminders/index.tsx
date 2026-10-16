import {
  BottomSheet,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { router, type Href, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Trash } from 'reicon-react-native';

import { listPets } from '../../api/pets';
import { petKeys, reminderKeys } from '../../api/query-keys';
import {
  deleteReminder,
  listReminders,
  type RemindersState,
} from '../../api/reminders';
import type { Reminder } from '../../api/types';
import { EmptyState } from '../../components/empty-state';
import { PetSwitcher } from '../../components/pet-switcher';
import { PopIn } from '../../components/pop-in';
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
import { daysUntil } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';
import { HomeEntrance } from '../home/home-entrance';

function isRemindersError(state: RemindersState): boolean {
  return ['error', 'unreachable', 'missing-config', 'not-found'].includes(
    state.kind,
  );
}

export function RemindersScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const [blueInk, amberInk, greenInk, violetInk, roseInk, muted, accentForeground, danger] = useThemeColors([
    'category-blue-strong', 'category-amber-strong', 'category-green-strong',
    'category-violet-strong', 'category-rose-strong', 'muted', 'accent-foreground', 'danger',
  ]);
  const categoryInk = {
    blue: blueInk, amber: amberInk, green: greenInk,
    violet: violetInk, rose: roseInk, neutral: muted,
  };
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const reminders = useQuery({
    queryKey: reminderKeys.list(selectedPetId ?? ''),
    queryFn: () => listReminders(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const refetchReminders = reminders.refetch;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Reminder | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refetchReminders();
      return () => {
        setDeleteCandidate(null);
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

  const confirmDelete = useCallback((reminder: Reminder) => {
    setActionError(null);
    setDeleteCandidate(reminder);
  }, []);

  const dismissDeleteSheet = useCallback(() => {
    setDeleteCandidate(null);
  }, []);

  const deleteSelectedReminder = useCallback(() => {
    if (!deleteCandidate) return;
    const reminderId = deleteCandidate.id;
    setDeleteCandidate(null);
    void handleDelete(reminderId);
  }, [deleteCandidate, handleDelete]);

  return (
    <ScrollView
      testID="screen-reminders"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 14,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <View testID="reminders-actions" className="flex-row items-center gap-2">
        <Text
          testID="reminders-title"
          accessibilityRole="header"
          className="flex-1 text-26 font-black tracking-title text-foreground"
        >
          {t('reminders.reminders')}
        </Text>
        <Button
          testID="reminders-add-link"
          className="rounded-xl bg-accent border-b-4 border-black/25 h-10 gap-1.5 px-3.5"
          onPress={() => router.push('/add-reminder' as Href)}
        >
          <Plus size={16} color={accentForeground} />
          <Button.Label className="text-sm font-extrabold text-accent-foreground">
            {t('reminders.new')}
          </Button.Label>
        </Button>
      </View>

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

      {reminders.data && isRemindersError(reminders.data) ? (
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
                      new Date(),
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
              const days = daysUntil(new Date(), due);
              const inactive = reminder.status !== 'scheduled';
              const upcoming = !inactive && days >= 0 && days <= 10;
              const slot = CATEGORY_SLOTS[meta.category];
              const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
              const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

              return (
                <HomeEntrance key={reminder.id} testID={`reminders-entry-${reminder.id}`} index={i}>
                  <View
                    testID={`reminder-row-${reminder.id}`}
                    className={`flex-row items-center gap-3 rounded-22 bg-surface p-3.5 ${upcoming ? 'border-2 border-warning-soft' : 'border border-border'}${inactive ? ' opacity-50' : ''}`}
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
                              className="rounded-full bg-warning-soft px-2 py-0.75 text-11 font-extrabold text-warning-strong"
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
                    </View>
                    <Button
                      testID={`reminder-delete-${reminder.id}`}
                      className="rounded-xl bg-danger-soft"
                      isDisabled={deletingId === reminder.id}
                      size="sm"
                      variant="danger-soft"
                      onPress={() => confirmDelete(reminder)}
                    >
                      <Button.Label className="font-semibold text-danger">
                        {t('reminders.delete')}
                      </Button.Label>
                    </Button>
                  </View>
                </HomeEntrance>
              );
            })}
          </View>
        </>
      ) : null}

      <View testID="reminders-delete-host">
        <BottomSheet
          index={deleteCandidate === null ? -1 : 0}
          enablePanDownToClose
          onClose={dismissDeleteSheet}
          snapPoints={['50%', '100%']}
        >
          <BottomSheetView>
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
                  className="w-full rounded-xl bg-danger"
                  variant="danger"
                  onPress={deleteSelectedReminder}
                >
                  <Button.Label className="font-bold text-danger-foreground">
                    {t('reminders.delete')}
                  </Button.Label>
                </Button>
                <Button
                  testID="reminders-delete-cancel"
                  className="w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface"
                  variant="outline"
                  onPress={dismissDeleteSheet}
                >
                  <Button.Label className="font-semibold">
                    {t('reminders.cancel')}
                  </Button.Label>
                </Button>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </ScrollView>
  );
}
