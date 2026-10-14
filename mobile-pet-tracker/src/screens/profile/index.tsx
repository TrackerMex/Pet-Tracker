import { useQuery } from '@tanstack/react-query';
import { router, type Href, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';
import { useUniwind } from 'uniwind';

import {
  requestPhotoUploadUrl,
  resolvePhotoContentType,
  uploadPhotoToUrl,
} from '../../api/media';
import { getPet, listPets } from '../../api/pets';
import { petKeys, userKeys } from '../../api/query-keys';
import type { PetProfile } from '../../api/types';
import { getMe } from '../../api/users';
import { Card } from '../../components/card';
import { PetAvatar } from '../../components/pet-avatar';
import { PetSwitcher } from '../../components/pet-switcher';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useNotificationsBlocked } from '../../hooks/use-push-registration';
import { useAuth } from '../../providers/auth-provider';
import {
  useLanguage,
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeTransition } from '../../theme/theme-transition';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS, type CategorySlot } from '../../utils/category-palette';

function InfoRow({
  isLast = false,
  label,
  value,
}: {
  isLast?: boolean;
  label: string;
  value: string | null;
}) {
  const t = useTranslate();

  return (
    <View
      className={
        isLast
          ? 'flex-row items-center justify-between gap-4 py-3'
          : 'flex-row items-center justify-between gap-4 border-b border-separator py-3'
      }
    >
      <Text className="text-sm font-normal text-muted">{label}</Text>
      <Text className="flex-1 text-right text-sm font-semibold text-foreground">
        {value ?? t('profile.notRegistered')}
      </Text>
    </View>
  );
}

function PetPills({ pet }: { pet: PetProfile }) {
  const t = useTranslate();
  const pills: { testID: string; slot: CategorySlot; text: string | null }[] = [
    { testID: 'profile-pet-chip-sex', slot: 'blue', text: pet.sex },
    { testID: 'profile-pet-chip-sterilized', slot: 'green', text: pet.sterilized === null ? null : pet.sterilized ? t('profile.sterilized') : t('profile.notSterilized') },
    { testID: 'profile-pet-chip-age', slot: 'amber', text: Number.isFinite(pet.ageMonths) ? t('profile.ageMonths', { months: pet.ageMonths }) : null },
    { testID: 'profile-pet-chip-weight', slot: 'violet', text: pet.currentWeightKg === null ? null : `${pet.currentWeightKg} kg` },
  ];

  return (
    <View testID="profile-pet-chips" className="flex-row flex-wrap justify-center gap-2">
      {pills.filter(({ text }) => text !== null).map((pill) => (
        <View key={pill.testID} testID={pill.testID} className={`rounded-full px-3 py-1 ${CATEGORY_SLOTS[pill.slot].surface}`}>
          <Text className={`text-xs font-bold ${CATEGORY_SLOTS[pill.slot].ink}`}>{pill.text}</Text>
        </View>
      ))}
    </View>
  );
}

export function ProfileScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { language, setLanguage } = useLanguage();
  const locale = useLocale();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const { theme } = useUniwind();
  const switchTheme = useThemeTransition();
  const insets = useSafeAreaInsets();
  const [muted, blue, green, amber, violet] = useThemeColors(['muted', 'category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong']);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const notificationsBlocked = useNotificationsBlocked();
  const me = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getMe(baseUrl, token ?? ''),
  });
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
  const refetchPets = pets.refetch;
  const refetchDetail = detail.refetch;

  useFocusEffect(
    useCallback(() => {
      refetchPets();
      refetchDetail();
    }, [refetchDetail, refetchPets]),
  );

  const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
  const petLoading = pets.data === undefined || (selectedPetId !== null && detail.data === undefined);
  const initials = me.data?.kind === 'ok'
    ? [me.data.me.firstName, me.data.me.lastName].map((part) => part.trim().charAt(0)).join('').toUpperCase()
    : '';

  async function handleChangePhoto() {
    if (!pet) return;

    setPhotoError(null);
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    const contentType = resolvePhotoContentType(asset.mimeType, asset.uri);
    if (!contentType) {
      setPhotoError(t('profile.errorPhotoFormat'));
      return;
    }

    setPhotoUploading(true);
    try {
      const requested = await requestPhotoUploadUrl(
        baseUrl,
        token ?? '',
        pet.id,
        contentType,
      );
      if (requested.kind === 'unauthorized') {
        await signOut();
        return;
      }
      if (requested.kind !== 'ok') {
        setPhotoError(t('profile.couldNotUploadPhoto'));
        return;
      }

      const assetResponse = await fetch(asset.uri);
      const body = await assetResponse.blob();
      const uploaded = await uploadPhotoToUrl(
        requested.uploadUrl,
        body,
        contentType,
      );
      if (uploaded.kind !== 'ok') {
        setPhotoError(t('profile.couldNotUploadPhoto'));
        return;
      }

      detail.refetch();
    } catch {
      setPhotoError(t('profile.couldNotUploadPhoto'));
    } finally {
      setPhotoUploading(false);
    }
  }

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
        <Text testID="profile-title" className="text-3xl font-black tracking-tight text-foreground">
          {t('profile.profile')}
        </Text>
        <Button
          testID="profile-add-pet"
          className="rounded-xl bg-accent border-b-4 border-black/25"
          size="sm"
          onPress={() => router.push('/pets/add' as Href)}
        >
          <Button.Label className="font-bold text-accent-foreground">
            {t('profile.addPet')}
          </Button.Label>
        </Button>
      </View>

      {notificationsBlocked ? (
        <Card testID="notifications-blocked-notice" className="items-start gap-3">
          <Text className="font-normal text-foreground">
            {t('profile.notificationsBlocked')}
          </Text>
          <Button
            testID="notifications-open-settings"
            onPress={() => void Linking.openSettings()}
          >
            <Button.Label>{t('profile.openSettings')}</Button.Label>
          </Button>
        </Card>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          variant="avatars"
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="profile-pets-empty" className="font-normal text-muted">
          {t('common.noPetsYet')}
        </Text>
      ) : null}

      {pets.data && ['error', 'unreachable', 'missing-config'].includes(pets.data.kind) ? (
        <Text testID="profile-pets-error" className="font-normal text-danger">
          {t('profile.couldNotLoadPets')}
        </Text>
      ) : null}

      {petLoading ? (
        <>
          <Skeleton testID="profile-hero-skeleton" className="h-52 w-full rounded-card" />
          <Skeleton testID="pet-info-skeleton" className="h-52 w-full rounded-card" />
        </>
      ) : null}

      {detail.data && ['error', 'unreachable', 'missing-config'].includes(detail.data.kind) ? (
        <Card testID="profile-pet-error" className="items-start gap-3">
          <Text className="text-danger">{t('profile.couldNotLoadPet')}</Text>
          <Button
            testID="profile-pet-retry"
            onPress={() => void detail.refetch()}
          >
            <Button.Label>{t('common.retry')}</Button.Label>
          </Button>
        </Card>
      ) : null}

      {pet ? (
        <>
          <Card variant="secondary" testID="profile-pet-card" className="items-center gap-3">
            <PetAvatar name={pet.name} photoUrl={pet.photoUrl} cacheKey={pet.id} size={96} testID="profile-pet-avatar" />
            <Text testID="profile-pet-name" className="text-2xl font-black text-foreground">
              {pet.name}
            </Text>
            <PetPills pet={pet} />
          </Card>
          <Button
            testID="change-photo"
            className="rounded-xl bg-accent-soft"
            variant="secondary"
            isDisabled={photoUploading}
            onPress={() => void handleChangePhoto()}
          >
            <Button.Label className="font-bold text-accent-strong">
              {t('profile.changePhoto')}
            </Button.Label>
          </Button>
          {photoError ? (
            <Text testID="photo-upload-error" className="text-danger">
              {photoError}
            </Text>
          ) : null}

          <Card testID="pet-info-card" className="gap-0">
            <Text className="pb-2 text-xs font-semibold uppercase tracking-widest text-muted">
              {t('profile.information')}
            </Text>
            <InfoRow label={t('profile.breed')} value={pet.breed} />
            <InfoRow label={t('profile.microchip')} value={pet.microchip} />
            <InfoRow
              label={t('profile.gpsDevice')}
              value={pet.device?.model ?? null}
            />
            <InfoRow
              isLast
              label={t('profile.lastSignal')}
              value={
                pet.lastCommunicationAt
                  ? new Date(pet.lastCommunicationAt).toLocaleString(locale)
                  : null
              }
            />
          </Card>

          <Pressable
            accessibilityRole="button"
            testID="documents-link"
            hitSlop={TOUCH_SLOP}
            className="flex-row items-center gap-3 rounded-xl bg-default px-3 py-2"
            style={CONTINUOUS_CORNER}
            onPress={() => router.push(`/pets/${pet.id}/docs` as Href)}
          >
            <View
              testID="documents-link-tile"
              className={`size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS['blue'].surface}`}
              style={CONTINUOUS_CORNER}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <FileText size={18} color={blue} />
            </View>
            <Text className="flex-1 font-semibold text-foreground">
              {t('profile.documents')}
            </Text>
            <ChevronRight size={20} color={muted} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            testID="pairing-link"
            className="flex-row items-center gap-3 rounded-xl bg-default px-3 py-2"
            style={CONTINUOUS_CORNER}
            onPress={() => router.push('/pairing' as Href)}
          >
            <View
              testID="pairing-link-tile"
              className={`size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS['green'].surface}`}
              style={CONTINUOUS_CORNER}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Wifi size={18} color={green} />
            </View>
            <Text className="flex-1 font-semibold text-foreground">
              {t('profile.gpsSettings')}
            </Text>
            <ChevronRight size={20} color={muted} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            testID="geofences-link"
            hitSlop={TOUCH_SLOP}
            className="flex-row items-center gap-3 rounded-xl bg-default px-3 py-2"
            style={CONTINUOUS_CORNER}
            onPress={() => router.push(`/pets/${pet.id}/geofences` as Href)}
          >
            <View
              testID="geofences-link-tile"
              className={`size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS['amber'].surface}`}
              style={CONTINUOUS_CORNER}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <MapIcon size={18} color={amber} />
            </View>
            <Text className="flex-1 font-semibold text-foreground">
              {t('geofences.title')}
            </Text>
            <ChevronRight size={20} color={muted} />
          </Pressable>
        </>
      ) : null}

      <Pressable
        accessibilityRole="button"
        testID="reminders-link"
        hitSlop={TOUCH_SLOP}
        className="flex-row items-center gap-3 rounded-xl bg-default px-3 py-2"
        style={CONTINUOUS_CORNER}
        onPress={() => router.push('/reminders' as Href)}
      >
        <View
          testID="reminders-link-tile"
          className={`size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS['violet'].surface}`}
          style={CONTINUOUS_CORNER}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Bell size={18} color={violet} />
        </View>
        <Text className="flex-1 font-semibold text-foreground">
          {t('profile.reminders')}
        </Text>
        <ChevronRight size={20} color={muted} />
      </Pressable>

      <Card testID="me-card" className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t('profile.account')}
        </Text>
        {me.data === undefined ? (
          <Skeleton testID="me-card-skeleton" className="h-12 w-full rounded-xl" />
        ) : null}
        {me.data?.kind === 'ok' ? (
          <View testID="me-identity" className="flex-row items-center gap-3">
            {initials ? (
              <View
                testID="me-avatar"
                className="size-10 items-center justify-center rounded-full bg-default"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text testID="me-avatar-initials" className="text-sm font-black text-foreground">
                  {initials}
                </Text>
              </View>
            ) : null}
          <View testID="me-identity-text" className="flex-1 gap-1">
            <Text className="text-lg font-bold text-foreground">
              {`${me.data.me.firstName} ${me.data.me.lastName}`}
            </Text>
            <Text className="font-normal text-muted">{me.data.me.email}</Text>
          </View>
          </View>
        ) : null}
        {me.data && me.data.kind !== 'ok' && me.data.kind !== 'unauthorized' ? (
          <Text testID="me-card-state" className="font-normal text-muted">
            {t('profile.accountUnavailable')}
          </Text>
        ) : null}
        <Button
          testID="theme-toggle"
          className="mt-2 rounded-xl bg-default"
          variant="secondary"
          onPress={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Button.Label className="font-semibold text-foreground">
            {theme === 'dark'
              ? t('profile.useLightTheme')
              : t('profile.useDarkTheme')}
          </Button.Label>
        </Button>
        <Button
          testID="language-toggle"
          accessibilityLabel={t('profile.changeLanguage')}
          className="mt-2 rounded-xl bg-default"
          variant="secondary"
          onPress={() => setLanguage(language === 'es' ? 'en' : 'es')}
        >
          <Button.Label className="font-semibold text-foreground">
            {language === 'es'
              ? t('profile.languageEnglish')
              : t('profile.languageSpanish')}
          </Button.Label>
        </Button>
      </Card>

      <Button
        testID="profile-sign-out"
        className="rounded-xl bg-danger-soft"
        variant="danger-soft"
        onPress={() => void signOut()}
      >
        <Button.Label className="font-bold text-danger">
          {t('profile.signOut')}
        </Button.Label>
      </Button>
    </ScrollView>
  );
}
