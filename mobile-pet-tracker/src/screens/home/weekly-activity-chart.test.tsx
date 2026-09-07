import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { BarChart } from 'react-native-chart-kit/v2';

import type { DayEntry, WeekComparison } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { TABULAR_NUMS } from '../../theme/native-styles';
import {
  BAR_MIN_HEIGHT,
  BAR_ENTRY_DURATION_MS,
  BAR_ENTRY_STAGGER_MS,
  CHART_AXIS_LABEL_SIZE,
  CHART_PAD_BOTTOM,
  CHART_PAD_LEFT,
  CHART_PAD_RIGHT,
  CHART_PAD_TOP,
  CHART_PLOT_HEIGHT,
  WEEKLY_METRICS,
  WeeklyActivityChart,
  type WeeklyActivityChartProps,
  weekdayLabel,
  Y_LABEL_CHARS,
} from './weekly-activity-chart';

declare function require(moduleName: 'fs'): {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const mockUseReducedMotion = jest.fn<boolean, []>(() => true);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  ),
  useReducedMotion: () => mockUseReducedMotion(),
  withDelay: jest.fn((_delay: number, animation: unknown) => animation),
  withTiming: jest.fn((value: number) => value),
}));

jest.mock('react-native-chart-kit/v2', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    BarChart: jest.fn((props: Record<string, unknown>) => {
      const data = props.data as Array<Record<string, unknown>>;
      const series = props.series as Array<{ yKey: string }> | undefined;
      const yKey = (props.yKey as string | undefined) ?? series?.[0]?.yKey;
      const renderBar = props.renderBar as
        | ((mockBarProps: Record<string, unknown>) =>
            ReturnType<typeof React.createElement>)
        | undefined;
      const bars = data.flatMap((row, dataIndex) => {
        const value = yKey === undefined ? null : row[yKey];

        if (typeof value !== 'number' || renderBar === undefined) return [];

        const height = value === 0 ? 0 : Math.max(value, 1);

        return renderBar({
          bar: {
            key: `bar-${dataIndex}`,
            seriesKey: yKey,
            seriesLabel: yKey,
            seriesIndex: 0,
            dataIndex,
            xValue: row.date,
            xLabel: String(row.date),
            value,
            formattedValue: String(value),
            x: 20 + dataIndex * 30,
            y: 100 - height,
            width: 20,
            height,
            baselineY: 100,
            color: 'resolved-accent',
            raw: row,
          },
          fill: 'resolved-accent',
          radius: 4,
          selected: false,
          strokeColor: 'resolved-foreground',
          strokeOpacity: 0,
          strokeWidth: 1.5,
          theme: {
            background: 'resolved-surface',
            plotBackground: 'resolved-surface',
            grid: 'resolved-border',
            axis: 'resolved-border',
            text: 'resolved-foreground',
            mutedText: 'resolved-muted',
            series: ['resolved-accent'],
            tooltip: {},
            typography: { axisLabelSize: 10 },
          },
        });
      });

      return React.createElement(
        View,
        {
          accessibilityLabel: props.accessibilityLabel as string | undefined,
          testID: (props.testID as string | undefined) ??
            'weekly-activity-bar-chart',
        },
        bars,
      );
    }),
  };
});

jest.mock('@expo/ui/community/segmented-control', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    __esModule: true,
    default: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
  };
});

jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const actual = jest.requireActual<typeof import('react-native-svg')>(
    'react-native-svg',
  );
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    ...actual,
    Rect: (mockProps: Record<string, unknown>) =>
      React.createElement(View, mockProps),
    Line: (mockProps: Record<string, unknown>) =>
      React.createElement(View, mockProps),
  };
});

const projectRoot = process.cwd();
const chartSourcePath = join(
  projectRoot,
  'src',
  'screens',
  'home',
  'weekly-activity-chart.tsx',
);
const NO_COMPARISON: WeekComparison = {
  distanceM: null,
  activeMinutes: null,
  walkCount: null,
};

function makeDay(overrides: Partial<DayEntry> = {}): DayEntry {
  return {
    date: '2026-09-02',
    distanceM: 2400,
    activeMinutes: 45,
    restMinutes: 720,
    walkCount: 2,
    avgWalkMinutes: 22,
    firstWalkAt: '2026-09-02T08:00:00.000Z',
    lastWalkAt: '2026-09-02T18:00:00.000Z',
    timeAwayMinutes: 60,
    source: 'stored',
    ...overrides,
  };
}

function makeWeek(from: string, minutes: Array<number | null>): DayEntry[] {
  const [year, month, day] = from.split('-').map(Number);

  return minutes.map((activeMinutes, index) => {
    const current = new Date(year, month - 1, day + index);
    const date = [
      current.getFullYear(),
      String(current.getMonth() + 1).padStart(2, '0'),
      String(current.getDate()).padStart(2, '0'),
    ].join('-');
    const missing = activeMinutes === null;

    return makeDay({
      date,
      activeMinutes,
      distanceM: missing ? null : activeMinutes * 100,
      restMinutes: missing ? null : Math.max(0, 900 - activeMinutes),
      walkCount: missing ? null : index,
      avgWalkMinutes: missing ? null : activeMinutes,
      firstWalkAt: missing ? null : `${date}T08:00:00.000Z`,
      lastWalkAt: missing ? null : `${date}T18:00:00.000Z`,
      timeAwayMinutes: missing ? null : activeMinutes,
      source: missing ? 'missing' : 'stored',
    });
  });
}

function ChartWrapper({
  children,
  language,
}: {
  children: ReactNode;
  language: 'es' | 'en';
}) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderChart(
  days: DayEntry[],
  weekComparison: WeekComparison = NO_COMPARISON,
  language: 'es' | 'en' = 'es',
) {
  const result = await render(
    <WeeklyActivityChart days={days} weekComparison={weekComparison} />,
    {
      wrapper: ({ children }) => (
        <ChartWrapper language={language}>{children}</ChartWrapper>
      ),
    },
  );
  const layout = result.queryByTestId('weekly-activity-chart-layout');

  if (layout) {
    await fireEvent(layout, 'layout', {
      nativeEvent: {
        layout: { width: 295, height: 0, x: 0, y: 0 },
      },
    });
  }

  return result;
}

async function renderChartWithProps(
  props: WeeklyActivityChartProps,
  language: 'es' | 'en' = 'es',
  fireLayout = true,
) {
  const result = await render(<WeeklyActivityChart {...props} />, {
    wrapper: ({ children }) => (
      <ChartWrapper language={language}>{children}</ChartWrapper>
    ),
  });
  const layout = result.queryByTestId('weekly-activity-chart-layout');

  if (fireLayout && layout) {
    await fireEvent(layout, 'layout', {
      nativeEvent: {
        layout: { width: 295, height: 0, x: 0, y: 0 },
      },
    });
  }

  return result;
}

function latestBarChartProps(): Record<string, unknown> {
  const call = mockBarChart.mock.calls.at(-1);

  expect(call).toBeDefined();
  return call?.[0] as Record<string, unknown>;
}

const mockBarChart = jest.mocked(BarChart);

beforeEach(() => {
  void act;
  void within;
  void weekdayLabel;
  void renderChartWithProps;
  void latestBarChartProps;
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(true);
});

describe('R1: la gráfica entra por el subpath v2 y por ningún otro', () => {
  it('declara la versión exacta y transforma sus dos paquetes ESM', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as {
      dependencies: Record<string, string>;
      jest: { transformIgnorePatterns: string[] };
    };
    const transformPattern = packageJson.jest.transformIgnorePatterns[0];

    expect(packageJson.dependencies['react-native-chart-kit']).toBe('7.0.4');
    expect(transformPattern).toContain('react-native-chart-kit');
    expect(transformPattern).toContain('paths-js');
  });

  it('importa la gráfica solo desde react-native-chart-kit/v2', () => {
    expect(existsSync(chartSourcePath)).toBe(true);

    if (!existsSync(chartSourcePath)) return;

    const source = readFileSync(chartSourcePath, 'utf8');

    expect(source).toContain("from 'react-native-chart-kit/v2'");
    expect(source).not.toContain("from 'react-native-chart-kit'");
    expect(source).not.toContain('react-native-chart-kit/dist');
  });

  it('pinea 7.0.4 porque la geometría del eje depende de sus constantes', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as { dependencies: Record<string, string> };
    const source = readFileSync(chartSourcePath, 'utf8');

    expect(packageJson.dependencies['react-native-chart-kit']).toBe('7.0.4');
    expect(source).toContain('base padding: 18, 14, 12, 10');
    expect(source).toContain('label gap: 8');
    expect(source).toContain('text width factor: 0.56');
    expect(source).toContain('measured label height: 14');
    expect(source).toContain('band padding: 0.12, 0.08');
  });
});

describe('R2: WeeklyActivityChart recibe los días y no habla con la red', () => {
  it('expone la API acordada y monta la tarjeta con datos recibidos', async () => {
    const days = makeWeek('2026-09-02', [15, 20, 25, 30, 35, 40, 45]);

    const result = await renderChart(days);

    expect(result.queryByTestId('weekly-activity-card')).toBeOnTheScreen();
    expect(WEEKLY_METRICS).toEqual([
      'activeMinutes',
      'distanceM',
      'walkCount',
    ]);
    [
      CHART_PAD_LEFT,
      CHART_PAD_RIGHT,
      CHART_PAD_TOP,
      CHART_PAD_BOTTOM,
      CHART_PLOT_HEIGHT,
      CHART_AXIS_LABEL_SIZE,
      Y_LABEL_CHARS,
      BAR_ENTRY_DURATION_MS,
      BAR_ENTRY_STAGGER_MS,
    ].forEach((value) => expect(value).toEqual(expect.any(Number)));
  });

  it('solo importa tipos de la API y no conoce red ni navegación', () => {
    const source = readFileSync(chartSourcePath, 'utf8');

    expect(source).toMatch(
      /import type \{[^}]*DayEntry[^}]*WeekComparison[^}]*\} from '\.\.\/\.\.\/api\/types';/s,
    );
    expect(source).not.toContain("from '../../api/activity'");
    expect(source).not.toContain('use-api');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('expo-router');
  });
});

describe('R3: la letra del eje sale de la fecha, no del índice', () => {
  it('usa el día real de cada fecha en los dos idiomas', async () => {
    const days = makeWeek('2026-09-02', [15, 20, 25, 30, 35, 40, 45]);
    const expectedIds = days.map(
      ({ date }) => `weekly-activity-day-${date}`,
    );

    const spanish = await renderChart(days, NO_COMPARISON, 'es');
    const spanishColumns = spanish.queryAllByTestId(
      /^weekly-activity-day-\d{4}-\d{2}-\d{2}$/,
    );

    expect(spanishColumns.map(({ props }) => props.testID)).toEqual(expectedIds);
    expect(
      spanishColumns.map((column) =>
        within(column).getByTestId('weekly-activity-day-label').props.children,
      ),
    ).toEqual(['mié', 'jue', 'vie', 'sáb', 'dom', 'lun', 'mar']);
    expect(
      (latestBarChartProps().data as Array<{ date: string }>).map(
        ({ date }) => date,
      ),
    ).toEqual(days.map(({ date }) => date));
    expect(latestBarChartProps()).toEqual(
      expect.objectContaining({
        xKey: 'date',
        showXAxisLabels: false,
      }),
    );

    await spanish.unmount();
    const english = await renderChart(days, NO_COMPARISON, 'en');
    const englishColumns = english.queryAllByTestId(
      /^weekly-activity-day-\d{4}-\d{2}-\d{2}$/,
    );

    expect(
      englishColumns.map((column) =>
        within(column).getByTestId('weekly-activity-day-label').props.children,
      ),
    ).toEqual(['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']);
  });

  it('no se desplaza un día en una zona horaria negativa', () => {
    const previousTimezone = process.env.TZ;

    try {
      process.env.TZ = 'America/Mexico_City';

      expect(weekdayLabel('2026-09-06', 'es-MX', 'short')).toBe('dom');
      expect(readFileSync(chartSourcePath, 'utf8')).not.toContain(
        'new Date(date)',
      );
    } finally {
      process.env.TZ = previousTimezone;
    }
  });
});

describe('R5: un día sin dato no es una barra de altura cero', () => {
  it('separa el guion del día ausente y el valor cero medido', async () => {
    const missing = makeDay({
      date: '2026-09-06',
      source: 'missing',
      activeMinutes: null,
    });
    const resting = makeDay({
      date: '2026-09-07',
      source: 'stored',
      activeMinutes: 0,
    });
    const result = await renderChart([missing, resting]);

    expect(
      result.getByTestId('weekly-activity-missing-2026-09-06'),
    ).toHaveTextContent('—');
    expect(
      result.queryByTestId('weekly-activity-value-2026-09-06'),
    ).toBeNull();
    expect(
      result.getByTestId('weekly-activity-value-2026-09-07'),
    ).toHaveTextContent('0m');
    expect(
      result.queryByTestId('weekly-activity-missing-2026-09-07'),
    ).toBeNull();
    expect(result.getByTestId('weekly-activity-bar-2026-09-07').props).toEqual(
      expect.objectContaining({
        height: BAR_MIN_HEIGHT,
        y: 100 - BAR_MIN_HEIGHT,
      }),
    );
  });

  it('pasa null al gráfico para missing y conserva cero para stored', async () => {
    const days = [
      makeDay({
        date: '2026-09-06',
        source: 'missing',
        activeMinutes: null,
      }),
      makeDay({
        date: '2026-09-07',
        source: 'stored',
        activeMinutes: 0,
      }),
    ];

    await renderChart(days);

    expect(latestBarChartProps().data).toEqual([
      expect.objectContaining({ date: '2026-09-06', value: null }),
      expect.objectContaining({ date: '2026-09-07', value: 0 }),
    ]);
  });

  it('usa source aunque una métrica stored sea null', async () => {
    const result = await renderChart([
      makeDay({
        date: '2026-09-07',
        source: 'stored',
        activeMinutes: null,
      }),
    ]);

    expect(
      result.getByTestId('weekly-activity-value-2026-09-07'),
    ).toBeOnTheScreen();
    expect(
      result.queryByTestId('weekly-activity-missing-2026-09-07'),
    ).toBeNull();
  });
});

describe('R7: la gráfica dibuja eje Y, rejilla y línea de media', () => {
  it('configura cuatro ticks con etiquetas de cuatro caracteres', async () => {
    await renderChart(makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]));
    const props = latestBarChartProps();
    const formatYLabel = props.formatYLabel as (value: number) => string;

    expect(props).toEqual(
      expect.objectContaining({
        showYAxisLabels: true,
        showHorizontalGridLines: true,
        yTickCount: 4,
      }),
    );
    expect(
      [0, 45, 1440, 12.3].map((value) => formatYLabel(value)),
    ).toEqual(['   0', '  45', '1440', '12.3']);
    expect(
      (props.theme as { typography: { axisLabelSize: number } }).typography
        .axisLabelSize,
    ).toBe(CHART_AXIS_LABEL_SIZE);
  });

  it('dibuja la media discontinua y rotula cifras tabulares', async () => {
    const result = await renderChart(
      makeWeek('2026-09-02', [10, 20, 30, null, null, null, null]),
    );

    expect(result.getByTestId('weekly-activity-average').props).toEqual(
      expect.objectContaining({ strokeDasharray: '4 4' }),
    );
    expect(
      result.getByTestId('weekly-activity-average-label').props.style,
    ).toEqual(TABULAR_NUMS);
  });

  it('promedia solo los días medidos y se calla sin un valor positivo', async () => {
    const measured = await renderChart(
      makeWeek('2026-09-02', [10, 20, 30, null, null, null, null]),
    );

    expect(measured.getByTestId('weekly-activity-average').props).toEqual(
      expect.objectContaining({ y1: 80, y2: 80 }),
    );

    await measured.unmount();
    const noPositive = await renderChart(
      makeWeek('2026-09-02', [0, 0, null, null, null, null, null]),
    );

    expect(noPositive.queryByTestId('weekly-activity-average')).toBeNull();
    expect(
      noPositive.queryByTestId('weekly-activity-average-label'),
    ).toBeNull();
  });
});
