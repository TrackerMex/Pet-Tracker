import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Polygon,
  Polyline,
  Stop,
} from 'react-native-svg';

import type { WeightEntry } from '../api/types';
import { useTranslate } from '../providers/language-provider';
import { MOTION_FILL_TIMING } from '../theme/motion';
import { useThemeColors } from '../theme/use-theme-colors';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedG = Animated.createAnimatedComponent(G);

export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const t = useTranslate();

  if (entries.length < 2) {
    return (
      <Text testID="weight-chart-empty" className="text-muted">
        {t('weightChart.notEnoughDataYet')}
      </Text>
    );
  }

  return <WeightChartPlot entries={entries} />;
}

function WeightChartPlot({ entries }: { entries: WeightEntry[] }) {
  const [accent] = useThemeColors(['accent-strong']);
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (!reducedMotion) progress.set(withTiming(1, MOTION_FILL_TIMING));
  }, [progress, reducedMotion]);

  const ascending = [...entries].reverse();
  const values = ascending.map(({ weightKg }) => weightKg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const chartPoints = ascending
    .map(({ weightKg }, index) => {
      const x = (index / (ascending.length - 1)) * 100;
      const y = range === 0 ? 20 : 36 - ((weightKg - min) / range) * 32;
      return { x, y };
    });
  const points = chartPoints.map(({ x, y }) => `${x},${y}`).join(' ');
  const areaPoints = `${points} 100,40 0,40`;
  const L = chartPoints.slice(1).reduce(
    (length, point, index) => length + Math.hypot(
      point.x - chartPoints[index].x,
      point.y - chartPoints[index].y,
    ),
    0,
  );
  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: L * (1 - progress.get()),
  }));
  const pointsProps = useAnimatedProps(() => ({ opacity: progress.get() }));

  return (
    <Svg
      testID="weight-chart"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 120 }}
    >
      <Defs>
        <LinearGradient id="weight-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={accent} stopOpacity={0.2} />
          <Stop offset="100%" stopColor={accent} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Polygon points={areaPoints} fill="url(#weight-area-gradient)" />
      <AnimatedPolyline
        strokeDasharray={[L, L]}
        animatedProps={lineProps}
        points={points}
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <AnimatedG testID="weight-chart-points" animatedProps={pointsProps}>
        {chartPoints.map(({ x, y }, index) => (
          <Circle key={index} cx={x} cy={y} r={3} fill={accent} />
        ))}
      </AnimatedG>
    </Svg>
  );
}
