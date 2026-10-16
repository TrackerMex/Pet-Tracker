import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'reicon-react-native';

import { getMealsHistory } from '../../api/nutrition';
import { nutritionKeys } from '../../api/query-keys';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  currentMonth, longDayLabel, monthGrid, monthOf, monthRange,
  monthTitle, shiftMonth, weekdayHeaders,
} from '../../utils/month-grid';
import { HomeEntrance } from '../home/home-entrance';

function DayNumber({ date, testID, className }: { date: string; testID?: string; className: string }) {
  return (
    <Text testID={testID} style={TABULAR_NUMS} className={className}>
      {Number(date.slice(8))}
    </Text>
  );
}

function DayCell({ date, today, mealTimes, selected, locale, onPress }: {
  date: string; today: string; mealTimes: string[]; selected: boolean; locale: string; onPress: () => void;
}) {
  const disabled = date > today;
  return (
    <Pressable
      testID={`meals-history-day-${date}`}
      className={`h-11 flex-1 items-center justify-center gap-0.5 rounded-full${selected ? ' bg-tab-pill' : ''}`}
      disabled={disabled}
      onPress={onPress}
      accessibilityState={{ disabled, selected }}
      accessibilityRole="button"
      accessibilityLabel={longDayLabel(date, locale)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {date === today ? (
        <DayNumber testID="meals-history-today" date={date} className="text-15 font-black text-accent-strong" />
      ) : (
        <DayNumber date={date} className={selected ? 'text-15 font-black text-accent-strong' : disabled ? 'text-15 font-medium text-muted' : 'text-15 font-semibold text-foreground'} />
      )}
      {mealTimes.length >= 1 ? (
        <View testID="meals-history-dot" className="size-1.25 rounded-full bg-accent" />
      ) : (
        <View testID="meals-history-spacer" className="size-1.25" />
      )}
    </Pressable>
  );
}

function MealsHistoryContent({ petId }: { petId: string }) {
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const locale = useLocale();
  const [foreground, muted] = useThemeColors(['foreground', 'muted']);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const [visibleMonth, setVisibleMonth] = useState(() => currentMonth(new Date()));
  const { from, to } = monthRange(visibleMonth);
  const cells = monthGrid(visibleMonth);
  const { data, refetch } = useQuery({
    queryKey: nutritionKeys.mealsHistory(petId, from, to),
    queryFn: async () => {
      const result = await getMealsHistory(process.env.EXPO_PUBLIC_API_URL, token ?? '', petId, from, to);
      switch (result.kind) {
        case 'unauthorized':
          await signOut();
      }
      return result;
    },
    placeholderData: keepPreviousData,
  });

  const capMonth = data?.kind === 'ok' ? monthOf(data.history.today) : currentMonth(new Date());
  const nextDisabled = visibleMonth >= capMonth;

  let content;
  if (data === undefined) {
    content = <Skeleton testID="meals-history-skeleton" className="h-80 w-full rounded-card" />;
  } else {
    switch (data.kind) {
      case 'unauthorized':
        content = null;
        break;
      case 'error':
      case 'unreachable':
      case 'not-found':
      case 'missing-config':
        content = (
          <View className="items-start gap-3">
            <Text testID="meals-history-error" className="text-danger">
              {t('common.somethingWentWrong')}
            </Text>
            <Button testID="meals-history-retry" onPress={() => refetch()}>
              {t('common.retry')}
            </Button>
          </View>
        );
        break;
      case 'ok': {
        const selectedTimes = data.history.days.find(day => day.date === selectedDay)?.mealTimes ?? [];
        content = (
          <>
            <HomeEntrance testID="meals-history-calendar-entry" index={0}>
              <View testID="meals-history-calendar" className="gap-2 rounded-24 border border-border bg-surface p-3.5" style={CONTINUOUS_CORNER}>
                <View className="flex-row items-center justify-between">
                  <Pressable
                    testID="meals-history-prev"
                    onPress={() => {
                      setVisibleMonth(shiftMonth(visibleMonth, -1));
                      setSelectedDay(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t('mealsHistory.previousMonth')}
                    className="size-10 items-center justify-center rounded-xl bg-default"
                    hitSlop={TOUCH_SLOP}
                    style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.7 : 1 })}
                  >
                    <ChevronLeft size={18} color={foreground} />
                  </Pressable>
                  <Text testID="meals-history-title" className="text-base font-extrabold text-foreground">
                    {monthTitle(visibleMonth, locale)}
                  </Text>
                  <Pressable
                    testID="meals-history-next"
                    disabled={nextDisabled}
                    accessibilityState={{ disabled: nextDisabled }}
                    onPress={() => {
                      setVisibleMonth(shiftMonth(visibleMonth, 1));
                      setSelectedDay(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t('mealsHistory.nextMonth')}
                    className="size-10 items-center justify-center rounded-xl bg-default"
                    hitSlop={TOUCH_SLOP}
                    style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.7 : 1 })}
                  >
                    <ChevronRight size={18} color={nextDisabled ? muted : foreground} />
                  </Pressable>
                </View>
                <View testID="meals-history-weekdays" className="flex-row">
                  {weekdayHeaders(locale).map((day, index) => (
                    <Text key={index} className="flex-1 text-center text-xs font-bold text-muted">{day}</Text>
                  ))}
                </View>
                <View testID="meals-history-grid" className="gap-1">
                  {Array.from({ length: cells.length / 7 }, (_, row) => (
                    <View key={row} className="flex-row">
                      {cells.slice(row * 7, row * 7 + 7).map((date, column) => date === null ? (
                        <View key={column} testID="meals-history-filler" className="h-11 flex-1" />
                      ) : (
                        <DayCell
                          key={date}
                          onPress={() => setSelectedDay(current => current === date ? null : date)}
                          date={date}
                          today={data.history.today}
                          locale={locale}
                          selected={date === selectedDay}
                          mealTimes={data.history.days.find(day => day.date === date)?.mealTimes ?? []}
                        />
                      ))}
                    </View>
                  ))}
                </View>
                {selectedDay === null && data.history.days.every(day => day.mealTimes.length === 0) ? (
                  <Text testID="meals-history-empty" className="text-sm text-muted">
                    {t('mealsHistory.emptyMonth')}
                  </Text>
                ) : null}
              </View>
            </HomeEntrance>
            {selectedDay !== null ? (
              <HomeEntrance testID="meals-history-detail-entry" index={1}>
                <View testID="meals-history-detail" className="gap-2.5 rounded-24 bg-surface-secondary p-4" style={CONTINUOUS_CORNER}>
                  <View className="flex-row items-center justify-between gap-2">
                    <Text testID="meals-history-detail-title" className="flex-1 text-base font-extrabold text-foreground">
                      {longDayLabel(selectedDay, locale)}
                    </Text>
                    {selectedTimes.length > 0 ? (
                      <Text testID="meals-history-detail-count" className="rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-accent-foreground">
                        {selectedTimes.length === 1 ? t('mealsHistory.servedOne') : t('mealsHistory.servedMany', { count: selectedTimes.length })}
                      </Text>
                    ) : null}
                  </View>
                  {selectedTimes.length === 0 ? (
                    <Text testID="meals-history-detail-empty" className="text-sm text-muted">
                      {t('mealsHistory.noMealsOnDay')}
                    </Text>
                  ) : (
                    <View testID="meals-history-detail-times" className="flex-row flex-wrap gap-2">
                      {selectedTimes.map(time => (
                        <View key={time} className="min-w-20 flex-1 items-center rounded-14 bg-surface p-2.5" style={CONTINUOUS_CORNER}>
                          <Text testID="meals-history-detail-time" selectable style={TABULAR_NUMS} className="text-15 font-extrabold text-foreground">
                            {time}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </HomeEntrance>
            ) : null}
          </>
        );
        break;
      }
    }
  }

  return (
    <ScrollView
      testID="screen-meals-history"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: insets.bottom + 24 }}
    >
      <Text testID="meals-history-heading" accessibilityRole="header" className="text-2xl font-black tracking-title text-foreground">
        {t('mealsHistory.mealsHistory')}
      </Text>
      {content}
    </ScrollView>
  );
}

export function MealsHistoryScreen() {
  const { selectedPetId } = useSelectedPet();
  if (selectedPetId === null) {
    return <Redirect href="/food" />;
  }
  return <MealsHistoryContent petId={selectedPetId} />;
}
