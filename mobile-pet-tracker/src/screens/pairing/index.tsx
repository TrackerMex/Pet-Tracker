import { router, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import { claimDevice, releaseDevice } from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
import { getPetTracking, type PetTrackingState } from '../../api/subscriptions';
import type { DeviceStatus } from '../../api/types';
import { Card } from '../../components/card';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function isTrackingError(state: PetTrackingState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function DeviceRow({
  label,
  testID,
  value,
}: {
  label: string;
  testID: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="font-normal text-muted">{label}</Text>
      <Text
        testID={testID}
        className="shrink text-right font-semibold text-foreground"
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

export function PairingScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const [foreground] = useThemeColors(['foreground']);
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  usePetSelection(pets);
  const refetchPets = pets.refetch;
  const [code, setCode] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'ready'>('idle');
  const [readyDevice, setReadyDevice] = useState<DeviceStatus | null>(null);
  const selectedPet =
    pets.data?.kind === 'ok'
      ? pets.data.pets.find(({ id }) => id === selectedPetId)
      : undefined;
  const hasSelectedDevice = selectedPet?.device != null;
  const trackingFn = useMemo(
    () =>
      phase === 'idle' && selectedPetId && hasSelectedDevice
        ? () => getPetTracking(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, hasSelectedDevice, phase, selectedPetId, token],
  );
  const tracking = useApi(trackingFn);
  const refetchTracking = tracking.refetch;

  useFocusEffect(
    useCallback(() => {
      refetchPets();
    }, [refetchPets]),
  );

  useFocusEffect(
    useCallback(() => {
      refetchTracking();
    }, [refetchTracking]),
  );

  async function handleClaim() {
    const activationCode = code.trim();
    if (!selectedPetId || !activationCode || claiming) return;

    setActionError(null);
    setClaiming(true);
    try {
      const result = await claimDevice(baseUrl, token ?? '', {
        petId: selectedPetId,
        activationCode,
      });

      switch (result.kind) {
        case 'ok':
          setReadyDevice(result.device);
          setPhase('ready');
          pets.refetch();
          break;
        case 'not-found':
        case 'invalid':
          setActionError(
            'Invalid activation code. Check the code printed on the box.',
          );
          break;
        case 'already-claimed':
          setActionError('This collar is already paired to another pet.');
          break;
        case 'pet-has-device':
          setActionError('This pet already has a collar. Unpair it first.');
          break;
        case 'subscription-required':
          setActionError(
            'This collar has no active plan. Contact support to activate it.',
          );
          break;
        case 'forbidden':
          setActionError('Only the owner can pair a collar.');
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError('Cannot reach server');
          break;
        case 'error':
        case 'missing-config':
          setActionError('Something went wrong');
          break;
      }
    } catch {
      setActionError('Something went wrong');
    } finally {
      setClaiming(false);
    }
  }

  function leaveReady(destination: 'map' | 'back') {
    setPhase('idle');
    setReadyDevice(null);
    if (destination === 'map') {
      router.push('/map');
      return;
    }
    router.back();
  }

  async function handleRelease() {
    if (!selectedPetId || releasing) return;

    setActionError(null);
    setReleasing(true);
    try {
      const result = await releaseDevice(
        baseUrl,
        token ?? '',
        selectedPetId,
      );

      switch (result.kind) {
        case 'ok':
        case 'not-assigned':
          pets.refetch();
          break;
        case 'forbidden':
          setActionError('Only the owner can unpair the collar.');
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError('Cannot reach server');
          break;
        case 'error':
        case 'missing-config':
          setActionError('Something went wrong');
          break;
      }
    } catch {
      setActionError('Something went wrong');
    } finally {
      setReleasing(false);
    }
  }

  function confirmRelease() {
    setActionError(null);
    Alert.alert(
      'Unpair collar?',
      'Location history stays, but live tracking stops until you pair a collar again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: () => void handleRelease(),
        },
      ],
    );
  }

  return (
    <ScrollView
      testID="screen-pairing"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Pressable
        accessibilityLabel="Back"
        accessibilityRole="button"
        testID="pairing-back"
        className="size-11 items-center justify-center rounded-full bg-default"
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color={foreground} />
      </Pressable>

      {pets.data === undefined ? (
        <View testID="pairing-skeleton" className="gap-3">
          <Skeleton
            testID="pairing-content-skeleton-1"
            className="h-11 w-36 rounded-full"
          />
          <Skeleton
            testID="pairing-content-skeleton-2"
            className="h-32 w-full rounded-card"
          />
          <Skeleton
            testID="pairing-content-skeleton-3"
            className="h-12 w-full rounded-xl"
          />
        </View>
      ) : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="pairing-error-pets" className="text-danger" selectable>
            Something went wrong
          </Text>
          <Button testID="pairing-retry" onPress={pets.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="pairing-no-pets" className="font-normal text-muted">
          Add a pet first
        </Text>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {actionError ? (
        <Text testID="pairing-error" className="text-danger" selectable>
          {actionError}
        </Text>
      ) : null}

      {phase === 'ready' && readyDevice && selectedPet ? (
        <View testID="pairing-ready" className="items-center gap-4">
          <View className="size-16 items-center justify-center rounded-full bg-accent-soft">
            <Text className="text-3xl font-black text-success">✓</Text>
          </View>
          <View className="items-center gap-2">
            <Text className="text-2xl font-black text-foreground">
              Tracker is ready
            </Text>
            <Text className="text-center font-normal text-muted" selectable>
              {selectedPet.name}&apos;s collar is paired. GPS tracking is on.
            </Text>
          </View>

          <Card className="w-full">
            <View className="gap-4">
              <DeviceRow
                label="Model"
                testID="ready-model"
                value={readyDevice.model ?? '—'}
              />
              <DeviceRow
                label="ESN"
                testID="ready-esn"
                value={readyDevice.esn ?? '—'}
              />
            </View>
          </Card>

          <Button
            testID="ready-map"
            className="min-h-11 w-full rounded-xl bg-accent"
            onPress={() => leaveReady('map')}
          >
            <Button.Label className="font-bold text-accent-foreground">
              View on map
            </Button.Label>
          </Button>
          <Pressable
            accessibilityRole="button"
            testID="ready-done"
            className="min-h-11 w-full items-center justify-center rounded-xl"
            onPress={() => leaveReady('back')}
          >
            <Text className="font-bold text-foreground">Done</Text>
          </Pressable>
        </View>
      ) : null}

      {phase === 'idle' && selectedPet?.device === null ? (
        <View className="gap-4">
          <Text className="text-2xl font-black text-foreground">
            Pair collar
          </Text>

          <Card variant="secondary">
            <Text
              testID="pairing-plan-free"
              className="text-sm font-normal text-foreground"
              selectable
            >
              Free plan — health only. Pair a collar with an active plan to see
              the map.
            </Text>
          </Card>

          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              Activation code
            </Text>
            <TextInput
              testID="activation-code-input"
              className="min-h-12 rounded-xl border border-border bg-default px-4 py-3 text-foreground"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={64}
              value={code}
              onChangeText={setCode}
            />
            <Text className="text-sm font-normal text-muted">
              Printed on the collar box
            </Text>
          </View>

          <Button
            testID="pairing-submit"
            className="min-h-11 w-full rounded-xl bg-accent"
            isDisabled={code.trim() === '' || claiming}
            onPress={() => void handleClaim()}
          >
            <Button.Label className="font-bold text-accent-foreground">
              Pair collar
            </Button.Label>
          </Button>
        </View>
      ) : null}

      {phase === 'idle' && selectedPet?.device ? (
        <View className="gap-4">
          <Text className="text-2xl font-black text-foreground">
            GPS device
          </Text>

          <Card testID="device-status-card">
            <View className="gap-4">
              <DeviceRow
                label="Model"
                testID="device-model"
                value={selectedPet.device.model ?? '—'}
              />
              <DeviceRow
                label="Battery"
                testID="device-battery"
                value={
                  selectedPet.device.batteryPct === null
                    ? '—'
                    : `${selectedPet.device.batteryPct}%`
                }
              />
              <DeviceRow
                label="Connection"
                testID="device-connectivity"
                value={selectedPet.device.connectivity ?? '—'}
              />
              <DeviceRow
                label="Last message"
                testID="device-last-message"
                value={
                  selectedPet.device.lastMessageAt
                    ? new Date(
                        selectedPet.device.lastMessageAt,
                      ).toLocaleString()
                    : 'No messages yet'
                }
              />
              <DeviceRow
                label="ESN"
                testID="device-esn"
                value={selectedPet.device.esn ?? '—'}
              />
            </View>
          </Card>

          {tracking.data === undefined ? (
            <Skeleton
              testID="plan-skeleton"
              className="h-8 w-44 rounded-full"
            />
          ) : null}

          {tracking.data?.kind === 'ok' && tracking.data.tracked ? (
            <View
              testID="plan-tracked"
              className="self-start rounded-full bg-accent-soft px-3 py-2"
            >
              <Text className="font-semibold text-success">
                GPS tracking active
              </Text>
            </View>
          ) : null}

          {tracking.data?.kind === 'ok' && !tracking.data.tracked ? (
            <Card testID="plan-free" variant="secondary">
              <Text className="font-normal text-foreground" selectable>
                Free plan — health only. This collar has no active plan.
              </Text>
            </Card>
          ) : null}

          {tracking.data && isTrackingError(tracking.data) ? (
            <Text testID="plan-unknown" className="text-muted" selectable>
              Plan status unavailable
            </Text>
          ) : null}

          <Button
            testID="device-unpair"
            className="min-h-11 w-full rounded-xl bg-danger"
            isDisabled={releasing}
            onPress={confirmRelease}
          >
            <Button.Label className="font-bold text-accent-foreground">
              Unpair collar
            </Button.Label>
          </Button>
        </View>
      ) : null}
    </ScrollView>
  );
}
