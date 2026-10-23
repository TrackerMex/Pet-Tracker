import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import type { WeightEntry } from '../api/types';
import { useLocale, useTranslate } from '../providers/language-provider';
import { fmtMonthShort } from '../screens/home/format';
import {
  MOTION_CELEBRATION_EASE_OUT,
  MOTION_CELEBRATION_POP_PEAK,
  MOTION_DRAW_DELAY_FULL_MS,
  MOTION_DRAW_TIMING,
  MOTION_POINT_POP_DELAY_MS,
  MOTION_POINT_POP_MS,
  MOTION_POP_SCALE,
} from '../theme/motion';
import { useThemeColors } from '../theme/use-theme-colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function chartMonths(latestIso: string): string[] {
  const [year, month] = latestIso.split('-').map(Number);
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(year, month - 6 + index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
  });
}

export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const t = useTranslate();
  const months = entries.length ? chartMonths(entries[0].measuredAt) : [];
  const visible = entries.filter(({ measuredAt }) =>
    measuredAt >= months[0] && measuredAt.slice(0, 7) <= months[5].slice(0, 7),
  );

  if (visible.length < 2) {
    return (
      <Text testID="weight-chart-empty" className="text-muted">
        {t('weightChart.notEnoughDataYet')}
      </Text>
    );
  }

  return <WeightChartPlot entries={visible} months={months} />;
}

function WeightChartPlot({ entries, months }: { entries: WeightEntry[]; months: string[] }) {
  const [accent, border, area] = useThemeColors(['accent-strong', 'border', 'tab-pill']);
  const t = useTranslate();
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(reducedMotion ? 1 : 0);
  const pointOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const pointScale = useSharedValue(reducedMotion ? 1 : MOTION_POP_SCALE);

  useEffect(() => {
    if (reducedMotion) return;
    progress.set(withDelay(MOTION_DRAW_DELAY_FULL_MS, withTiming(1, MOTION_DRAW_TIMING)));
    pointOpacity.set(withDelay(MOTION_POINT_POP_DELAY_MS, withTiming(1, {
      ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_POINT_POP_MS * 0.6,
    })));
    pointScale.set(withDelay(MOTION_POINT_POP_DELAY_MS, withSequence(
      withTiming(MOTION_CELEBRATION_POP_PEAK, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_POINT_POP_MS * 0.6 }),
      withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_POINT_POP_MS * 0.4 }),
    )));
  }, [pointOpacity, pointScale, progress, reducedMotion]);

  const ascending = [...entries].reverse();
  const values = ascending.map(({ weightKg }) => weightKg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const chartPoints = ascending.map(({ weightKg }, index) => ({
    x: index / (ascending.length - 1) * 310,
    y: max === min ? 60 : 80 - (weightKg - min) / (max - min) * 40,
  }));
  const line = chartPoints.map(({ x, y }, index) => `${index ? ' L' : 'M'}${x} ${y}`).join('');
  const length = chartPoints.slice(1).reduce((total, point, index) =>
    total + Math.hypot(point.x - chartPoints[index].x, point.y - chartPoints[index].y), 0,
  );
  const lineProps = useAnimatedProps(() => ({ strokeDashoffset: length * (1 - progress.get()) }));
  const pointsProps = useAnimatedProps(() => ({ opacity: pointOpacity.get() }));
  const pointProps = useAnimatedProps(() => ({ r: 5 * pointScale.get() }));
  const last = chartPoints[chartPoints.length - 1];

  return (
    <View testID="weight-chart">
      <Svg
        height={110}
        width="100%"
        viewBox="0 0 310 110"
        preserveAspectRatio="none"
        accessible
        accessibilityRole="image"
        accessibilityLabel={t('weightChart.lastSixMonths')}
      >
        <Path testID="weight-chart-grid" d="M0 20H310M0 55H310M0 90H310" stroke={border} strokeWidth={1} />
        <Path d={`${line} L310 110 L0 110 Z`} fill={area} />
        <AnimatedPath
          d={line}
          strokeDasharray={[length, length]}
          animatedProps={lineProps}
          fill="none"
          stroke={accent}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        <AnimatedG testID="weight-chart-points" animatedProps={pointsProps}>
          <AnimatedCircle cx={last.x} cy={last.y} r={5} animatedProps={pointProps} fill={accent} />
        </AnimatedG>
      </Svg>
      <View testID="weight-chart-months" className="flex-row justify-between">
        {months.map(month => <Text key={month} className="text-11 font-bold text-muted">{fmtMonthShort(month, locale)}</Text>)}
      </View>
    </View>
  );
}
