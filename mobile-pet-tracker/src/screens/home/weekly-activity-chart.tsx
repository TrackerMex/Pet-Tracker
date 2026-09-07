import type { JSX } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BarChart,
  type BarChartRenderBarProps,
} from 'react-native-chart-kit/v2';
import { Line, Rect } from 'react-native-svg';

import type { DayEntry, WeekComparison } from '../../api/types';
import { Card } from '../../components/card';
import { useLocale } from '../../providers/language-provider';
import { TABULAR_NUMS } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { fmtMinutes } from './format';

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

export type WeeklyMetric = 'activeMinutes' | 'distanceM' | 'walkCount';

export const WEEKLY_METRICS: readonly WeeklyMetric[] = [
  'activeMinutes',
  'distanceM',
  'walkCount',
];

export interface WeeklyActivityChartProps {
  days: DayEntry[];
  weekComparison: WeekComparison;
}

interface ChartDatum {
  date: string;
  value: number | null;
  day: DayEntry;
}

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
  const height = Math.max(bar.height, BAR_MIN_HEIGHT);
  const averageY =
    average === null || bar.value === 0
      ? null
      : bar.baselineY - average * (bar.height / bar.value);

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
    </>
  );
}

function formatAxisLabel(value: number): string {
  return String(value).slice(0, Y_LABEL_CHARS).padStart(Y_LABEL_CHARS, ' ');
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
  { days, weekComparison }: WeeklyActivityChartProps,
): JSX.Element {
  const locale = useLocale();
  const [accentStrong, muted, border, foreground, surface] = useThemeColors([
    'accent-strong',
    'muted',
    'border',
    'foreground',
    'surface',
  ]);
  const chartData = days.map((day) => ({
    date: day.date,
    value: day.source === 'missing' ? null : day.activeMinutes,
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

  void weekComparison;

  return (
    <Card testID="weekly-activity-card" className="gap-2">
      {average !== null ? (
        <Text
          testID="weekly-activity-average-label"
          className="self-end text-xs text-muted"
          style={TABULAR_NUMS}
        >
          {fmtMinutes(average)}
        </Text>
      ) : null}
      <BarChart
        data={chartData}
        xKey="date"
        yKey="value"
        width={295}
        height={CHART_PAD_TOP + CHART_PLOT_HEIGHT + CHART_PAD_BOTTOM}
        showXAxisLabels={false}
        showYAxisLabels
        showHorizontalGridLines
        yTickCount={4}
        formatYLabel={formatAxisLabel}
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
            chartWidth={295}
            drawAverage={barProps.bar.dataIndex === averageAnchorIndex}
          />
        )}
        testID="weekly-activity-bar-chart"
      />
      <View
        testID="weekly-activity-day-row"
        className="flex-row"
        style={{
          paddingLeft: CHART_PAD_LEFT,
          paddingRight: CHART_PAD_RIGHT,
        }}
      >
        {days.map((day) => (
          <Pressable
            key={day.date}
            testID={`weekly-activity-day-${day.date}`}
            className="min-h-11 flex-1 items-center justify-end"
            onPress={() => undefined}
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
                {fmtMinutes(day.activeMinutes)}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
