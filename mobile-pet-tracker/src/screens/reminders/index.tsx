import {
  BottomSheet,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';
import { router, type Href, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPets } from '../../api/pets';
import {
  deleteReminder,
  listReminders,
  type RemindersState,
} from '../../api/reminders';
import type { Reminder } from '../../api/types';
import { Card } from '../../components/card';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { daysUntil } from '../../utils/reminder-dates';
import { REMINDER_TYPE_META } from '../../utils/reminder-meta';

function isRemindersError(state: RemindersState): boolean {
  return ['error', 'unreachable', 'missing-config', 'not-found'].includes(
    state.kind,
  );
}

export function RemindersScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  usePetSelection(pets);
  const remindersFn = useMemo(
    () =>
      selectedPetId
        ? () => listReminders(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const reminders = useApi(remindersFn);
  const refetchReminders = reminders.refetch;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Reminder | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refetchReminders();
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
            setActionError('Only the owner can delete');
            return;
          case 'unreachable':
            setActionError('Cannot reach server');
            return;
          case 'unauthorized':
            await signOut();
            return;
          case 'error':
          case 'missing-config':
            setActionError('Something went wrong');
        }
      } catch {
        setActionError('Something went wrong');
      } finally {
        setDeletingId(null);
      }
    }, [baseUrl, refetchReminders, selectedPetId, signOut, token],
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
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-2xl font-black text-foreground">Reminders</Text>
        <Button
          testID="reminders-add-link"
          className="rounded-xl bg-accent"
          onPress={() => router.push('/add-reminder' as Href)}
        >
          <Button.Label className="font-bold text-accent-foreground">
            New
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
            Something went wrong
          </Text>
          <Button testID="reminders-retry" onPress={reminders.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      ) : null}

      {reminders.data?.kind === 'ok' &&
      reminders.data.reminders.length === 0 ? (
        <Text testID="reminders-empty" className="font-normal text-muted">
          No reminders yet
        </Text>
      ) : null}

      {actionError ? (
        <Text testID="reminders-action-error" className="text-danger">
          {actionError}
        </Text>
      ) : null}

      {reminders.data?.kind === 'ok' &&
      reminders.data.reminders.length > 0 ? (
        <>
          <View className="flex-row gap-3">
            <View
              testID="pill-active"
              className="flex-1 items-center gap-1 rounded-2xl bg-accent-soft p-3"
            >
              <Text className="text-lg font-black text-foreground">
                {
                  reminders.data.reminders.filter(
                    ({ status }) => status === 'scheduled',
                  ).length
                }
              </Text>
              <Text className="text-xs font-normal text-muted">Active</Text>
            </View>
            <View
              testID="pill-week"
              className="flex-1 items-center gap-1 rounded-2xl bg-default p-3"
            >
              <Text className="text-lg font-black text-foreground">
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
              <Text className="text-xs font-normal text-muted">This week</Text>
            </View>
            <View
              testID="pill-inactive"
              className="flex-1 items-center gap-1 rounded-2xl bg-default p-3"
            >
              <Text className="text-lg font-black text-foreground">
                {
                  reminders.data.reminders.filter(
                    ({ status }) => status !== 'scheduled',
                  ).length
                }
              </Text>
              <Text className="text-xs font-normal text-muted">Inactive</Text>
            </View>
          </View>

          <View className="gap-3">
            {reminders.data.reminders.map((reminder) => {
              const meta = REMINDER_TYPE_META[reminder.type];
              const days = daysUntil(new Date(), new Date(reminder.dueAt));
              const inactive = reminder.status !== 'scheduled';

              return (
                <Card
                  key={reminder.id}
                  testID={`reminder-row-${reminder.id}`}
                  className={`min-h-20 flex-row items-center gap-3${inactive ? ' opacity-50' : ''}`}
                >
                  <View className="size-11 items-center justify-center rounded-xl bg-accent-soft">
                    <Text className="text-xl">{meta.emoji}</Text>
                  </View>
                  <View className="min-w-0 flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs font-semibold text-muted">
                        {meta.label}
                      </Text>
                      {!inactive && days >= 0 && days <= 10 ? (
                        <Text
                          testID={`reminder-upcoming-${reminder.id}`}
                          className="rounded-full bg-warning-soft px-2 py-0.5 text-2xs font-bold text-warning-strong"
                        >
                          Upcoming!
                        </Text>
                      ) : null}
                    </View>
                    <Text className="font-bold text-foreground">
                      {reminder.title}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-normal text-muted">
                        {new Date(reminder.dueAt).toLocaleDateString()}
                      </Text>
                      {inactive ? (
                        <Text
                          testID={`reminder-status-${reminder.id}`}
                          className="text-xs font-semibold text-muted"
                        >
                          {reminder.status === 'sent' ? 'Sent' : 'Cancelled'}
                        </Text>
                      ) : (
                        <Text className="text-xs font-normal text-muted">
                          {`· in ${days} days`}
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
                      Delete
                    </Button.Label>
                  </Button>
                </Card>
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
              className="gap-3 bg-surface px-6 pb-8 pt-4"
            >
              <Text className="text-xl font-bold text-foreground">
                Delete reminder?
              </Text>
              <Text
                testID="reminders-delete-reference"
                className="text-base font-semibold text-foreground"
              >
                {deleteCandidate?.title ?? ''}
              </Text>
              <Text className="text-sm font-normal text-muted">
                This action cannot be undone.
              </Text>
              <View className="gap-2 pt-2">
                <Button
                  testID="reminders-delete-confirm"
                  className="w-full rounded-xl bg-danger"
                  variant="danger"
                  onPress={deleteSelectedReminder}
                >
                  <Button.Label className="font-bold text-danger-foreground">
                    Delete
                  </Button.Label>
                </Button>
                <Button
                  testID="reminders-delete-cancel"
                  className="w-full rounded-xl"
                  variant="outline"
                  onPress={dismissDeleteSheet}
                >
                  <Button.Label className="font-semibold">Cancel</Button.Label>
                </Button>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </ScrollView>
  );
}
