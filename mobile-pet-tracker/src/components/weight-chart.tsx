import { useThemeColor } from 'heroui-native';
import { Text } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Polygon,
  Polyline,
  Stop,
} from 'react-native-svg';

import type { WeightEntry } from '../api/types';

export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const [accent] = useThemeColor(['accent']);

  if (entries.length < 2) {
    return (
      <Text testID="weight-chart-empty" className="text-muted">
        Not enough data yet
      </Text>
    );
  }

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
      <Polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      {chartPoints.map(({ x, y }, index) => (
        <Circle key={index} cx={x} cy={y} r={3} fill={accent} />
      ))}
    </Svg>
  );
}
