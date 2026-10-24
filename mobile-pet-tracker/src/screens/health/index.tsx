import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronRight, Clock, Syringe } from 'reicon-react-native';

import { listVaccines, listWeights } from '../../api/health-records';
import { listPets, type PetsState } from '../../api/pets';
import { healthKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { PetSwitcher } from '../../components/pet-switcher';
import { RiseIn } from '../../components/rise-in';
import { WeightChart } from '../../components/weight-chart';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { calendarDaysUntil, fmtDate, fmtDayMonthLong } from '../home/format';

const VARIATION_TONE = {
  up: CATEGORY_SLOTS.rose,
  down: CATEGORY_SLOTS.green,
  flat: { surface: 'bg-default', ink: 'text-muted' },
} as const;

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function localTodayIso(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function fmtVariation(variation: number | null): string {
  if (variation === null) return '—';
  return variation > 0 ? `+${variation} kg` : `${variation} kg`;
}

export function HealthScreen() {
  const [warning, muted, rose, amber, green] = useThemeColors([
    'warning', 'muted', 'category-rose-strong', 'category-amber-strong', 'category-green-strong',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const locale = useLocale();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const vaccines = useQuery({
    queryKey: healthKeys.vaccines(selectedPetId ?? ''),
    queryFn: () => listVaccines(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const weight = useQuery({
    queryKey: healthKeys.weights(selectedPetId ?? '', undefined),
    queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const variation = weight.data?.kind === 'ok' ? weight.data.weights[0]?.variation ?? null : null;
  const variationTone = VARIATION_TONE[variation === null || variation === 0 ? 'flat' : variation > 0 ? 'up' : 'down'];
  const today = localTodayIso();
  const nextVaccine =
    vaccines.data?.kind === 'ok'
      ? [...vaccines.data.vaccines]
          .filter(
            ({ nextDoseAt }) => nextDoseAt !== null && nextDoseAt >= today,
          )
          .sort((a, b) =>
            (a.nextDoseAt ?? '').localeCompare(b.nextDoseAt ?? ''),
          )[0]
      : undefined;
  const days = nextVaccine
    ? calendarDaysUntil(nextVaccine.nextDoseAt!, new Date())
    : 0;

  return (
    <ScrollView
      testID="screen-health"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View testID="health-header" className="flex-row items-center justify-between">
        <Text testID="health-title" className="text-3xl font-black tracking-title text-foreground">
          {t('health.health')}
        </Text>
        {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
          <PetSwitcher
            variant="avatars"
            pets={pets.data.pets}
            selectedPetId={selectedPetId}
            onSelect={selectPet}
          />
        ) : null}
      </View>
      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
          <View testID="health-content" style={{ gap: 16 }}>
            {nextVaccine ? (
              <RiseIn delayMs={0}>
                <View testID="next-vaccine-card" className={`flex-row items-center gap-3.5 rounded-24 p-4 ${CATEGORY_SLOTS.amber.surface}`} style={CONTINUOUS_CORNER}>
                  <View className="size-13 items-center justify-center rounded-16 bg-surface" style={CONTINUOUS_CORNER}>
                    <Syringe size={26} strokeWidth={2.2} color={warning} />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className={`text-xs font-extrabold uppercase tracking-caps ${CATEGORY_SLOTS.amber.ink}`}>
                      {t('health.nextDue')}
                    </Text>
                    <Text className="text-lg font-black text-foreground">{nextVaccine.name}</Text>
                    <Text testID="next-vaccine-date" className={`text-13 font-semibold ${CATEGORY_SLOTS.amber.ink}`}>
                      {`${fmtDayMonthLong(nextVaccine.nextDoseAt!, locale)} · ${days === 0 ? t('health.nextDoseToday') : days === 1 ? t('health.nextDoseTomorrow') : t('health.nextDoseInDays', { days })}`}
                    </Text>
                  </View>
                  <Text testID="next-vaccine-days" className={`text-28 font-black ${CATEGORY_SLOTS.amber.ink}`} style={TABULAR_NUMS} accessibilityLabel={days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined}>
                    {days === 0 ? t('home.nextVaccineToday') : t('home.nextVaccineDays', { days })}
                  </Text>
                </View>
              </RiseIn>
            ) : null}

            {selectedPetId ? (
              <View testID="vaccines-section" className="gap-2.5">
                <Text testID="vaccines-title" accessibilityRole="header" className="mt-1 text-lg font-extrabold text-foreground">
                  {t('health.vaccines')}
                </Text>

                {vaccines.data === undefined || vaccines.isRefetching ? (
                  <Card testID="vaccines-skeleton" variant="flat" className="flex-row items-center gap-3 py-3.5">
                    <Skeleton testID="vaccines-skeleton-tile" className="size-10 rounded-xl" />
                    <View className="flex-1 gap-1.5">
                      <Skeleton className="h-3.5 w-1/3 rounded-full" />
                      <Skeleton className="h-2.5 w-2/3 rounded-full" />
                    </View>
                  </Card>
                ) : null}

                {vaccines.data?.kind === 'ok' && vaccines.data.vaccines.length === 0 ? (
                  <Text testID="vaccines-empty" className="text-15 leading-body text-muted">
                    {t('health.noVaccinesYet')}
                  </Text>
                ) : null}

                {vaccines.data?.kind === 'error' ||
                vaccines.data?.kind === 'unreachable' ? (
                  <View className="items-start gap-3">
                    <Text testID="vaccines-error" className="text-15 leading-body text-danger" accessibilityRole="alert">
                      {t('health.couldNotLoadVaccines')}
                    </Text>
                    <Button
                      testID="vaccines-retry"
                      onPress={() => void vaccines.refetch()}
                    >
                      {t('common.retry')}
                    </Button>
                  </View>
                ) : null}

                {vaccines.data?.kind === 'ok'
                  ? vaccines.data.vaccines.map((vaccine, index) => {
                      const slot = vaccine.nextDoseAt !== null && vaccine.nextDoseAt < today
                        ? 'rose'
                        : vaccine.id === nextVaccine?.id ? 'amber' : 'green';
                      const Icon = slot === 'green' ? Check : Clock;
                      const color = slot === 'rose' ? rose : slot === 'amber' ? amber : green;
                      return (
                      <RiseIn key={vaccine.id} delayMs={80 + 60 * Math.min(index, 2)}>
                      <Card
                        variant="flat"
                        testID={`vaccine-row-${vaccine.id}`}
                        className="flex-row items-center gap-3 py-3.5"
                      >
                        <View
                          testID={`vaccine-tile-${vaccine.id}`}
                          className={`size-10 items-center justify-center rounded-xl ${CATEGORY_SLOTS[slot].surface}`}
                          style={CONTINUOUS_CORNER}
                          accessibilityElementsHidden
                          importantForAccessibility="no-hide-descendants"
                        >
                          <Icon size={20} color={color} />
                        </View>
                        <View testID={`vaccine-text-${vaccine.id}`} className="flex-1 gap-1">
                        <Text className="text-15 font-extrabold text-foreground">
                          {vaccine.name}
                        </Text>
                        <Text testID={`vaccine-dates-${vaccine.id}`} className="text-xs text-muted">
                          {t('health.appliedOn', { date: fmtDate(vaccine.appliedAt, locale) })}
                          {vaccine.nextDoseAt ? (
                            <>
                              {' · '}
                              <Text className={vaccine.nextDoseAt < today ? 'text-danger' : undefined}>
                                {t('health.nextOn', { date: fmtDate(vaccine.nextDoseAt, locale) })}
                              </Text>
                            </>
                          ) : null}
                        </Text>
                        </View>
                      </Card>
                      </RiseIn>
                      );
                    })
                  : null}
              </View>
            ) : null}

            {selectedPetId ? (
              <RiseIn delayMs={260}>
              <View testID="weight-card" className="gap-3 rounded-24 bg-surface-secondary p-4" style={CONTINUOUS_CORNER}>
                <View className="flex-row items-end justify-between">
                  <View className="gap-0.5">
                    <Text testID="weight-card-title" className="text-13 font-bold text-muted">
                      {t('health.weight')}
                    </Text>
                    {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
                      <Text testID="weight-current" className="text-3xl font-black text-foreground" style={TABULAR_NUMS}>
                        {weight.data.weights[0].weightKg} kg
                      </Text>
                    ) : null}
                  </View>
                  {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
                    <View testID="weight-variation" className={`rounded-full px-2.5 py-1 ${variationTone.surface}`}>
                      <Text className={`text-13 font-extrabold ${variationTone.ink}`} style={TABULAR_NUMS}>
                        {fmtVariation(variation)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
                  <WeightChart entries={weight.data.weights} variant="mini" />
                ) : null}

                {weight.data?.kind === 'ok' && weight.data.weights.length === 0 ? (
                  <Text testID="weight-card-empty" className="text-15 leading-body text-muted">
                    {t('health.noWeightEntriesYet')}
                  </Text>
                ) : null}

                {weight.data?.kind === 'error' || weight.data?.kind === 'unreachable' ? (
                  <Text testID="weight-card-error" className="text-15 leading-body text-danger" accessibilityRole="alert">
                    {t('health.couldNotLoadWeight')}
                  </Text>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  testID="weight-log-link"
                  hitSlop={TOUCH_SLOP}
                  className="flex-row items-center justify-between rounded-14 bg-surface px-3.5 py-3"
                  style={CONTINUOUS_CORNER}
                  onPress={() => router.push('/weight-log')}
                >
                  <Text className="text-15 font-bold text-foreground">
                    {t('health.weightLog')}
                  </Text>
                  <ChevronRight size={18} color={muted} />
                </Pressable>
              </View>
              </RiseIn>
            ) : null}
          </View>
      ) : (
        <View
          testID="health-states"
          style={{ gap: 16 }}
        >
          {pets.data === undefined ? (
            <View testID="health-loading" className="flex-row gap-2.5">
              {[0, 1].map(index => <Skeleton key={index} testID={`health-loading-${index}`} className="size-10 rounded-full" />)}
            </View>
          ) : null}

          {pets.data && isPetsError(pets.data) ? (
            <View className="items-start gap-3">
              <Text testID="health-error" className="text-15 leading-body text-danger" accessibilityRole="alert">
                {t('common.somethingWentWrong')}
              </Text>
              <Button
                testID="health-retry"
                onPress={() => void pets.refetch()}
              >
                {t('common.retry')}
              </Button>
            </View>
          ) : null}

          {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
            <EmptyState
              testID="health-empty"
              pose="talk"
              title={t('common.noPetsYet')}
              body={t('common.noPetsBody')}
              action={{
                label: t('profile.addPet'),
                onPress: () => router.push('/pets/add'),
              }}
            />
          ) : null}

        </View>
      )}
    </ScrollView>
  );
}
