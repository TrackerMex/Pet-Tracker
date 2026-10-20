import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useContext, useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoCircle, Package } from 'reicon-react-native';

import { claimDevice, releaseDevice } from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
import { deviceKeys, petKeys } from '../../api/query-keys';
import { getPetTracking, type PetTrackingState } from '../../api/subscriptions';
import type { DeviceStatus, PetProfile } from '../../api/types';
import { Card } from '../../components/card';
import { Celebration } from '../../components/celebration';
import { PetAvatar } from '../../components/pet-avatar';
import { PetSwitcher } from '../../components/pet-switcher';
import { PingRing } from '@/components/ping-ring';
import { PingoFloat } from '@/components/pingo-float';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { connectivityLabelKey } from '../../utils/device-connectivity';
import { CATEGORY_SLOTS } from '../../utils/category-palette';

// #188 R3: the collar artboard staggers its second ring by half a cycle.
const PAIRING_ARTBOARD_RING_DELAY_MS = 1200;
const PAIRING_RING_CLASS_NAME = 'size-37.5 rounded-full border-3 border-accent';
const PAIRING_PINGO_SOURCE = require('../../../assets/images/pingo-collar.webp');
const PAIRING_AVATAR_SLOTS = ['amber', 'violet', 'blue', 'green', 'rose'] as const;

function PairingPetAvatar({ pet, index }: { pet: PetProfile; index: number }) {
  const slot = PAIRING_AVATAR_SLOTS[index % PAIRING_AVATAR_SLOTS.length];
  return (
    <View testID="pairing-pet-row" className="w-full flex-row justify-end">
      <View testID="pairing-pet-avatar" accessibilityLabel={pet.name} className="rounded-full border-2 border-accent p-0.75">
        <View testID="pairing-pet-avatar-disc" className={`size-9 items-center justify-center overflow-hidden rounded-full ${CATEGORY_SLOTS[slot].surface}`}>
          {pet.photoUrl ? (
            <PetAvatar name={pet.name} photoUrl={pet.photoUrl} size={36} cacheKey={pet.id} testID="pairing-pet-avatar-image" />
          ) : (
            <Text testID="pairing-pet-avatar-fallback" className={`text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}`}>
              {pet.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

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
  const chunkyLip = useChunkyLip();
  const [muted] = useThemeColors(['muted']);
  const headerHeight = useContext(HeaderHeightContext);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const locale = useLocale();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const refetchPets = pets.refetch;
  const [code, setCode] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'ready'>('idle');
  const [readyDevice, setReadyDevice] = useState<DeviceStatus | null>(null);
  const resetPairingState = useCallback(() => {
    setCode('');
    setActionError(null);
    setPhase('idle');
    setReadyDevice(null);
  }, []);
  const selectedPet =
    pets.data?.kind === 'ok'
      ? pets.data.pets.find(({ id }) => id === selectedPetId)
      : undefined;
  const hasSelectedDevice = selectedPet?.device != null;
  const isLinking = phase === 'idle' && selectedPet?.device === null;
  const connectivityKey = connectivityLabelKey(
    selectedPet?.device?.connectivity ?? null,
  );
  const tracking = useQuery({
    queryKey: deviceKeys.tracking(selectedPetId ?? ''),
    queryFn: () => getPetTracking(baseUrl, token ?? '', selectedPetId!),
    enabled:
      phase === 'idle' && selectedPetId !== null && hasSelectedDevice,
  });
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- R6 resets form state when the selected pet changes.
    resetPairingState();
  }, [resetPairingState, selectedPetId]);

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
          setActionError(t('pairing.errorInvalidCode'));
          break;
        case 'already-claimed':
          setActionError(t('pairing.errorAlreadyClaimed'));
          break;
        case 'pet-has-device':
          setActionError(t('pairing.errorPetHasDevice'));
          break;
        case 'subscription-required':
          setActionError(t('pairing.errorNoSubscription'));
          break;
        case 'forbidden':
          setActionError(t('pairing.errorForbiddenClaim'));
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        case 'error':
        case 'missing-config':
          setActionError(t('common.somethingWentWrong'));
          break;
      }
    } catch {
      setActionError(t('common.somethingWentWrong'));
    } finally {
      setClaiming(false);
    }
  }

  function leaveReady(destination: 'map' | 'back') {
    setPhase('idle');
    setReadyDevice(null);
    if (destination === 'map') {
      router.dismissTo('/map');
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
          setActionError(t('pairing.errorForbiddenRelease'));
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        case 'error':
        case 'missing-config':
          setActionError(t('common.somethingWentWrong'));
          break;
      }
    } catch {
      setActionError(t('common.somethingWentWrong'));
    } finally {
      setReleasing(false);
    }
  }

  function confirmRelease() {
    setActionError(null);
    Alert.alert(
      t('pairing.unpairAlertTitle'),
      t('pairing.unpairAlertBody'),
      [
        { text: t('pairing.cancel'), style: 'cancel' },
        {
          text: t('pairing.unpair'),
          style: 'destructive',
          onPress: () => void handleRelease(),
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView
      testID="screen-pairing"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="pairing-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          gap: 16,
          paddingBottom: insets.bottom + 24,
          ...(isLinking ? { flexGrow: 1 } : {}),
        }}
      >
        {isLinking && selectedPet && pets.data?.kind === 'ok' ? (
          <PairingPetAvatar pet={selectedPet} index={pets.data.pets.findIndex(({ id }) => id === selectedPet.id)} />
        ) : null}

        {phase === 'idle' && selectedPet?.device === null ? (
          <View testID="pairing-hero-group" className="items-center gap-2.5">
            <View testID="pairing-hero" className="h-37.5 w-50 items-center justify-center" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <PingRing testID="pairing-ring-0" delay={0} className={PAIRING_RING_CLASS_NAME} />
              <PingRing testID="pairing-ring-1" delay={PAIRING_ARTBOARD_RING_DELAY_MS} className={PAIRING_RING_CLASS_NAME} />
              <PingoFloat testID="pairing-pingo-float">
                <Image testID="pairing-pingo" source={PAIRING_PINGO_SOURCE} style={{ width: 120, aspectRatio: 1 }} contentFit="contain" />
              </PingoFloat>
            </View>
            <Text testID="pairing-title" className="text-center text-28 font-black tracking-title text-foreground">
              {t('pairing.pairCollar')}
            </Text>
          </View>
        ) : null}

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
              {t('common.somethingWentWrong')}
            </Text>
            <Button
              testID="pairing-retry"
              onPress={() => void pets.refetch()}
            >
              <Button.Label>{t('common.retry')}</Button.Label>
            </Button>
          </View>
        ) : null}

        {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
          <Text testID="pairing-no-pets" className="font-normal text-muted">
            {t('pairing.addPetFirst')}
          </Text>
        ) : null}

        {pets.data?.kind === 'ok' && pets.data.pets.length > 0 && !isLinking ? (
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
          <Celebration
            testID="pairing-ready"
            title={t('pairing.trackerIsReady')}
            body={t('pairing.readySubtitle', { petName: selectedPet.name })}
            details={[
              { testID: 'ready-model', label: t('pairing.model'), value: readyDevice.model ?? '—' },
              { testID: 'ready-esn', label: t('pairing.esn'), value: readyDevice.esn ?? '—' },
            ]}
            primary={{ testID: 'ready-map', label: t('pairing.viewOnMap'), onPress: () => leaveReady('map') }}
            secondary={{ testID: 'ready-done', label: t('pairing.done'), onPress: () => leaveReady('back') }}
          />
        ) : null}

        {phase === 'idle' && selectedPet?.device === null ? (
          <View className="gap-4" style={{ flexGrow: 1 }}>
            <View className="flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3">
              <View testID="pairing-plan-icon" className="mt-px">
                <InfoCircle size={20} color={muted} />
              </View>
              <Text
                testID="pairing-plan-free"
                className="flex-1 text-13 font-normal leading-4.75 text-muted"
                selectable
              >
                <Text className="font-bold text-foreground">{t('pairing.freePlanPairLead')}</Text>
                {' '}
                {t('pairing.freePlanPairBody')}
              </Text>
            </View>

            <View className="gap-1.5">
              <Text testID="pairing-activation-code-label" className="text-sm font-extrabold text-foreground">
                {t('pairing.activationCode')}
              </Text>
              <TextInput
                testID="activation-code-input"
                className="h-15 rounded-14 border-2 border-accent bg-default px-4 font-mono text-24 tracking-code text-foreground"
                style={CONTINUOUS_CORNER}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={64}
                value={code}
                onChangeText={setCode}
              />
              <View testID="pairing-code-hint" className="flex-row items-center gap-1.5">
                <Package size={14} color={muted} />
                <Text className="text-xs font-semibold text-muted">
                  {t('pairing.printedOnCollarBox')}
                </Text>
              </View>
            </View>

            <View testID="pairing-submit-spacer" style={{ flexGrow: 1 }} />

            <Button
              testID="pairing-submit"
              className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
              isDisabled={code.trim() === '' || claiming}
              onPress={() => void handleClaim()}
            >
              <Text className="text-17 font-extrabold text-accent-foreground">
                {t('pairing.pairCollar')}
              </Text>
            </Button>
          </View>
        ) : null}

        {phase === 'idle' && selectedPet?.device ? (
          <View className="gap-4">
            <Text className="text-2xl font-black text-foreground">
              {t('pairing.gpsDevice')}
            </Text>

            <Card testID="device-status-card">
              <View className="gap-4">
                <DeviceRow
                  label={t('pairing.model')}
                  testID="device-model"
                  value={selectedPet.device.model ?? '—'}
                />
                <DeviceRow
                  label={t('pairing.battery')}
                  testID="device-battery"
                  value={
                    selectedPet.device.batteryPct === null
                      ? '—'
                      : `${selectedPet.device.batteryPct}%`
                  }
                />
                <DeviceRow
                  label={t('pairing.connection')}
                  testID="device-connectivity"
                  value={connectivityKey === null ? '—' : t(connectivityKey)}
                />
                <DeviceRow
                  label={t('pairing.lastMessage')}
                  testID="device-last-message"
                  value={
                    selectedPet.device.lastMessageAt
                      ? new Date(
                          selectedPet.device.lastMessageAt,
                        ).toLocaleString(locale)
                      : t('pairing.noMessagesYet')
                  }
                />
                <DeviceRow
                  label={t('pairing.esn')}
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
                  {t('pairing.gpsTrackingActive')}
                </Text>
              </View>
            ) : null}

            {tracking.data?.kind === 'ok' && !tracking.data.tracked ? (
              <Card testID="plan-free" variant="secondary">
                <Text className="font-normal text-foreground" selectable>
                  {t('pairing.freePlanNoActivePlan')}
                </Text>
              </Card>
            ) : null}

            {tracking.data && isTrackingError(tracking.data) ? (
              <Text testID="plan-unknown" className="text-muted" selectable>
                {t('pairing.planStatusUnavailable')}
              </Text>
            ) : null}

            <Button
              testID="device-unpair"
              className="min-h-11 w-full rounded-xl bg-danger"
              isDisabled={releasing}
              onPress={confirmRelease}
            >
              <Button.Label className="font-bold text-accent-foreground">
                {t('pairing.unpairCollar')}
              </Button.Label>
            </Button>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
