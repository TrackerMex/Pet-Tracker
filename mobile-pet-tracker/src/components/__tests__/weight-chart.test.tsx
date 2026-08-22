import { render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { WeightEntry } from '../../api/types';
import { WeightChart } from '../weight-chart';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const actual = jest.requireActual('react-native-svg');
  const Svg = (props: Record<string, unknown>) =>
    React.createElement(View, props, props.children);
  const Polyline = (props: Record<string, unknown>) =>
    React.createElement(View, { ...props, testID: 'weight-chart-line' });

  return { ...actual, __esModule: true, default: Svg, Svg, Polyline };
});

function makeWeight(overrides: Partial<WeightEntry> = {}): WeightEntry {
  return {
    id: 'weight-1',
    petId: 'pet-1',
    weightKg: 12,
    measuredAt: '2026-08-21',
    bodyCondition: null,
    variation: null,
    ...overrides,
  };
}

describe('R8: la gráfica degrada con <2 puntos', () => {
  it.each([
    [],
    [makeWeight()],
  ])('renders the empty fallback for %i entries', async (entries) => {
    await render(<WeightChart entries={entries} />, {
      wrapper: HeroUINativeProvider,
    });

    expect(screen.getByTestId('weight-chart-empty')).toHaveTextContent(
      'Not enough data yet',
    );
    expect(screen.queryByTestId('weight-chart')).toBeNull();
  });

  it('reverses descending API entries and normalizes each point', async () => {
    const entries = [
      makeWeight({ id: 'weight-3', weightKg: 14, measuredAt: '2026-08-21' }),
      makeWeight({ id: 'weight-2', weightKg: 12, measuredAt: '2026-08-20' }),
      makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
    ];

    await render(<WeightChart entries={entries} />, {
      wrapper: HeroUINativeProvider,
    });

    expect(screen.getByTestId('weight-chart').props).toEqual(
      expect.objectContaining({
        viewBox: '0 0 100 40',
        preserveAspectRatio: 'none',
        style: { width: '100%', height: 120 },
      }),
    );
    expect(screen.getByTestId('weight-chart-line').props.points).toBe(
      '0,36 50,20 100,4',
    );
  });

  it('centers equal weights without dividing by zero', async () => {
    await render(
      <WeightChart
        entries={[
          makeWeight({ id: 'weight-2' }),
          makeWeight({ id: 'weight-1' }),
        ]}
      />,
      { wrapper: HeroUINativeProvider },
    );

    expect(screen.getByTestId('weight-chart-line').props.points).toBe(
      '0,20 100,20',
    );
  });
});
