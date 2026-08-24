import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { router, type Href } from 'expo-router';
import { Button } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createPet, type CreatePetInput } from '../../api/pets';
import { PetAvatar } from '../../components/pet-avatar';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

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
    <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
      {children}
    </Text>
  );
}

export function AddPetScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
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
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Name is required');
      return;
    }

    let ageInput: Pick<CreatePetInput, 'birthDate' | 'approxAgeMonths'>;
    if (ageMode === 'birthDate') {
      if (!birthDate) {
        setFormError('Choose a birth date');
        return;
      }
      ageInput = { birthDate: dateToIso(birthDate) };
    } else {
      const months = Number(approxAgeMonths);
      if (!/^\d+$/.test(approxAgeMonths) || months < 0 || months > 480) {
        setFormError('Enter an age from 0 to 480 months');
        return;
      }
      ageInput = { approxAgeMonths: months };
    }

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
    setFormError(null);
    try {
      const result = await createPet(baseUrl, token ?? '', input);
      switch (result.kind) {
        case 'ok':
          selectPet(result.pet.id);
          router.replace('/profile' as Href);
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'invalid':
          setFormError('Check the pet details');
          return;
        case 'forbidden':
          setFormError('You cannot create a pet');
          return;
        case 'unreachable':
          setFormError('Cannot reach server');
          return;
        case 'error':
        case 'missing-config':
          setFormError('Something went wrong');
      }
    } catch {
      setFormError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      testID="screen-add-pet"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel="Back to profile"
          accessibilityRole="button"
          testID="add-pet-back"
          className="size-10 items-center justify-center rounded-full bg-default"
          onPress={() => router.back()}
        >
          <Text className="text-lg font-bold text-foreground">←</Text>
        </Pressable>
        <Text className="text-2xl font-black text-foreground">Add pet</Text>
      </View>

      <View className="items-center gap-2">
        <PetAvatar
          name={name.trim() || 'Pet'}
          photoUrl={null}
          size={104}
          testID="pet-avatar"
        />
        <Text className="font-semibold text-muted">Avatar preview</Text>
      </View>

      <Text className="text-lg font-bold text-foreground">Datos básicos</Text>

      <View className="gap-2">
        <FieldLabel>Species</FieldLabel>
        <View className="flex-row gap-2">
          {(['dog', 'cat'] as const).map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: species === value }}
              testID={`species-${value}`}
              className={
                species === value
                  ? 'rounded-full border border-accent bg-accent-soft px-4 py-2'
                  : 'rounded-full border border-border bg-default px-4 py-2'
              }
              onPress={() => setSpecies(value)}
            >
              <Text className="font-semibold text-foreground">
                {value === 'dog' ? 'Dog' : 'Cat'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="gap-2">
        <FieldLabel>Name</FieldLabel>
        <TextInput
          testID="name-input"
          className="rounded-xl border border-border bg-default px-4 py-3 text-foreground"
          maxLength={120}
          placeholder="Pet name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="gap-2">
        <FieldLabel>Breed</FieldLabel>
        <TextInput
          testID="breed-input"
          className="rounded-xl border border-border bg-default px-4 py-3 text-foreground"
          maxLength={120}
          placeholder="Optional"
          value={breed}
          onChangeText={setBreed}
        />
      </View>

      <View className="gap-2">
        <FieldLabel>Sex</FieldLabel>
        <View className="flex-row gap-2">
          <OptionalChip current={sex} label="Female" testID="sex-female" value="female" onSelect={setSex} />
          <OptionalChip current={sex} label="Male" testID="sex-male" value="male" onSelect={setSex} />
        </View>
      </View>

      <View className="gap-2">
        <FieldLabel>Size</FieldLabel>
        <View className="flex-row flex-wrap gap-2">
          <OptionalChip current={size} label="Small" testID="size-small" value="small" onSelect={setSize} />
          <OptionalChip current={size} label="Medium" testID="size-medium" value="medium" onSelect={setSize} />
          <OptionalChip current={size} label="Large" testID="size-large" value="large" onSelect={setSize} />
        </View>
      </View>

      <Text className="text-lg font-bold text-foreground">Datos médicos</Text>

      <View className="gap-2">
        <FieldLabel>Age</FieldLabel>
        <View className="flex-row gap-2">
          {([
            ['birthDate', 'Birth date'],
            ['months', 'Approx. months'],
          ] as const).map(([value, label]) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: ageMode === value }}
              testID={`age-mode-${value === 'birthDate' ? 'date' : value}`}
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
            className="rounded-xl border border-border bg-default px-4 py-3"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className={birthDate ? 'text-foreground' : 'text-muted'}>
              {birthDate ? birthDate.toLocaleDateString() : 'Select a birth date'}
            </Text>
          </Pressable>
        ) : (
          <TextInput
            testID="approx-age-input"
            className="rounded-xl border border-border bg-default px-4 py-3 text-foreground"
            inputMode="numeric"
            maxLength={3}
            placeholder="Months"
            value={approxAgeMonths}
            onChangeText={setApproxAgeMonths}
          />
        )}
      </View>

      {showDatePicker ? (
        <Host>
          <ExpoDateTimePicker
            testID="birth-date-picker"
            mode="date"
            maximumDate={new Date()}
            presentation="dialog"
            value={birthDate ?? new Date()}
            onDismiss={() => setShowDatePicker(false)}
            onValueChange={(_event, selectedDate) => {
              setBirthDate(selectedDate);
              setShowDatePicker(false);
            }}
          />
        </Host>
      ) : null}

      <View className="gap-2">
        <FieldLabel>Sterilized</FieldLabel>
        <View className="flex-row gap-2">
          <OptionalChip current={sterilized} label="Yes" testID="sterilized-true" value={true} onSelect={setSterilized} />
          <OptionalChip current={sterilized} label="No" testID="sterilized-false" value={false} onSelect={setSterilized} />
        </View>
      </View>

      <View className="gap-2">
        <FieldLabel>Microchip</FieldLabel>
        <TextInput
          testID="microchip-input"
          className="rounded-xl border border-border bg-default px-4 py-3 text-foreground"
          maxLength={32}
          placeholder="Optional"
          value={microchip}
          onChangeText={setMicrochip}
        />
      </View>

      <Button
        testID="add-pet-submit"
        className="rounded-xl bg-accent"
        isDisabled={submitting}
        onPress={() => void handleSubmit()}
      >
        <Button.Label className="font-bold text-accent-foreground">
          Save pet
        </Button.Label>
      </Button>

      {formError ? (
        <Text testID="add-pet-error" className="text-danger">{formError}</Text>
      ) : null}
    </ScrollView>
  );
}
