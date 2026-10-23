import type { ReactNode } from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { WeightEntry } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { MOTION_DRAW_TIMING } from '../../theme/motion';
import { WeightChart } from '../weight-chart';
import * as chartModule from '../weight-chart';

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

  const Path = (props: Record<string, unknown>) => React.createElement(View, { ...props, testID: props.testID ?? (props.strokeDasharray ? 'weight-chart-line' : 'weight-chart-area') });
  return { ...actual, __esModule: true, default: Svg, Svg, Polyline, Polygon, Path, G, Circle };
});

const mockUseReducedMotion = jest.fn(() => false);
const mockWithTiming = jest.fn((value: number, _config?: unknown) => value);
const mockUseSharedValue = jest.fn();
const mockWithDelay = jest.fn((_delay: number, animation: unknown) => animation);
const mockWithSequence = jest.fn((...animations: unknown[]) => animations[animations.length - 1]);

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens,
}));

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  );
  return {
    ...actual,
    __esModule: true,
    useReducedMotion: () => mockUseReducedMotion(),
    withDelay: (delay: number, animation: unknown) => mockWithDelay(delay, animation),
    withSequence: (...animations: unknown[]) => mockWithSequence(...animations),
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
  mockWithDelay.mockImplementation((_delay, animation) => animation);
  mockWithSequence.mockImplementation((...animations) => animations[animations.length - 1]);
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

    expect(screen.getByTestId('weight-chart-empty', { includeHiddenElements: true })).toHaveTextContent(
      'Aún no hay datos suficientes',
    );
    expect(screen.queryByTestId('weight-chart', { includeHiddenElements: true })).toBeNull();
  });

  it('reverses descending API entries and normalizes each point (enmendado por #199 R5)', async () => {
    const entries = [
      makeWeight({ id: 'weight-3', weightKg: 14, measuredAt: '2026-08-21' }),
      makeWeight({ id: 'weight-2', weightKg: 12, measuredAt: '2026-08-20' }),
      makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
    ];

    await render(<WeightChart entries={entries} />, {
      wrapper: WeightChartWrapper,
    });

    expect(svgProps()).toEqual(
      expect.objectContaining({
        viewBox: '0 0 310 110',
        preserveAspectRatio: 'none',
        height: 110, width: '100%', accessibilityRole: 'image', accessibilityLabel: 'Peso de los últimos 6 meses',
      }),
    );
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.d).toBe(
      'M0 80 L155 60 L310 40',
    );
  });

  it('centers equal weights without dividing by zero (enmendado por #199 R5)', async () => {
    await render(
      <WeightChart
        entries={[
          makeWeight({ id: 'weight-2' }),
          makeWeight({ id: 'weight-1' }),
        ]}
      />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.d).toBe(
      'M0 60 L310 60',
    );
  });
});

describe('#169 R1: la línea se dibuja al montarse', () => {
  const entries = [
    makeWeight({ id: 'weight-3', weightKg: 14, measuredAt: '2026-08-21' }),
    makeWeight({ id: 'weight-2', weightKg: 12, measuredAt: '2026-08-20' }),
    makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
  ];

  it('dibuja la línea de tres pesos desde la longitud de la polilínea (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray).toEqual([
      expect.closeTo(312.5699922, 3),
      expect.closeTo(312.5699922, 3),
    ]);
    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: 0 }),
    );
    expect(drawCalls()).toHaveLength(1);
    expect(drawCalls()[0][0]).toBe(1);
    expect(drawCalls()[0][1]).toBe(MOTION_DRAW_TIMING);
  });

  it('empieza oculta en el primer frame (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: expect.closeTo(312.5699922, 3) });
  });

  it('con progreso 0.25 el desplazamiento es tres cuartos de L (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => 0.25);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(234.4274941, 3) }),
    );
  });

  it('con tres pesos no alineados la longitud es la suma de los dos segmentos (enmendado por #199 R5)', async () => {
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 12, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-20' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray).toEqual([
      expect.closeTo(316.3631020, 3),
      expect.closeTo(316.3631020, 3),
    ]);
  });

  it('con tres pesos no alineados y progreso 0.25 el desplazamiento es tres cuartos de la suma de los segmentos (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => 0.25);
    await render(
      <WeightChart entries={[
        makeWeight({ id: 'weight-3', weightKg: 12, measuredAt: '2026-08-21' }),
        makeWeight({ id: 'weight-2', weightKg: 14, measuredAt: '2026-08-20' }),
        makeWeight({ id: 'weight-1', weightKg: 10, measuredAt: '2026-08-19' }),
      ]} />,
      { wrapper: WeightChartWrapper },
    );

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(237.2723265, 3) }),
    );
  });

  it('p parte de 0: con una animación que no avanza, la línea y los puntos siguen ocultos (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => ({
      onStart: (animation: { current?: number }, value: number) => {
        animation.current = value;
      },
      onFrame: () => true,
      current: undefined,
    }) as unknown as number);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: expect.closeTo(312.5699922, 3) }),
    );
    expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
      .toEqual({ opacity: 0 });
  });

  it('con dos pesos iguales la longitud es 100 (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(
      <WeightChart entries={[makeWeight({ id: 'weight-2' }), makeWeight()]} />,
      { wrapper: WeightChartWrapper },
    );

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray)
      .toEqual([310, 310]);
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: 310 });
  });

  it('deja el área quieta', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    expect(screen.getByTestId('weight-chart-area', { includeHiddenElements: true }).props.jestAnimatedProps)
      .toBeUndefined();
  });
});

describe('#169 R2: los puntos aparecen con el mismo progreso', () => {
  const entries = [
    makeWeight({ id: 'weight-3', weightKg: 14 }),
    makeWeight({ id: 'weight-2', weightKg: 12 }),
    makeWeight({ id: 'weight-1', weightKg: 10 }),
  ];

  it('termina con los puntos visibles (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    screen.getByTestId('weight-chart-points', { includeHiddenElements: true });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ opacity: 1 }),
    );
  });

  it('empieza con los puntos ocultos en el primer frame (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation(() => 0);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    const points = screen.getByTestId('weight-chart-points', { includeHiddenElements: true });

    expect(points.props.jestAnimatedProps?.value).toEqual({ opacity: 0 });
  });

  it('con progreso 0.25 la opacidad de los puntos es 0.25 (enmendado por #199 R5)', async () => {
    mockWithTiming.mockImplementation((value, config) => config === MOTION_DRAW_TIMING ? 0.25 : value);
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });

    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ opacity: 1 }),
    );
  });

  it('agrupa un Circle por entrada y ninguno fuera (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    const points = screen.getByTestId('weight-chart-points', { includeHiddenElements: true });

    expect(within(points).getAllByTestId('weight-chart-point', { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.getAllByTestId('weight-chart-point', { includeHiddenElements: true })).toHaveLength(1);
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
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
      .toEqual({ strokeDashoffset: 0 });
    expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
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

  it('R4a: con la gráfica montada, otros datos no repiten el dibujo (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray).toEqual([
      expect.closeTo(312.5699922, 3), expect.closeTo(312.5699922, 3),
    ]);
    await screen.rerender(
      <WeightChart entries={[makeWeight({ id: 'weight-2' }), makeWeight()]} />,
    );

    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray)
      .toEqual([310, 310]);
    await waitFor(() =>
      expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value)
        .toEqual({ strokeDashoffset: 0 }),
    );
    expect(drawCalls()).toHaveLength(1);
  });

  it('R4b: pasar de una entrada a tres dibuja una vez (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={[makeWeight()]} />, { wrapper: WeightChartWrapper });
    await screen.rerender(<WeightChart entries={entries} />);

    expect(drawCalls()).toHaveLength(1);
  });

  it('R4c: volver a menos de dos entradas y otra vez a tres dibuja de nuevo (enmendado por #199 R5)', async () => {
    await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
    await screen.rerender(<WeightChart entries={[makeWeight()]} />);
    await screen.rerender(<WeightChart entries={entries} />);

    expect(drawCalls()).toHaveLength(2);
  });
});

function drawCalls() {
  return mockWithTiming.mock.calls.filter(([, config]) => config === MOTION_DRAW_TIMING);
}

function realAnimations() {
  jest.useFakeTimers();
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  mockWithTiming.mockImplementation((value, config) => actual.withTiming(value, config as never));
  mockWithDelay.mockImplementation((delay, animation) => actual.withDelay(delay, animation as never));
  mockWithSequence.mockImplementation((...animations) => actual.withSequence(animations[0] as number, ...animations.slice(1) as number[]));
}

afterEach(() => { jest.useRealTimers(); });

const canvasEntries = [
  makeWeight({ id: 'w3', measuredAt: '2026-03-10', weightKg: 11 }),
  makeWeight({ id: 'w2', measuredAt: '2026-01-01', weightKg: 12 }),
  makeWeight({ id: 'w1', measuredAt: '2025-10-01', weightKg: 10 }),
];

async function renderFull(entries = canvasEntries) {
  await render(<WeightChart entries={entries} />, { wrapper: WeightChartWrapper });
}

function pointRadius() {
  const point = screen.getAllByTestId('weight-chart-point', { includeHiddenElements: true })[0];
  return point.props.jestAnimatedProps?.value?.r ?? point.props.r;
}

describe('#199 R5: gráfica completa', () => {
  it('#199 R5 pinta viewBox 0 0 310 110 a 110 de alto sin degradado', async () => {
    await renderFull();
    expect(svgProps()).toMatchObject({ viewBox: '0 0 310 110', height: 110, width: '100%', preserveAspectRatio: 'none' });
    expect(screen.getByTestId('weight-chart-area', { includeHiddenElements: true }).props.fill).toBe('tab-pill');
  });
  it('#199 R5 pinta la rejilla de tres líneas en border', async () => {
    await renderFull();
    expect(screen.queryByTestId('weight-chart-grid', { includeHiddenElements: true })).not.toBeNull();
    expect(screen.getByTestId('weight-chart-grid', { includeHiddenElements: true }).props).toMatchObject({ d: 'M0 20H310M0 55H310M0 90H310', stroke: 'border', strokeWidth: 1 });
  });
  it('#199 R5 normaliza 10, 12 y 11 kg a (0,80), (155,40) y (310,60)', async () => {
    await renderFull();
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.d).toBe('M0 80 L155 40 L310 60');
    expect(screen.getByTestId('weight-chart-area', { includeHiddenElements: true }).props.d).toBe('M0 80 L155 40 L310 60 L310 110 L0 110 Z');
  });
  it('#199 R5 con pesos iguales la línea va a y 60', async () => {
    await renderFull([makeWeight({ id: 'a' }), makeWeight({ id: 'b' })]);
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.d).toBe('M0 60 L310 60');
  });
  it('#199 R5 strokeDasharray mide la polilínea real', async () => {
    await renderFull([makeWeight({ id: 'b', weightKg: 12 }), makeWeight({ id: 'a', weightKg: 10 })]);
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.strokeDasharray).toEqual([Math.hypot(310, 40), Math.hypot(310, 40)]);
  });
  it('#199 R5 la línea sigue entera a los 199 ms y llega a 0 a los 1400 ms', async () => {
    realAnimations();
    await renderFull([makeWeight({ id: 'b', weightKg: 12 }), makeWeight({ id: 'a', weightKg: 10 })]);
    await act(() => jest.advanceTimersByTime(199));
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ strokeDashoffset: Math.hypot(310, 40) });
    await act(() => jest.advanceTimersByTime(1201));
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ strokeDashoffset: 0 });
  });
  it('#199 R5 un solo Circle en el último punto con radio 5', async () => {
    await renderFull();
    expect(screen.getAllByTestId('weight-chart-point', { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.getAllByTestId('weight-chart-point', { includeHiddenElements: true })[0].props).toMatchObject({ cx: 310, cy: 60, fill: 'accent-strong' });
    expect(pointRadius()).toBe(5);
  });
  it('#199 R5 el punto sigue oculto a los 1299 ms, llega a radio 5.4 a los 1540 y a 5 a los 1700', async () => {
    realAnimations();
    await renderFull();
    await act(() => jest.advanceTimersByTime(1299));
    expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ opacity: 0 });
    expect(pointRadius()).toBe(3);
    await act(() => jest.advanceTimersByTime(241));
    expect(pointRadius()).toBeCloseTo(5.4);
    expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ opacity: 1 });
    await act(() => jest.advanceTimersByTime(160));
    expect(pointRadius()).toBe(5);
  });
  it('#199 R5 rotula los seis meses de la ventana', async () => {
    await renderFull();
    expect(screen.queryByTestId('weight-chart-months', { includeHiddenElements: true })).not.toBeNull();
    const months = within(screen.getByTestId('weight-chart-months', { includeHiddenElements: true }));
    for (const label of ['oct', 'nov', 'dic', 'ene', 'feb', 'mar']) {
      expect(months.getByText(label).props.className).toBe('text-11 font-bold text-muted');
    }
  });
  it('#199 R5 deja fuera el registro del 2025-09-30 y conserva el del 2025-10-01', async () => {
    await renderFull([...canvasEntries, makeWeight({ id: 'old', measuredAt: '2025-09-30', weightKg: 100 })]);
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.d).toBe('M0 80 L155 40 L310 60');
  });
  it('#199 R5 se anuncia como Peso de los últimos 6 meses', async () => {
    await renderFull();
    expect(screen.queryByRole('image', { name: 'Peso de los últimos 6 meses' })).toBeOnTheScreen();
  });
  it.each([
    ['2026-03-10', ['2025-10-01', '2025-11-01', '2025-12-01', '2026-01-01', '2026-02-01', '2026-03-01']],
    ['2026-06-30', ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01']],
  ])('#199 R5 chartMonths de %s es %j', (date, expected) => {
    const months = (chartModule as Record<string, unknown>).chartMonths;
    expect(months).toEqual(expect.any(Function));
    expect((months as (date: string) => string[])(date as string)).toEqual(expected);
  });
  it('#199 R5 bajo reduce motion la línea y el punto salen completos', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderFull();
    expect(screen.getByTestId('weight-chart-line', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ strokeDashoffset: 0 });
    expect(screen.getByTestId('weight-chart-points', { includeHiddenElements: true }).props.jestAnimatedProps?.value).toEqual({ opacity: 1 });
    expect(pointRadius()).toBe(5);
    expect(mockWithTiming).not.toHaveBeenCalled();
    expect(mockWithDelay).not.toHaveBeenCalled();
  });
});

function svgProps() {
  return screen.container.queryAll(node => node.props.viewBox !== undefined)[0]?.props ?? {};
}
