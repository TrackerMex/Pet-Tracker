import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'reicon-react-native';

import { getMealsHistory } from '../../api/nutrition';
import { nutritionKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { TABULAR_NUMS } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  currentMonth, longDayLabel, monthGrid, monthOf, monthRange,
  monthTitle, shiftMonth, weekdayHeaders,
} from '../../utils/month-grid';

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
      className={`h-11 flex-1 items-center justify-center rounded-full${selected ? ' bg-accent-soft' : ''}`}
      disabled={disabled}
      onPress={onPress}
      accessibilityState={{ disabled, selected }}
      accessibilityRole="button"
      accessibilityLabel={longDayLabel(date, locale)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {date === today ? (
        <DayNumber testID="meals-history-today" date={date} className="text-sm font-bold text-accent-strong" />
      ) : (
        <DayNumber date={date} className={disabled ? 'text-sm font-semibold text-muted' : 'text-sm font-semibold text-foreground'} />
      )}
      {mealTimes.length >= 1 ? (
        <View testID="meals-history-dot" className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
      ) : null}
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
          <Card className="gap-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                testID="meals-history-prev"
                onPress={() => {
                  setVisibleMonth(shiftMonth(visibleMonth, -1));
                  setSelectedDay(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={t('mealsHistory.previousMonth')}
                className="h-11 w-11 items-center justify-center rounded-full"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <ChevronLeft size={20} color={foreground} />
              </Pressable>
              <Text testID="meals-history-title" className="text-base font-bold text-foreground">
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
                className="h-11 w-11 items-center justify-center rounded-full"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <ChevronRight size={20} color={nextDisabled ? muted : foreground} />
              </Pressable>
            </View>
            <View testID="meals-history-weekdays" className="flex-row">
              {weekdayHeaders(locale).map(day => (
                <Text key={day} className="flex-1 text-center text-xs font-normal text-muted">{day}</Text>
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
            {selectedDay !== null ? (
              <View testID="meals-history-detail" className="gap-2">
                <Text testID="meals-history-detail-title" className="text-base font-bold text-foreground">
                  {longDayLabel(selectedDay, locale)}
                </Text>
                {selectedTimes.length === 0 ? (
                  <Text testID="meals-history-detail-empty" className="text-sm text-muted">
                    {t('mealsHistory.noMealsOnDay')}
                  </Text>
                ) : (
                  <>
                    {selectedTimes.map(time => (
                      <Text key={time} testID="meals-history-detail-time" selectable style={TABULAR_NUMS} className="text-sm font-semibold text-foreground">
                        {time}
                      </Text>
                    ))}
                    <Text testID="meals-history-detail-count" className="text-xs font-normal text-muted">
                      {selectedTimes.length === 1 ? t('mealsHistory.servedOne') : t('mealsHistory.servedMany', { count: selectedTimes.length })}
                    </Text>
                  </>
                )}
              </View>
            ) : data.history.days.every(day => day.mealTimes.length === 0) ? (
              <Text testID="meals-history-empty" className="text-sm text-muted">
                {t('mealsHistory.emptyMonth')}
              </Text>
            ) : null}
          </Card>
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
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    >
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
