import { useState } from 'react';
import { Plus } from 'reicon-react-native';
import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPets } from '../../api/pets';
import { healthKeys, petKeys, userKeys } from '../../api/query-keys';
import { getVaccineCatalog } from '../../api/health-records';
import { useChunkyLip } from '../../theme/chunky-lip';
import { useThemeColors } from '../../theme/use-theme-colors';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';
import { FieldErrorMessage } from '../../components/field-error-message';
import type { FieldIssues } from '../../utils/account-rules';
import { getMe } from '../../api/users';
import { DateField } from '../../components/date-field';
import { civilTodayIso } from '../../utils/civil-today-iso';
import { addCalendarMonthsIso } from '../../utils/vaccine-dates';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export function VaccineCreateScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const pets = useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') });
  const pet = pets.data?.kind === 'ok' ? pets.data.pets.find(p => p.id === petId) : undefined;
  const species = pet?.species === 'cat' ? 'cat' : 'dog';
  const chunkyLip = useChunkyLip();
  const [accentStrong, accentForeground, muted, danger, foreground] = useThemeColors(['accent-strong', 'accent-foreground', 'muted', 'danger', 'foreground']);
  const catalog = useQuery({ queryKey: healthKeys.vaccineCatalog(species), queryFn: () => getVaccineCatalog(baseUrl, token ?? '', species), enabled: pet !== undefined });
  const entries = catalog.data?.kind === 'ok' ? catalog.data.entries : [];
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const selectedId = selectedDraft ?? entries[0]?.id ?? 'other';
  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'name' | 'appliedAt'>>({});
  const me = useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') });
  const profileTimeZone = me.data?.kind === 'ok' ? me.data.me.timezone : undefined;
  const [now] = useState(() => new Date());
  const today = civilTodayIso(profileTimeZone, now);
  const [appliedDraft, setAppliedDraft] = useState<string | null>(null);
  const appliedAt = appliedDraft ?? today;
  const entry = entries.find(item => item.id === selectedId);
  const [nextDoseDraft, setNextDoseDraft] = useState<string | null | undefined>(undefined);
  const nextDoseAt = nextDoseDraft === undefined ? (entry ? addCalendarMonthsIso(appliedAt, entry.scheme.boosterMonths) : null) : nextDoseDraft;

  function selectVaccine(id: string) {
    setSelectedDraft(id);
    setNextDoseDraft(undefined);
  }
  function changeApplied(next: string | null) {
    if (next === null) return;
    setAppliedDraft(next);
    if (nextDoseAt !== null && nextDoseAt < next) setNextDoseDraft(undefined);
  }



  return (
    <KeyboardAvoidingView testID="screen-vaccine-create" behavior="padding" className="flex-1 bg-background">
      <ScrollView testID="vaccine-create-form" className="flex-1" keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 24, gap: 16 }}>
        <ScreenHeader testID="vaccine-create-header" size={24} backFallback="/health" title={t('vaccineCreate.title')} />
        <Text testID="vaccine-create-legend" className="text-sm font-extrabold text-foreground">
          {t('vaccineCreate.vaccine')}<Text testID="vaccine-create-legend-species" className="font-semibold text-muted">{species === 'cat' ? t('vaccineCreate.schemeForCat') : t('vaccineCreate.schemeForDog')}</Text>
        </Text>
        {catalog.isPending ? (
          <View testID="vaccine-create-chips-skeleton" className="flex-row gap-2">
            {[0, 1, 2].map(index => <Skeleton key={index} className="h-9.5 w-28 rounded-full" />)}
          </View>
        ) : (
          <View testID="vaccine-create-chips" className="flex-row flex-wrap gap-2">
            {[...entries, { id: 'other', name: t('vaccineCreate.otherVaccine') }].map(option => {
              const selected = selectedId === option.id;
              const other = option.id === 'other';
              return (
                <Pressable key={option.id} testID={`vaccine-chip-${option.id}`} accessibilityRole="button" accessibilityState={{ selected }} hitSlop={TOUCH_SLOP}
                  onPress={() => selectVaccine(option.id)}
                  className={selected ? 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent' : other ? 'h-9.5 flex-row items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-3.5 bg-surface' : 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default'}
                  style={selected ? chunkyLip.primaryCompact : undefined}>
                  {other && <Plus size={16} strokeWidth={2.8} color={selected ? accentForeground : foreground} />}
                  <Text className={selected ? 'text-sm font-extrabold text-accent-foreground' : 'text-sm font-extrabold text-foreground'}>{option.name}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
        {!catalog.isPending && selectedId === 'other' && <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-foreground">{t('vaccineCreate.vaccineName')}</Text>
            <Text testID="vaccine-create-name-count" className="text-xs font-semibold text-muted" style={TABULAR_NUMS}>{`${name.length}/120`}</Text>
          </View>
          <TextInput testID="vaccine-create-name" value={name} onChangeText={setName} maxLength={120} onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)}
            className={`h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 ${nameFocused ? 'border-accent' : 'border-transparent'}`} style={CONTINUOUS_CORNER} />
          <FieldErrorMessage testID="vaccine-create-name" issue={fieldErrors.name} />
        </View>}
        <View testID="vaccine-create-dates" className="flex-row gap-2.5">
          <View className="flex-1">
            <DateField testID="vaccine-create-applied" label={t('vaccineCreate.appliedAt')} value={appliedAt} maxDate={today} onChange={changeApplied} isInvalid={Boolean(fieldErrors.appliedAt)} />
            <FieldErrorMessage testID="vaccine-create-applied" issue={fieldErrors.appliedAt} />
          </View>
          <View className="flex-1">
            <DateField testID="vaccine-create-next" label={t('vaccineCreate.nextDose')} value={nextDoseAt} minDate={appliedAt} onChange={setNextDoseDraft} allowClear={!entry} />
          </View>
        </View>
      </ScrollView>
      <View testID="vaccine-create-bar" style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
        <Button testID="vaccine-create-submit" />
      </View>
    </KeyboardAvoidingView>
  );
}
