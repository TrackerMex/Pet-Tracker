import { useEffect, useRef, useState, type JSX } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import {
  BarChart,
  type BarChartRenderBarProps,
  type BarChartSelectEvent,
} from 'react-native-chart-kit/v2';
import Animated, {
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Line, Rect } from 'react-native-svg';
import { Check, TrendDown, TrendUp } from 'reicon-react-native';

import type { DayEntry, WeekComparison } from '../../api/types';
import { Card } from '../../components/card';
import {
  useLocale,
  useTranslate,
} from '../../providers/language-provider';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { fmtCount, fmtKm, fmtMinutes } from './format';

// react-native-chart-kit 7.0.4 geometry contract (re-derive on upgrade):
// base padding: 18, 14, 12, 10; label gap: 8; text width factor: 0.56;
// measured label height: 14; band padding: 0.12, 0.08.
export const CHART_PAD_LEFT = 40.4;
export const CHART_PAD_RIGHT = 14;
export const CHART_PAD_TOP = 18;
export const CHART_PAD_BOTTOM = 34;
export const CHART_PLOT_HEIGHT = 160;
export const CHART_AXIS_LABEL_SIZE = 10;
export const Y_LABEL_CHARS = 4;
export const BAR_ENTRY_DURATION_MS = 250;
export const BAR_ENTRY_STAGGER_MS = 40;
export const BAR_MIN_HEIGHT = 3;
const METRIC_TAB_SPRING = {
  duration: BAR_ENTRY_DURATION_MS,
  dampingRatio: 1,
  reduceMotion: ReduceMotion.System,
} as const;

const TOOLTIP_WIDTH = 120;
const METRIC_LABEL_MIN_FONT_SCALE = 0.85;
const METRIC_LABEL_MAX_FONT_SIZE_MULTIPLIER = 1.2;

const CHART_HEIGHT =
  CHART_PAD_TOP + CHART_PLOT_HEIGHT + CHART_PAD_BOTTOM;

export type WeeklyMetric = 'activeMinutes' | 'distanceM' | 'walkCount';

export const WEEKLY_METRICS: readonly WeeklyMetric[] = [
  'activeMinutes',
  'distanceM',
  'walkCount',
];

export interface WeeklyActivityChartProps {
  days: DayEntry[];
  weekComparison: WeekComparison;
  onSelectDay?: (day: DayEntry) => void;
}

interface ChartDatum {
  date: string;
  value: number | null;
  day: DayEntry;
}

interface DaySelection {
  dataIndex: number;
  tooltipX: number;
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedView = Animated.createAnimatedComponent(View);

function ActivityBar({
  bar,
  fill,
  average,
  averageColor,
  chartWidth,
  drawAverage,
}: BarChartRenderBarProps<ChartDatum> & {
  average: number | null;
  averageColor: string;
  chartWidth: number;
  drawAverage: boolean;
}): JSX.Element {
  const reduceMotion = useReducedMotion();
  const height = Math.max(bar.height, BAR_MIN_HEIGHT);
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const averageY =
    average === null || bar.value === 0
      ? null
      : bar.baselineY - average * (bar.height / bar.value);
  const animatedProps = useAnimatedProps(() => ({
    y: bar.baselineY - height * progress.value,
    height: height * progress.value,
  }));

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = 0;
    progress.value = withDelay(
      bar.dataIndex * BAR_ENTRY_STAGGER_MS,
      withTiming(1, { duration: BAR_ENTRY_DURATION_MS }),
    );
  }, [bar.dataIndex, bar.value, height, progress, reduceMotion]);

  return (
    <>
      {drawAverage && averageY !== null ? (
        <Line
          testID="weekly-activity-average"
          x1={CHART_PAD_LEFT}
          x2={chartWidth - CHART_PAD_RIGHT}
          y1={averageY}
          y2={averageY}
          stroke={averageColor}
          strokeDasharray="4 4"
        />
      ) : null}
      {reduceMotion ? (
        <Rect
          key={bar.key}
          testID={`weekly-activity-bar-${bar.raw?.date}`}
          x={bar.x}
          y={bar.baselineY - height}
          width={bar.width}
          height={height}
          rx={Math.min(bar.width, height) / 2}
          fill={fill}
        />
      ) : (
        <AnimatedRect
          key={bar.key}
          testID={`weekly-activity-bar-${bar.raw?.date}`}
          animatedProps={animatedProps}
          x={bar.x}
          width={bar.width}
          rx={Math.min(bar.width, height) / 2}
          fill={fill}
        />
      )}
    </>
  );
}

function formatAxisLabel(value: number): string {
  return String(value).slice(0, Y_LABEL_CHARS).padStart(Y_LABEL_CHARS, ' ');
}

function metricValue(day: DayEntry, metric: WeeklyMetric): number | null {
  return day[metric];
}

function formatMetricValue(
  metric: WeeklyMetric,
  value: number | null,
): string {
  if (metric === 'distanceM') return fmtKm(value);
  if (metric === 'walkCount') return fmtCount(value);
  return fmtMinutes(value);
}

function dayAccessibilityLabel(
  day: DayEntry,
  metric: WeeklyMetric,
  locale: string,
  t: ReturnType<typeof useTranslate>,
): string {
  const dayName = weekdayLabel(day.date, locale, 'long');

  if (day.source === 'missing') {
    return t('weeklyActivity.dayLabelMissing', { day: dayName });
  }

  const value = metricValue(day, metric);

  if (metric === 'distanceM') {
    return t('weeklyActivity.dayLabelDistance', {
      day: dayName,
      value: fmtKm(value),
    });
  }
  if (metric === 'walkCount') {
    return t('weeklyActivity.dayLabelWalks', {
      day: dayName,
      value: fmtCount(value),
    });
  }
  return t('weeklyActivity.dayLabelActiveMinutes', {
    day: dayName,
    value: value ?? '—',
  });
}

function formatTrendPercent(value: number, locale: string): string {
  const formatted = new Intl.NumberFormat(locale, {
    signDisplay: 'exceptZero',
    maximumFractionDigits: 1,
  }).format(value);

  return locale.startsWith('es') ? formatted.replace('.', ',') : formatted;
}

function DetailMetric({
  label,
  testID,
  value,
}: {
  label: string;
  testID: string;
  value: string;
}): JSX.Element {
  return (
    <View className="flex-1 gap-1">
      <Text className="text-2xs text-muted">{label}</Text>
      <Text
        testID={testID}
        className="text-sm font-semibold text-foreground"
        style={TABULAR_NUMS}
      >
        {value}
      </Text>
    </View>
  );
}

function MetricSelector({
  accentStrong,
  labels,
  selectedIndex,
  onSelect,
}: {
  accentStrong: string;
  labels: readonly string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}): JSX.Element {
  const [layouts, setLayouts] = useState<
    Partial<Record<WeeklyMetric, { x: number; width: number }>>
  >({});
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const selectedMetric =
    WEEKLY_METRICS[selectedIndex] ?? WEEKLY_METRICS[0];
  const selectedLayout = layouts[selectedMetric];
  const selectedX = selectedLayout?.x;
  const selectedWidth = selectedLayout?.width;
  const lastPositionedMetric = useRef(selectedMetric);
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.get(),
    transform: [{ translateX: indicatorX.get() }],
  }));

  useEffect(() => {
    if (selectedX === undefined || selectedWidth === undefined) return;

    if (
      lastPositionedMetric.current === selectedMetric ||
      indicatorWidth.get() <= 0
    ) {
      indicatorX.set(selectedX);
      indicatorWidth.set(selectedWidth);
      lastPositionedMetric.current = selectedMetric;
      return;
    }

    lastPositionedMetric.current = selectedMetric;
    indicatorX.set(withSpring(selectedX, METRIC_TAB_SPRING));
    indicatorWidth.set(withSpring(selectedWidth, METRIC_TAB_SPRING));
  }, [
    indicatorWidth,
    indicatorX,
    selectedMetric,
    selectedWidth,
    selectedX,
  ]);

  const handleTabLayout = (
    metric: WeeklyMetric,
    event: LayoutChangeEvent,
  ) => {
    const { x, width } = event.nativeEvent.layout;

    if (width <= 0) return;

    setLayouts((current) => {
      const previous = current[metric];

      if (previous?.x === x && previous.width === width) return current;

      return { ...current, [metric]: { x, width } };
    });
  };

  return (
    <View
      testID="weekly-activity-metric"
      className="relative flex-row gap-1 overflow-hidden rounded-full border border-border bg-default p-1"
    >
      {selectedLayout ? (
        <AnimatedView
          testID="weekly-activity-metric-indicator"
          pointerEvents="none"
          className="absolute bottom-1 top-1 rounded-full bg-tab-pill"
          style={indicatorAnimatedStyle}
        />
      ) : null}
      {WEEKLY_METRICS.map((metric, index) => {
        const label = labels[index] ?? '';
        const selected = selectedIndex === index;

        return (
          <Pressable
            key={metric}
            testID={`weekly-activity-metric-${metric}`}
            accessible
            accessibilityLabel={label}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className="z-10 h-11 shrink flex-row items-center justify-center gap-0.5 px-0.5"
            style={({ pressed }) => [
              {
                flexBasis: 0,
                flexGrow: label.length,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onLayout={(event) => handleTabLayout(metric, event)}
            onPress={() => onSelect(index)}
          >
            {selected ? (
              <Check
                testID="weekly-activity-metric-selected"
                accessible={false}
                size={12}
                color={accentStrong}
              />
            ) : null}
            <Text
              testID={`weekly-activity-metric-label-${metric}`}
              className={
                selected
                  ? 'shrink text-xs font-semibold text-accent-strong'
                  : 'shrink text-xs font-semibold text-foreground'
              }
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}
              maxFontSizeMultiplier={METRIC_LABEL_MAX_FONT_SIZE_MULTIPLIER}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function weekdayLabel(
  date: string,
  locale: string,
  style: 'short' | 'long',
): string {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    weekday: style,
  });
}

export function WeeklyActivityChart(
  { days, weekComparison, onSelectDay }: WeeklyActivityChartProps,
): JSX.Element {
  const locale = useLocale();
  const t = useTranslate();
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [selection, setSelection] = useState<DaySelection | null>(null);
  const selectedMetric =
    WEEKLY_METRICS[selectedMetricIndex] ?? WEEKLY_METRICS[0];
  const metricLabels = [
    t('weeklyActivity.metricActiveMinutes'),
    t('weeklyActivity.metricDistance'),
    t('weeklyActivity.metricWalks'),
  ];
  const selectedMetricLabel =
    metricLabels[selectedMetricIndex] ?? metricLabels[0];
  const [accentStrong, muted, border, foreground, surface] = useThemeColors([
    'accent-strong',
    'muted',
    'border',
    'foreground',
    'surface',
  ]);
  const chartData = days.map((day) => ({
    date: day.date,
    value:
      day.source === 'missing' ? null : metricValue(day, selectedMetric),
    day,
  }));
  const measuredValues = chartData.flatMap(({ day, value }) =>
    day.source !== 'missing' && typeof value === 'number' ? [value] : [],
  );
  const hasPositiveValue = measuredValues.some((value) => value > 0);
  const average = hasPositiveValue
    ? measuredValues.reduce((sum, value) => sum + value, 0) /
      measuredValues.length
    : null;
  const averageAnchorIndex = chartData.findIndex(
    ({ day, value }) =>
      day.source !== 'missing' && typeof value === 'number' && value > 0,
  );
  const hasMeasuredDay = days.some((day) => day.source !== 'missing');
  const trend = weekComparison[selectedMetric];
  const selectedDay =
    selection === null ? undefined : days[selection.dataIndex];
  const selectedDatum =
    selection === null ? undefined : chartData[selection.dataIndex];
  const tooltipLeft =
    selection === null
      ? 0
      : Math.max(
          0,
          Math.min(
            selection.tooltipX - TOOLTIP_WIDTH / 2,
            Math.max(0, chartWidth - TOOLTIP_WIDTH),
          ),
        );
  const selectedBar =
    selection !== null && typeof selectedDatum?.value === 'number'
      ? { dataIndex: selection.dataIndex, seriesKey: 'value' }
      : undefined;
  const handleChartLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };
  const selectDay = (dataIndex: number, tooltipX: number) => {
    const day = days[dataIndex];

    if (day === undefined) return;

    setSelection({ dataIndex, tooltipX });
    onSelectDay?.(day);
  };
  const handleBarSelect = (event: BarChartSelectEvent<ChartDatum>) => {
    selectDay(event.dataIndex, event.position.x);
  };
  const handleColumnPress = (dataIndex: number) => {
    const plotWidth = Math.max(
      0,
      chartWidth - CHART_PAD_LEFT - CHART_PAD_RIGHT,
    );
    const columnWidth = days.length === 0 ? 0 : plotWidth / days.length;

    selectDay(
      dataIndex,
      CHART_PAD_LEFT + columnWidth * (dataIndex + 0.5),
    );
  };

  return (
    <Card testID="weekly-activity-card" className="gap-2">
      <View
        testID="weekly-activity-header"
        className="flex-row items-start justify-between gap-3"
      >
        <View>
          <Text className="text-base font-bold text-foreground">
            {t('weeklyActivity.title')}
          </Text>
          <Text className="text-2xs text-muted">
            {t('weeklyActivity.lastSevenDays')}
          </Text>
        </View>
        {average !== null ? (
          <Text
            testID="weekly-activity-average-label"
            className="text-xs text-muted"
            style={TABULAR_NUMS}
          >
            {t('weeklyActivity.average', {
              value: formatMetricValue(selectedMetric, average),
            })}
          </Text>
        ) : null}
      </View>
      {hasMeasuredDay ? (
        <>
          <MetricSelector
            labels={metricLabels}
            selectedIndex={selectedMetricIndex}
            accentStrong={accentStrong}
            onSelect={setSelectedMetricIndex}
          />
          {trend !== null ? (
            <View
              testID="weekly-activity-trend"
              className="flex-row items-center gap-1 text-muted"
            >
              {trend > 0 ? (
                <TrendUp
                  testID="weekly-activity-trend-up"
                  size={16}
                  color={muted}
                />
              ) : null}
              {trend < 0 ? (
                <TrendDown
                  testID="weekly-activity-trend-down"
                  size={16}
                  color={muted}
                />
              ) : null}
              <Text
                testID="weekly-activity-trend-label"
                className="text-xs text-muted"
                style={TABULAR_NUMS}
              >
                {t('weeklyActivity.trend', {
                  percent: formatTrendPercent(trend, locale),
                })}
              </Text>
            </View>
          ) : null}
          <View
        testID="weekly-activity-chart-layout"
        style={{ height: CHART_HEIGHT }}
        onLayout={handleChartLayout}
      >
        {chartWidth > 0 ? (
          <BarChart
            data={chartData}
            xKey="date"
            yKey="value"
            width={chartWidth}
            height={CHART_HEIGHT}
            showXAxisLabels={false}
            showYAxisLabels
            showHorizontalGridLines
            yTickCount={4}
            formatYLabel={formatAxisLabel}
            interaction={{ mode: 'tap', onSelect: handleBarSelect }}
            selectedBar={selectedBar}
            accessibilityLabel={t('weeklyActivity.chartSummary', {
              metric: selectedMetricLabel.toLocaleLowerCase(locale),
            })}
            theme={{
              series: [accentStrong],
              grid: border,
              axis: border,
              text: foreground,
              mutedText: muted,
              background: surface,
              plotBackground: surface,
              typography: { axisLabelSize: CHART_AXIS_LABEL_SIZE },
            }}
            renderBar={(barProps) => (
              <ActivityBar
                key={barProps.bar.key}
                {...barProps}
                average={average}
                averageColor={muted}
                chartWidth={chartWidth}
                drawAverage={barProps.bar.dataIndex === averageAnchorIndex}
              />
            )}
            testID="weekly-activity-bar-chart"
          />
        ) : null}
            {selectedDay ? (
              <View
                pointerEvents="none"
                testID="weekly-activity-tooltip"
                className="absolute top-1 z-10 rounded-xl border border-border bg-surface p-2"
                style={[
                  CONTINUOUS_CORNER,
                  { left: tooltipLeft, width: TOOLTIP_WIDTH },
                ]}
              >
                <Text className="text-2xs font-semibold text-foreground">
                  {weekdayLabel(selectedDay.date, locale, 'long')}
                </Text>
                <Text
                  className="text-xs font-bold text-foreground"
                  style={TABULAR_NUMS}
                >
                  {selectedDay.source === 'missing'
                    ? '—'
                    : formatMetricValue(
                        selectedMetric,
                        metricValue(selectedDay, selectedMetric),
                      )}
                </Text>
              </View>
            ) : null}
          </View>
          <View
        testID="weekly-activity-day-row"
        className="flex-row"
        style={{
          paddingLeft: CHART_PAD_LEFT,
          paddingRight: CHART_PAD_RIGHT,
        }}
      >
        {days.map((day, dataIndex) => (
          <Pressable
            key={day.date}
            testID={`weekly-activity-day-${day.date}`}
            className={
              selection?.dataIndex === dataIndex
                ? 'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'
                : 'min-h-11 flex-1 items-center justify-end'
            }
            accessible
            accessibilityRole="button"
            accessibilityLabel={dayAccessibilityLabel(
              day,
              selectedMetric,
              locale,
              t,
            )}
            accessibilityState={{
              selected: selection?.dataIndex === dataIndex,
            }}
            onPress={() => handleColumnPress(dataIndex)}
          >
            <Text
              testID="weekly-activity-day-label"
              className="text-2xs font-semibold text-muted"
            >
              {weekdayLabel(day.date, locale, 'short')}
            </Text>
            {day.source === 'missing' ? (
              <Text
                testID={`weekly-activity-missing-${day.date}`}
                className="text-2xs font-normal text-muted"
              >
                —
              </Text>
            ) : (
              <Text
                testID={`weekly-activity-value-${day.date}`}
                className="text-2xs font-semibold text-foreground"
              >
                {formatMetricValue(
                  selectedMetric,
                  metricValue(day, selectedMetric),
                )}
              </Text>
            )}
          </Pressable>
        ))}
          </View>
          {selectedDay ? (
            <View
              testID="weekly-activity-detail"
              className="gap-3 rounded-xl border border-border bg-surface-secondary p-3"
              style={CONTINUOUS_CORNER}
            >
              <Text className="font-bold text-foreground">
                {weekdayLabel(selectedDay.date, locale, 'long')}
              </Text>
              {selectedDay.source === 'missing' ? (
                <Text className="text-sm text-muted">
                  {t('weeklyActivity.noDataForDay')}
                </Text>
              ) : (
                <View className="gap-3">
                  <View className="flex-row gap-3">
                    <DetailMetric
                      label={metricLabels[0]}
                      testID="weekly-activity-detail-active-minutes"
                      value={fmtMinutes(selectedDay.activeMinutes)}
                    />
                    <DetailMetric
                      label={metricLabels[1]}
                      testID="weekly-activity-detail-distance"
                      value={fmtKm(selectedDay.distanceM)}
                    />
                  </View>
                  <View className="flex-row gap-3">
                    <DetailMetric
                      label={metricLabels[2]}
                      testID="weekly-activity-detail-walks"
                      value={fmtCount(selectedDay.walkCount)}
                    />
                    <DetailMetric
                      label={t('home.sleep')}
                      testID="weekly-activity-detail-rest"
                      value={fmtMinutes(selectedDay.restMinutes)}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : null}
        </>
      ) : (
        <Text
          testID="weekly-activity-empty"
          className="py-6 text-center text-sm text-muted"
        >
          {t('weeklyActivity.noDataYet')}
        </Text>
      )}
    </Card>
  );
}
