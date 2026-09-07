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
import {
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
          accessibilityLabel: props.accessibilityLabel,
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
    expect(mockBarChart).not.toHaveBeenCalled();
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
