import { router, type Href } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Uniwind, useUniwind } from 'uniwind';

import { getPet, listPets } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { getMe } from '../../api/users';
import { Card } from '../../components/card';
import { PetAvatar } from '../../components/pet-avatar';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { setStoredTheme } from '../../utils/theme-preference';

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <View className="flex-row items-center justify-between gap-4 border-b border-separator py-3 last:border-b-0">
      <Text className="text-sm font-normal text-muted">{label}</Text>
      <Text className="flex-1 text-right text-sm font-semibold text-foreground">
        {value ?? 'No registrado'}
      </Text>
    </View>
  );
}

function PetHero({ pet }: { pet: PetProfile }) {
  return (
    <View className="h-56 overflow-hidden rounded-card bg-default">
      <View className="h-full w-full items-center justify-center bg-accent-soft">
        <PetAvatar
          name={pet.name}
          photoUrl={pet.photoUrl}
          size={224}
          testID="profile-pet-photo"
        />
      </View>
      <View className="absolute inset-x-0 bottom-0 gap-1 bg-surface/90 p-4">
        <Text className="text-2xl font-black text-foreground">{pet.name}</Text>
        {pet.breed ? (
          <Text className="font-semibold text-muted">{pet.breed}</Text>
        ) : null}
      </View>
    </View>
  );
}

function PetPills({ pet }: { pet: PetProfile }) {
  const pills = [
    pet.sex,
    pet.sterilized === null
      ? null
      : pet.sterilized
        ? 'Sterilized'
        : 'Not sterilized',
    Number.isFinite(pet.ageMonths) ? `${pet.ageMonths} months` : null,
    pet.currentWeightKg === null ? null : `${pet.currentWeightKg} kg`,
  ].filter((value): value is string => value !== null);

  return (
    <View className="flex-row flex-wrap gap-2">
      {pills.map((pill) => (
        <View key={pill} className="rounded-full bg-accent-soft px-3 py-2">
          <Text className="text-xs font-bold text-foreground">{pill}</Text>
        </View>
      ))}
    </View>
  );
}

export function ProfileScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const { theme } = useUniwind();
  const insets = useSafeAreaInsets();
  const meFn = useCallback(
    () => getMe(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const detailFn = useMemo(
    () =>
      selectedPetId
        ? () => getPet(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const me = useApi(meFn);
  const pets = useApi(petsFn);
  const detail = useApi(detailFn);

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(
      ({ id }) => id === selectedPetId,
    );
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

  const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
  const petLoading = pets.data === undefined || (selectedPetId !== null && detail.data === undefined);

  return (
    <ScrollView
      testID="screen-profile"
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
        <Text className="text-2xl font-black text-foreground">Profile</Text>
        <Button
          testID="profile-add-pet"
          className="rounded-xl bg-accent"
          size="sm"
          onPress={() => router.push('/pets/add' as Href)}
        >
          <Button.Label className="font-bold text-accent-foreground">
            Add pet
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

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="profile-pets-empty" className="font-normal text-muted">
          No pets yet
        </Text>
      ) : null}

      {pets.data && ['error', 'unreachable', 'missing-config'].includes(pets.data.kind) ? (
        <Text testID="profile-pets-error" className="font-normal text-danger">
          Could not load pets
        </Text>
      ) : null}

      {petLoading ? (
        <>
          <Skeleton testID="profile-hero-skeleton" className="h-56 w-full rounded-card" />
          <Skeleton testID="pet-info-skeleton" className="h-52 w-full rounded-card" />
        </>
      ) : null}

      {detail.data && ['error', 'unreachable', 'missing-config'].includes(detail.data.kind) ? (
        <Card testID="profile-pet-error" className="items-start gap-3">
          <Text className="text-danger">Could not load pet profile</Text>
          <Button testID="profile-pet-retry" onPress={detail.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </Card>
      ) : null}

      {pet ? (
        <>
          <PetHero pet={pet} />
          <PetPills pet={pet} />
          <Button
            testID="change-photo"
            className="rounded-xl bg-accent-soft"
            variant="secondary"
          >
            <Button.Label className="font-bold text-accent">
              Change photo
            </Button.Label>
          </Button>

          <Card testID="pet-info-card" className="gap-0">
            <Text className="pb-2 text-lg font-bold text-foreground">
              Información
            </Text>
            <InfoRow label="Raza" value={pet.breed} />
            <InfoRow label="Microchip" value={pet.microchip} />
            <InfoRow label="Dispositivo GPS" value={pet.device?.model ?? null} />
            <InfoRow
              label="Última señal"
              value={
                pet.lastCommunicationAt
                  ? new Date(pet.lastCommunicationAt).toLocaleString()
                  : null
              }
            />
          </Card>

          <Pressable
            accessibilityRole="button"
            testID="documents-link"
            className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"
            onPress={() => router.push(`/pets/${pet.id}/docs` as Href)}
          >
            <Text className="font-semibold text-foreground">Documentos</Text>
            <Text className="text-lg font-semibold text-muted">›</Text>
          </Pressable>
        </>
      ) : null}

      <Pressable
        accessibilityRole="button"
        testID="reminders-link"
        className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"
        onPress={() => router.push('/reminders' as Href)}
      >
        <Text className="font-semibold text-foreground">Reminders</Text>
        <Text className="text-lg font-semibold text-muted">›</Text>
      </Pressable>

      <Card testID="me-card" className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          Account
        </Text>
        {me.data === undefined ? (
          <Skeleton testID="me-card-skeleton" className="h-12 w-full rounded-xl" />
        ) : null}
        {me.data?.kind === 'ok' ? (
          <View className="gap-1">
            <Text className="text-lg font-bold text-foreground">
              {`${me.data.me.firstName} ${me.data.me.lastName}`}
            </Text>
            <Text className="font-normal text-muted">{me.data.me.email}</Text>
          </View>
        ) : null}
        {me.data && me.data.kind !== 'ok' && me.data.kind !== 'unauthorized' ? (
          <Text testID="me-card-state" className="font-normal text-muted">
            Account unavailable
          </Text>
        ) : null}
        <Button
          testID="theme-toggle"
          className="mt-2 rounded-xl bg-default"
          variant="secondary"
          onPress={() => {
            const nextTheme = theme === 'dark' ? 'light' : 'dark';
            Uniwind.setTheme(nextTheme);
            void setStoredTheme(nextTheme);
          }}
        >
          <Button.Label className="font-semibold text-foreground">
            {theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          </Button.Label>
        </Button>
      </Card>

      <Button
        testID="profile-sign-out"
        className="rounded-xl bg-danger-soft"
        variant="danger-soft"
        onPress={() => void signOut()}
      >
        <Button.Label className="font-bold text-danger">Sign out</Button.Label>
      </Button>
    </ScrollView>
  );
}
