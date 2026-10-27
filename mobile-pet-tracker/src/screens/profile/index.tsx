import { useQuery } from '@tanstack/react-query';
import { router, type Href, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';
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
import { EmptyState } from '../../components/empty-state';
import { PetHeroHeader } from '../../components/pet-hero-header';
import { PetSwitcher } from '../../components/pet-switcher';
import { ToggleSwitch } from '../../components/toggle-switch';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useNotificationsBlocked } from '../../hooks/use-push-registration';
import { useAuth } from '../../providers/auth-provider';
import {
  useLanguage,
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeTransition } from '../../theme/theme-transition';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS, type CategorySlot } from '../../utils/category-palette';
import { BubblePop } from '../home/bubble-pop';
import { HomeEntrance } from '../home/home-entrance';

function formatLastSignal(
  iso: string | null,
  nowMs: number,
  t: ReturnType<typeof useTranslate>,
  locale: string,
): string | null {
  if (iso === null) return null;
  const s = Math.floor((nowMs - Date.parse(iso)) / 1000);
  if (s < 60) return t('map.justNow');
  if (s < 3600) return t('map.agoMinutes', { minutes: Math.floor(s / 60) });
  if (s < 86400) return t('map.agoHours', { hours: Math.floor(s / 3600) });
  const date = new Date(iso);
  return date.getFullYear() === new Date(nowMs).getFullYear()
    ? date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    : date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function InfoRow({
  isLast = false,
  label,
  tone = 'default',
  value,
}: {
  isLast?: boolean;
  label: string;
  tone?: 'default' | 'accent';
  value: string | null;
}) {
  const t = useTranslate();
  const valueClassName = tone === 'accent'
    ? 'flex-1 text-right text-sm font-bold text-accent-strong'
    : 'flex-1 text-right text-sm font-bold text-foreground';

  return (
    <View
      className={
        isLast
          ? 'flex-row items-center justify-between gap-4 py-2.75'
          : 'flex-row items-center justify-between gap-4 border-b border-separator py-2.75'
      }
    >
      <Text className="text-sm font-normal text-muted">{label}</Text>
      <Text className={valueClassName}>
        {value ?? t('profile.notRegistered')}
      </Text>
    </View>
  );
}

function PetPills({ pet }: { pet: PetProfile }) {
  const t = useTranslate();
  const pills: { testID: string; slot: CategorySlot; text: string | null }[] = [
    {
      testID: 'profile-pet-chip-sex',
      slot: 'blue',
      text: pet.sex === 'male'
        ? t('addPet.male')
        : pet.sex === 'female' ? t('addPet.female') : null,
    },
    { testID: 'profile-pet-chip-sterilized', slot: 'green', text: pet.sterilized === null ? null : pet.sterilized ? t('profile.sterilized') : t('profile.notSterilized') },
    { testID: 'profile-pet-chip-age', slot: 'amber', text: Number.isFinite(pet.ageMonths) ? t('profile.ageMonths', { months: pet.ageMonths }) : null },
    { testID: 'profile-pet-chip-weight', slot: 'violet', text: pet.currentWeightKg === null ? null : `${pet.currentWeightKg} kg` },
  ];

  return (
    <View testID="profile-pet-chips" className="flex-row flex-wrap gap-1.5">
      {pills.filter(({ text }) => text !== null).map((pill) => (
        <View key={pill.testID} testID={pill.testID} className={`rounded-full px-2.5 py-1.25 ${CATEGORY_SLOTS[pill.slot].surface}`}>
          <Text className={`text-xs font-extrabold ${CATEGORY_SLOTS[pill.slot].ink}`}>{pill.text}</Text>
        </View>
      ))}
    </View>
  );
}

function ProfileTile({ testID, slot, icon, label, onPress }: {
  testID: string;
  slot: CategorySlot;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      hitSlop={TOUCH_SLOP}
      style={CONTINUOUS_CORNER}
      className={`flex-1 gap-1.5 rounded-tile p-3 ${CATEGORY_SLOTS[slot].surface}`}
      onPress={onPress}
    >
      <View
        testID={`${testID}-icon`}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {icon}
      </View>
      <Text className={`text-sm font-extrabold ${CATEGORY_SLOTS[slot].ink}`}>{label}</Text>
    </Pressable>
  );
}

export function ProfileScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { language, setLanguage } = useLanguage();
  const locale = useLocale();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const selectedPetIdRef = useRef<string | null>(selectedPetId);
  const photoBusyRef = useRef<boolean>(false);
  const { theme } = useUniwind();
  const switchTheme = useThemeTransition();
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const [blue, green, amber, violet, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground']);
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

  useEffect(() => {
    selectedPetIdRef.current = selectedPetId;
  }, [selectedPetId]);

  useFocusEffect(
    useCallback(() => {
      refetchPets();
      if (selectedPetIdRef.current !== null) {
        refetchDetail();
      }
    }, [refetchDetail, refetchPets]),
  );

  const pet = detail.data?.kind === 'ok' ? detail.data.pet : null;
  const showHero = pets.data === undefined || (pets.data.kind === 'ok' && pets.data.pets.length > 0);
  const petsEmpty = pets.data?.kind === 'ok' && pets.data.pets.length === 0;
  const petLoading = (pets.data === undefined || (selectedPetId !== null && detail.data === undefined)) && !petsEmpty;
  const initials = me.data?.kind === 'ok'
    ? [me.data.me.firstName, me.data.me.lastName].map((part) => part.trim().charAt(0)).join('').toUpperCase()
    : '';
  const useDarkThemeLabel = t('profile.useDarkTheme');
  const changeLanguageLabel = t('profile.changeLanguage');
  const currentLanguageName = language === 'es' ? t('profile.languageSpanish') : t('profile.languageEnglish');

  async function handleChangePhoto() {
    if (!pet) return;

    if (photoBusyRef.current) return;
    photoBusyRef.current = true;
    try {
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
    } finally {
      photoBusyRef.current = false;
    }
  }

  const remindersLink = (
    <ProfileTile
      testID="reminders-link"
      slot="violet"
      icon={<Bell size={22} strokeWidth={2.2} color={violet} />}
      label={t('profile.reminders')}
      onPress={() => router.push('/reminders' as Href)}
    />
  );

  const addPetCapsule = (
    <Pressable
      testID="profile-add-pet"
      accessibilityRole="button"
      hitSlop={TOUCH_SLOP}
      className={showHero ? 'h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4' : 'h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5'}
      onPress={() => router.push('/pets/add' as Href)}
    >
      <View
        testID="profile-add-pet-icon"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Plus size={16} strokeWidth={2.6} color={accentStrong} />
      </View>
      <Text className="text-sm font-extrabold text-accent-strong">
        {t('profile.addPet')}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      testID="screen-profile"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: 14,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View testID="profile-heading" accessible accessibilityRole="header" accessibilityLabel={t('profile.profile')} className="absolute size-px" />
      {showHero ? (
        <View testID="profile-hero" className="relative">
          <PetHeroHeader
            pet={pet}
            variant="bleed"
            caption={pet ? (
              <View testID="profile-pet-card" className="min-w-0 flex-1 gap-2.5 px-1">
                <Text testID="profile-pet-name" className="text-3xl font-black leading-8.5 tracking-display text-foreground">
                  {pet.name}
                </Text>
                <PetPills pet={pet} />
              </View>
            ) : undefined}
          >
            <View testID="profile-hero-top" className="flex-row items-center justify-between gap-3 px-1">
              <View testID="profile-hero-selector" className="min-w-0 flex-1">
                {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
                  <PetSwitcher
                    variant="glass"
                    pets={pets.data.pets}
                    selectedPetId={selectedPetId}
                    onSelect={selectPet}
                  />
                ) : null}
              </View>
              {addPetCapsule}
            </View>
          </PetHeroHeader>
          {pet ? (
            <BubblePop testID="profile-change-photo-pop" className="absolute bottom-24 right-5">
              <Pressable
                testID="change-photo"
                accessibilityRole="button"
                accessibilityLabel={t('profile.changePhoto')}
                accessibilityState={{ disabled: photoUploading }}
                disabled={photoUploading}
                hitSlop={TOUCH_SLOP}
                className="size-11 items-center justify-center rounded-full border-3 border-background bg-accent"
                style={chunkyLip.primary}
                onPress={() => void handleChangePhoto()}
              >
                <Camera size={18} strokeWidth={2.4} color={accentForeground} />
              </Pressable>
            </BubblePop>
          ) : null}
        </View>
      ) : null}
      <View testID="profile-content" className="gap-3.5 px-5" style={showHero ? undefined : { paddingTop: insets.top + 12 }}>
      {!showHero ? <View testID="profile-top-row" className="flex-row justify-end">{addPetCapsule}</View> : null}

      {notificationsBlocked ? (
        <HomeEntrance index={0} testID="profile-entrance-notice"><View testID="notifications-blocked-notice" className={`items-start gap-3 rounded-card p-3.5 ${CATEGORY_SLOTS.amber.surface}`}>
          <Text className="text-sm leading-note font-normal text-foreground">
            {t('profile.notificationsBlocked')}
          </Text>
          <Button
            testID="notifications-open-settings"
            className="h-11 rounded-14 px-4.5"
            style={chunkyLip.primary}
            onPress={() => void Linking.openSettings()}
          >
            <Button.Label className="text-sm font-extrabold text-accent-foreground">{t('profile.openSettings')}</Button.Label>
          </Button>
        </View></HomeEntrance>
      ) : null}



      {petsEmpty ? (
        <EmptyState
          testID="profile-pets-empty"
          pose="talk"
          title={t('common.noPetsYet')}
          body={t('common.noPetsBody')}
          action={{ label: t('profile.addPet'), onPress: () => router.push('/pets/add') }}
        />
      ) : null}

      {pets.data && ['error', 'unreachable', 'missing-config'].includes(pets.data.kind) ? (
        <Text testID="profile-pets-error" className="font-normal text-danger">
          {t('profile.couldNotLoadPets')}
        </Text>
      ) : null}

      {petLoading ? (
        <>
          <Skeleton testID="pet-info-skeleton" className="h-52 w-full rounded-card" />
        </>
      ) : null}

      {selectedPetId !== null && !petsEmpty && detail.data && ['error', 'unreachable', 'missing-config'].includes(detail.data.kind) ? (
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
          {photoError ? (
            <Text testID="photo-upload-error" className="text-danger">
              {photoError}
            </Text>
          ) : null}

          <HomeEntrance index={1} testID="profile-entrance-info"><Card variant="flat" testID="pet-info-card">
            <InfoRow label={t('profile.breed')} value={pet.breed} />
            <InfoRow label={t('profile.microchip')} value={pet.microchip} />
            <InfoRow
              label={t('profile.gpsDevice')}
              value={pet.device ? t('profile.gpsLinked') : t('profile.gpsNoCollar')}
              tone={pet.device ? 'accent' : 'default'}
            />
            <InfoRow
              isLast
              label={t('profile.lastSignal')}
              value={formatLastSignal(pet.lastCommunicationAt, detail.dataUpdatedAt, t, locale)}
            />
          </Card></HomeEntrance>

        </>
      ) : null}

      <HomeEntrance index={2} testID="profile-entrance-links"><View testID="profile-links" className="gap-2">
        {pet ? (
          <>
            <View testID="profile-links-row-0" className="flex-row gap-2">
              <ProfileTile
                testID="documents-link"
                slot="blue"
                icon={<FileText size={22} strokeWidth={2.2} color={blue} />}
                label={t('profile.documents')}
                onPress={() => router.push(`/pets/${pet.id}/docs` as Href)}
              />
              <ProfileTile
                testID="pairing-link"
                slot="green"
                icon={<Wifi size={22} strokeWidth={2.2} color={green} />}
                label={t('profile.gpsCollar')}
                onPress={() => router.push('/pairing' as Href)}
              />
            </View>
            <View testID="profile-links-row-1" className="flex-row gap-2">
              <ProfileTile
                testID="geofences-link"
                slot="amber"
                icon={<MapIcon size={22} strokeWidth={2.2} color={amber} />}
                label={t('geofences.title')}
                onPress={() => router.push(`/pets/${pet.id}/geofences` as Href)}
              />
              {remindersLink}
            </View>
          </>
        ) : (
          <View testID="profile-links-row-0" className="flex-row gap-2">
            {remindersLink}
          </View>
        )}
      </View></HomeEntrance>

      <HomeEntrance index={3} testID="profile-entrance-account"><Card variant="flat" testID="me-card">
        {me.data === undefined ? (
          <Skeleton testID="me-card-skeleton" className="my-2.5 h-9 w-full rounded-xl" />
        ) : null}
        {me.data?.kind === 'ok' ? (
          <View testID="me-identity" className="flex-row items-center gap-2.5 py-2.5">
            {initials ? (
              <View
                testID="me-avatar"
                className="size-8.5 items-center justify-center rounded-full bg-default"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text testID="me-avatar-initials" className="text-13 font-extrabold text-foreground">
                  {initials}
                </Text>
              </View>
            ) : null}
            <View testID="me-identity-text" className="flex-1">
              <Text className="text-sm font-extrabold text-foreground">
                {`${me.data.me.firstName} ${me.data.me.lastName}`}
              </Text>
              <Text className="text-xs font-normal text-muted">{me.data.me.email}</Text>
            </View>
          </View>
        ) : null}
        {me.data && me.data.kind !== 'ok' && me.data.kind !== 'unauthorized' ? (
          <Text testID="me-card-state" className="py-2.5 font-normal text-muted">
            {t('profile.accountUnavailable')}
          </Text>
        ) : null}
        {me.data?.kind === 'ok' ? (
          <Pressable
            testID="edit-profile-link"
            accessibilityRole="button"
            className="flex-row items-center justify-between gap-4 border-t border-separator py-2.5"
            onPress={() => router.push('/edit-profile' as Href)}
          >
            <Text className="text-sm font-semibold text-foreground">{t('profile.editProfile')}</Text>
          </Pressable>
        ) : null}
        <View testID="theme-row" className="flex-row items-center justify-between gap-4 border-t border-separator py-2.5">
          <Text className="text-sm font-semibold text-foreground">{useDarkThemeLabel}</Text>
          <ToggleSwitch
            testID="theme-toggle"
            isSelected={theme === 'dark'}
            onSelectedChange={(selected) => switchTheme(selected ? 'dark' : 'light')}
            accessibilityLabel={useDarkThemeLabel}
            hitSlop={TOUCH_SLOP}
          />
        </View>
        <Pressable
          testID="language-toggle"
          accessibilityRole="button"
          accessibilityLabel={changeLanguageLabel}
          accessibilityValue={{ text: currentLanguageName }}
          className="flex-row items-center justify-between gap-4 border-t border-separator py-2.5"
          onPress={() => setLanguage(language === 'es' ? 'en' : 'es')}
        >
          <Text className="text-sm font-semibold text-foreground">{changeLanguageLabel}</Text>
          <Text testID="language-value" className="text-sm font-extrabold text-accent-strong">{currentLanguageName}</Text>
        </Pressable>
      </Card></HomeEntrance>

      <HomeEntrance index={4} testID="profile-entrance-sign-out">
      <Button
        testID="profile-sign-out"
        className={`h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}`}
        variant="danger-soft"
        onPress={() => void signOut()}
      >
        <Text className="text-15 font-extrabold text-danger">
          {t('profile.signOut')}
        </Text>
      </Button>
      </HomeEntrance>
      </View>
    </ScrollView>
  );
}
