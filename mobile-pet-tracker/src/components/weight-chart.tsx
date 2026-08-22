import { useThemeColor } from 'heroui-native';
import { Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

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
  const points = ascending
    .map(({ weightKg }, index) => {
      const x = (index / (ascending.length - 1)) * 100;
      const y = range === 0 ? 20 : 36 - ((weightKg - min) / range) * 32;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg
      testID="weight-chart"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 120 }}
    >
      <Polyline points={points} fill="none" strokeWidth={2} stroke={accent} />
    </Svg>
  );
}
