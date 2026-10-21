import { useChunkyLip } from '../../theme/chunky-lip';
import { HeaderHeightContext, usePreventRemove } from 'expo-router/react-navigation';
import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'heroui-native';
import { Calendar, Camera } from 'reicon-react-native';
import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  requestPhotoUploadUrl,
  resolvePhotoContentType,
  type PhotoContentType,
  uploadPhotoToUrl,
} from '../../api/media';
import { createPet, listPets, type CreatePetInput } from '../../api/pets';
import { petKeys } from '../../api/query-keys';
import { Celebration } from '../../components/celebration';
import { SegmentedControl } from '../../components/segmented-control';
import { PetAvatar } from '../../components/pet-avatar';
import { FieldErrorMessage } from '../../components/field-error-message';
import type { FieldIssues } from '../../utils/account-rules';
import { validateAddPet, validateAddPetBasics } from '../../utils/form-rules';
import { useAuth } from '../../providers/auth-provider';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';

type Species = CreatePetInput['species'];
type Sex = NonNullable<CreatePetInput['sex']>;
type PetSize = NonNullable<CreatePetInput['size']>;
type AgeMode = 'birthDate' | 'months';

function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function OptionalChip<T extends string | boolean>({
  current,
  label,
  testID,
  value,
  onSelect,
}: {
  current: T | null;
  label: string;
  testID: string;
  value: T;
  onSelect: (value: T | null) => void;
}) {
  const selected = current === value;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      testID={testID}
      hitSlop={TOUCH_SLOP}
      className={
        selected
          ? 'rounded-full border border-accent bg-accent-soft px-3 py-2'
          : 'rounded-full border border-border bg-default px-3 py-2'
      }
      onPress={() => onSelect(selected ? null : value)}
    >
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
    </Pressable>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-13 font-extrabold text-foreground">
      {children}
    </Text>
  );
}

export function AddPetScreen() {
  const chunkyLip = useChunkyLip();
  const headerHeight = useContext(HeaderHeightContext);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  const locale = useLocale();
  const t = useTranslate();
  const { selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const [muted, accentStrong] = useThemeColors(['muted', 'accent-strong']);
  const choosePhotoLabel = t('addPet.choosePhoto');
  const [step, setStep] = useState<1 | 2>(1);
  const [species, setSpecies] = useState<Species>('dog');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [size, setSize] = useState<PetSize | null>(null);
  const [sterilized, setSterilized] = useState<boolean | null>(null);
  const [microchip, setMicrochip] = useState('');
  const [ageMode, setAgeMode] = useState<AgeMode>('birthDate');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [approxAgeMonths, setApproxAgeMonths] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoAsset, setPhotoAsset] = useState<{
    uri: string;
    contentType: PhotoContentType;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'>>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [celebratePetName, setCelebratePetName] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const prevent = step === 2 && !submitting && celebratePetName === null && !leaving;

  usePreventRemove(prevent, () => {
    if (submitting) return;
    setStep(1);
    setFieldErrors({});
    setFormError(null);
  });

  useEffect(() => {
    if (leaving) router.back();
  }, [leaving]);

  async function handlePickPhoto() {
    setPhotoError(null);
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    const contentType = resolvePhotoContentType(asset.mimeType, asset.uri);
    if (!contentType) {
      setPhotoError(t('addPet.errorPhotoFormat'));
      return;
    }
    setPhotoAsset({ uri: asset.uri, contentType });
  }

  async function uploadSelectedPhoto(petId: string): Promise<boolean> {
    if (!photoAsset) return true;

    const requested = await requestPhotoUploadUrl(
      baseUrl,
      token ?? '',
      petId,
      photoAsset.contentType,
    );
    if (requested.kind === 'unauthorized') {
      await signOut();
      return false;
    }
    if (requested.kind !== 'ok') return false;

    const assetResponse = await fetch(photoAsset.uri);
    const body = await assetResponse.blob();
    const uploaded = await uploadPhotoToUrl(
      requested.uploadUrl,
      body,
      photoAsset.contentType,
    );
    return uploaded.kind === 'ok';
  }

  function handleContinue() {
    const issues = validateAddPetBasics({ name });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0) return;
    setFormError(null);
    setStep(2);
  }

  async function handleSubmit() {
    setFormError(null);
    const issues = validateAddPet({ name, ageMode, birthDate, approxAgeMonths });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0) return;

    const trimmedName = name.trim();
    const ageInput: Pick<CreatePetInput, 'birthDate' | 'approxAgeMonths'> = ageMode === 'birthDate'
      ? { birthDate: dateToIso(birthDate!) }
      : { approxAgeMonths: Number(approxAgeMonths) };

    const trimmedBreed = breed.trim();
    const trimmedMicrochip = microchip.trim();
    const input: CreatePetInput = {
      name: trimmedName,
      species,
      ...ageInput,
      ...(trimmedBreed ? { breed: trimmedBreed } : {}),
      ...(sex ? { sex } : {}),
      ...(size ? { size } : {}),
      ...(sterilized === null ? {} : { sterilized }),
      ...(trimmedMicrochip ? { microchip: trimmedMicrochip } : {}),
    };

    setSubmitting(true);
    try {
      const wasFirst = pets.data?.kind === 'ok' && pets.data.pets.length === 0;
      const result = await createPet(baseUrl, token ?? '', input);
      switch (result.kind) {
        case 'ok':
          selectPet(result.pet.id);
          if (!(await uploadSelectedPhoto(result.pet.id))) {
            setPhotoError(t('addPet.errorPhotoAfterCreate'));
            return;
          }
          if (wasFirst) {
            setCelebratePetName(result.pet.name);
          } else {
            setLeaving(true);
          }
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'invalid':
          setFormError(t('addPet.checkPetDetails'));
          return;
        case 'forbidden':
          setFormError(t('addPet.youCannotCreatePet'));
          return;
        case 'unreachable':
          setFormError(t('common.cannotReachServer'));
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

  function renderPhotoError() {
    return photoError ? <Text testID="photo-upload-error" className="text-danger">{photoError}</Text> : null;
  }

  function renderStep1() {
    return (
      <>
        <View className="flex-row items-center gap-3.5">
          <Pressable
            testID="add-pet-photo"
            className="size-22 items-center justify-center rounded-full border-2 border-dashed border-accent bg-surface-secondary"
            accessibilityRole="button"
            accessibilityLabel={choosePhotoLabel}
            hitSlop={TOUCH_SLOP}
            disabled={submitting}
            onPress={() => void handlePickPhoto()}
          >
            {photoAsset ? (
              <PetAvatar
                testID="pet-avatar"
                name={name.trim() || t('addPet.pet')}
                photoUrl={photoAsset.uri}
                size={88}
              />
            ) : (
              <>
                <Camera size={26} color={accentStrong} />
                <Text className="text-11 font-extrabold text-accent-strong">{choosePhotoLabel}</Text>
              </>
            )}
          </Pressable>
          <View testID="add-pet-bubble" className="flex-1 rounded-tile bg-surface-secondary px-3 py-2.5" style={CONTINUOUS_CORNER}>
            <View testID="add-pet-bubble-tail" className="absolute -left-1.5 top-5.5 size-3 rotate-45 bg-surface-secondary" />
            <Text testID="add-pet-bubble-text" className="text-13 font-semibold text-foreground">{t('addPet.pingoGreeting')}</Text>
          </View>
        </View>
        {renderPhotoError()}

        <Text className="text-lg font-bold text-foreground">
          {t('addPet.basicDetails')}
        </Text>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.species')}</FieldLabel>
          <SegmentedControl<Species>
            options={[
              { value: 'dog', label: t('addPet.dog'), testID: 'species-dog' },
              { value: 'cat', label: t('addPet.cat'), testID: 'species-cat' },
            ]}
            value={species}
            onSelect={(value) => { if (value !== null) setSpecies(value); }}
          />
        </View>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.name')}</FieldLabel>
          <TextInput
            testID="name-input"
            className="h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground"
            style={CONTINUOUS_CORNER}
            maxLength={120}
            placeholder={t('addPet.petName')}
            placeholderTextColor={muted}
            value={name}
            onChangeText={setName}
          />
          <FieldErrorMessage testID="name-input" issue={fieldErrors.name} />
        </View>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.breed')}</FieldLabel>
          <TextInput
            testID="breed-input"
            className="h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground"
            style={CONTINUOUS_CORNER}
            maxLength={120}
            placeholder={t('addPet.optional')}
            placeholderTextColor={muted}
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.sex')}</FieldLabel>
          <SegmentedControl<Sex>
            options={[
              { value: 'female', label: t('addPet.female'), testID: 'sex-female' },
              { value: 'male', label: t('addPet.male'), testID: 'sex-male' },
            ]}
            value={sex}
            onSelect={setSex}
            allowEmpty
          />
        </View>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.size')}</FieldLabel>
          <SegmentedControl<PetSize>
            options={[
              { value: 'small', label: t('addPet.small'), testID: 'size-small' },
              { value: 'medium', label: t('addPet.medium'), testID: 'size-medium' },
              { value: 'large', label: t('addPet.large'), testID: 'size-large' },
            ]}
            value={size}
            onSelect={setSize}
            allowEmpty
          />
        </View>

        <Button
          testID="add-pet-continue"
          className="h-14 rounded-16 bg-accent" style={chunkyLip.primary}
          onPress={() => handleContinue()}
        >
          <Text className="text-17 font-extrabold text-accent-foreground">{t('addPet.continue')}</Text>
        </Button>
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <Text className="text-lg font-bold text-foreground">
          {t('addPet.medicalDetails')}
        </Text>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.age')}</FieldLabel>
          <View className="flex-row gap-2">
            {([
              ['birthDate', t('addPet.birthDate')],
              ['months', t('addPet.approxMonths')],
            ] as const).map(([value, label]) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: ageMode === value }}
                testID={`age-mode-${value === 'birthDate' ? 'date' : value}`}
                hitSlop={TOUCH_SLOP}
                className={
                  ageMode === value
                    ? 'rounded-full border border-accent bg-accent-soft px-3 py-2'
                    : 'rounded-full border border-border bg-default px-3 py-2'
                }
                onPress={() => setAgeMode(value)}
              >
                <Text className="text-sm font-semibold text-foreground">{label}</Text>
              </Pressable>
            ))}
          </View>
          {ageMode === 'birthDate' ? (
            <Pressable
              accessibilityRole="button"
              testID="birth-date-field"
              className="h-12 flex-row items-center gap-2 rounded-xl border-2 border-transparent bg-default px-3.5"
              style={CONTINUOUS_CORNER}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={18} color={muted} />
              <Text className={`text-15 font-semibold ${birthDate ? 'text-foreground' : 'text-muted'}`}>
                {birthDate
                  ? birthDate.toLocaleDateString(locale)
                  : t('addPet.selectBirthDate')}
              </Text>
            </Pressable>
          ) : (
            <TextInput
              testID="approx-age-input"
              className="h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground"
              style={CONTINUOUS_CORNER}
              inputMode="numeric"
              maxLength={3}
              placeholder={t('addPet.months')}
              placeholderTextColor={muted}
              value={approxAgeMonths}
              onChangeText={setApproxAgeMonths}
            />
          )}
          {ageMode === 'birthDate' && <FieldErrorMessage testID="birth-date-field" issue={fieldErrors.birthDate} />}
          {ageMode === 'months' && <FieldErrorMessage testID="approx-age-input" issue={fieldErrors.approxAgeMonths} />}
        </View>

        {showDatePicker ? (
          <Host>
            <ExpoDateTimePicker
              testID="birth-date-picker"
              mode="date"
              maximumDate={new Date()}
              presentation="dialog"
              value={toPickerValue(birthDate ?? new Date())}
              onDismiss={() => setShowDatePicker(false)}
              onValueChange={(_event, selectedDate) => {
                setBirthDate(fromPickerValue(selectedDate));
                setShowDatePicker(false);
              }}
            />
          </Host>
        ) : null}

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.sterilized')}</FieldLabel>
          <View className="flex-row gap-2">
            <OptionalChip current={sterilized} label={t('addPet.yes')} testID="sterilized-true" value={true} onSelect={setSterilized} />
            <OptionalChip current={sterilized} label={t('addPet.no')} testID="sterilized-false" value={false} onSelect={setSterilized} />
          </View>
        </View>

        <View className="gap-1.5">
          <FieldLabel>{t('addPet.microchip')}</FieldLabel>
          <TextInput
            testID="microchip-input"
            className="h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground"
            style={CONTINUOUS_CORNER}
            maxLength={32}
            placeholder={t('addPet.optional')}
            placeholderTextColor={muted}
            value={microchip}
            onChangeText={setMicrochip}
          />
        </View>

        <Button
          testID="add-pet-submit"
          className="h-14 rounded-16 bg-accent" style={chunkyLip.primary}
          isDisabled={submitting}
          onPress={() => void handleSubmit()}
        >
          <Text className="text-17 font-extrabold text-accent-foreground">
            {t('addPet.savePet')}
          </Text>
        </Button>

        {formError ? (
          <Text testID="add-pet-error" className="text-danger">{formError}</Text>
        ) : null}
        {renderPhotoError()}
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      testID="screen-add-pet"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        key={step}
        testID="add-pet-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          gap: 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text testID="add-pet-title" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">
              {t('addPet.addPet')}
            </Text>
          </View>
          <Text testID="add-pet-step-label" className="text-13 font-extrabold text-muted">
            {t('addPet.stepProgress', { current: step, total: 2 })}
          </Text>
        </View>
        <View testID="add-pet-step-bar" accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: 2, now: step }} className="flex-row gap-1.5">
          <View testID="add-pet-step-segment-1" className="h-1.5 flex-1 rounded-full bg-accent" />
          <View testID="add-pet-step-segment-2" className={step === 2 ? 'h-1.5 flex-1 rounded-full bg-accent' : 'h-1.5 flex-1 rounded-full bg-lip-gray'} />
        </View>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
      {celebratePetName !== null ? (
        <Celebration
          testID="add-pet-celebration"
          title={t('addPet.celebrateTitle', { petName: celebratePetName })}
          body={t('addPet.celebrateBody', { petName: celebratePetName })}
          primary={{
            testID: 'add-pet-celebration-pair',
            label: t('addPet.celebratePair'),
            onPress: () => router.replace('/pairing'),
          }}
          secondary={{
            testID: 'add-pet-celebration-later',
            label: t('addPet.celebrateLater'),
            onPress: () => router.back(),
          }}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}
