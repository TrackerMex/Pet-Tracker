import type { ReactNode } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { WeightEntry } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { MOTION_FILL_TIMING } from '../../theme/motion';
import { WeightChart } from '../weight-chart';

jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );
  const actual = jest.requireActual('react-native-svg');
  const Svg = (props: Record<string, unknown>) =>
    React.createElement(View, props, props.children as ReactNode);
  const Polyline = (props: Record<string, unknown>) =>
    React.createElement(View, { ...props, testID: 'weight-chart-line' });
  const Polygon = (props: Record<string, unknown>) =>
    React.createElement(View, { ...props, testID: 'weight-chart-area' });
  const G = (props: Record<string, unknown>) =>
    React.createElement(View, props, props.children as ReactNode);
  const Circle = (props: Record<string, unknown>) =>
    React.createElement(View, { ...props, testID: 'weight-chart-point' });

  return { ...actual, __esModule: true, default: Svg, Svg, Polyline, Polygon, G, Circle };
});

const mockUseReducedMotion = jest.fn(() => false);
const mockWithTiming = jest.fn((value: number, _config?: unknown) => value);
const mockUseSharedValue = jest.fn();

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  );
  return {
    ...actual,
    __esModule: true,
    useReducedMotion: () => mockUseReducedMotion(),
    withTiming: (value: number, config: unknown) => mockWithTiming(value, config),
    useSharedValue: (initial: number) => {
      mockUseSharedValue(initial);
      return actual.useSharedValue(initial);
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
  mockWithTiming.mockImplementation((value) => value);
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

function WeightChartWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

describe('R8: la gráfica degrada con <2 puntos', () => {
  it.each([
    { count: 0, entries: [] },
    { count: 1, entries: [makeWeight()] },
  ])('renders the empty fallback for $count entries', async ({ entries }) => {
    await render(<WeightChart entries={entries} />, {
      wrapper: WeightChartWrapper,
    });

    expect(screen.getByTestId('weight-chart-empty')).toHaveTextContent(
      'Aún no hay datos suficientes',
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
      wrapper: WeightChartWrapper,
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
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line').props.points).toBe(
      '0,20 100,20',
    );
  });
});

describe('#169 R1: la línea se dibuja al montarse', () => {
  const entries = [
    makeWeight({ id: 'weight-3', weightKg: 14, measuredAt: '2026-08-21' }),
    makeWeight({ id: 'weight-2', weightKg: 12, measuredAt: '2026-08-20' }),
    makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
  ];

  it('dibuja la línea de tres pesos desde la longitud de la polilínea', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray).toEqual([
      expect.closeTo(104.9952, 3),
      expect.closeTo(104.9952, 3),
    ]);
    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: 0 }),
    );
    expect(mockWithTiming).toHaveBeenCalledTimes(1);
    expect(mockWithTiming.mock.calls[0][0]).toBe(1);
    expect(mockWithTiming.mock.calls[0][1]).toBe(MOTION_FILL_TIMING);
  });

  it('empieza oculta en el primer frame', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: expect.closeTo(104.9952, 3) });
  });

  it('con progreso 0.25 el desplazamiento es tres cuartos de L', async () => {
    mockWithTiming.mockImplementation(() => 0.25);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(78.7464, 3) }),
    );
  });

  it('con tres pesos no alineados la longitud es la suma de los dos segmentos', async () => {
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 12, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-20' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray).toEqual([
      expect.closeTo(111.8609, 3),
      expect.closeTo(111.8609, 3),
    ]);
  });

  it('p parte de 0: con una animación que no avanza, la línea y los puntos siguen ocultos', async () => {
    mockWithTiming.mockImplementation(() => ({
      onStart: (animation: { current?: number }, value: number) => {
        animation.current = value;
      },
      onFrame: () => true,
      current: undefined,
    }) as unknown as number);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(104.9952, 3) }),
    );
    expect(screen.getByTestId('weight-chart-points').props.jestAnimatedProps?.value)
      .toEqual({ opacity: 0 });
  });

  it('con dos pesos iguales la longitud es 100', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(
      <WeightChart entries={[makeWeight({ id: 'weight-2' }), makeWeight()]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray)
      .toEqual([100, 100]);
    expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: 100 });
  });

  it('deja el área quieta', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-area').props.jestAnimatedProps)
      .toBeUndefined();
  });
});

describe('#169 R2: los puntos aparecen con el mismo progreso', () => {
  const entries = [
    makeWeight({ id: 'weight-3', weightKg: 14 }),
    makeWeight({ id: 'weight-2', weightKg: 12 }),
    makeWeight({ id: 'weight-1', weightKg: 10 }),
  ];

  it('termina con los puntos visibles', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    screen.getByTestId('weight-chart-points');

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-points').props.jestAnimatedProps?.value)
        .toEqual({ opacity: 1 }),
    );
  });

  it('empieza con los puntos ocultos en el primer frame', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    const points = screen.getByTestId('weight-chart-points');

    expect(points.props.jestAnimatedProps?.value).toEqual({ opacity: 0 });
  });

  it('con progreso 0.25 la opacidad de los puntos es 0.25', async () => {
    mockWithTiming.mockImplementation(() => 0.25);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-points').props.jestAnimatedProps?.value)
        .toEqual({ opacity: 0.25 }),
    );
  });

  it('agrupa un Circle por entrada y ninguno fuera', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    const points = screen.getByTestId('weight-chart-points');

    expect(within(points).getAllByTestId('weight-chart-point')).toHaveLength(3);
    expect(screen.getAllByTestId('weight-chart-point')).toHaveLength(3);
  });
});

describe('#169 R3: bajo reduce motion la gráfica sale completa', () => {
  it('sale completa sin llamar a withTiming', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    mockWithTiming.mockImplementation(() => 0);
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 14 }),
        makeWeight({ id: 'weight-2', weightKg: 12 }),
        makeWeight({ id: 'weight-1', weightKg: 10 }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(mockWithTiming).not.toHaveBeenCalled();
    expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: 0 });
    expect(screen.getByTestId('weight-chart-points').props.jestAnimatedProps?.value)
      .toEqual({ opacity: 1 });
  });

  it('p arranca en 1 bajo reduce motion', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-20' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(mockUseSharedValue).toHaveBeenCalledWith(1);
  });
});

describe('#169 R4: cuándo se vuelve a dibujar', () => {
  const entries = [
    makeWeight({ id: 'weight-3', weightKg: 14 }),
    makeWeight({ id: 'weight-2', weightKg: 12 }),
    makeWeight({ id: 'weight-1', weightKg: 10 }),
  ];

  it('R4a: con la gráfica montada, otros datos no repiten el dibujo', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray).toEqual([
      expect.closeTo(104.9952, 3), expect.closeTo(104.9952, 3),
    ]);
    await screen.rerender(
      <WeightChart entries={[makeWeight({ id: 'weight-2' }), makeWeight()]} />,
    );

    expect(screen.getByTestId('weight-chart-line').props.strokeDasharray)
      .toEqual([100, 100]);
    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line').props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: 0 }),
    );
    expect(mockWithTiming).toHaveBeenCalledTimes(1);
  });

  it('R4b: pasar de una entrada a tres dibuja una vez', async () => {
    await render(<WeightChart entries={[makeWeight()]} />, { wrapper: WeightChartWrapper });
    await screen.rerender(<WeightChart entries={entries} />);

    expect(mockWithTiming).toHaveBeenCalledTimes(1);
  });

  it('R4c: volver a menos de dos entradas y otra vez a tres dibuja de nuevo', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    await screen.rerender(<WeightChart entries={[makeWeight()]} />);
    await screen.rerender(<WeightChart entries={entries} />);

    expect(mockWithTiming).toHaveBeenCalledTimes(2);
  });
});
