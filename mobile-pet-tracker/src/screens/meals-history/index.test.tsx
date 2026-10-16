import { readFileSync } from 'fs';
import { join } from 'path';

import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import { getMealsHistory, type MealsHistoryState } from '../../api/nutrition';
import type { MealsHistory } from '../../api/types';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider, useSelectedPet } from '../../providers/selected-pet-provider';
import { MealsHistoryScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

jest.mock('../../api/nutrition', () => ({ getMealsHistory: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    Redirect: ({ href }: { href: string }) => {
      const props = { testID: 'meals-history-redirect', href };
      return React.createElement(View, props);
    },
  };
});
const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    HomeEntrance(props: import('react-native').ViewProps & { index: number }) {
      mockHomeEntrance(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('reicon-react-native', () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (testID: string) => function MockIcon({ color, size }: { color?: string; size?: number }) {
    return <Text testID={testID} style={{ color }} {...{ size }} />;
  };
  return {
    ChevronLeft: icon('meals-history-icon-prev'),
    ChevronRight: icon('meals-history-icon-next'),
  };
});
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map(token => `token:${token}`),
}));

const mockGetMealsHistory = jest.mocked(getMealsHistory);
const mockSignOut = jest.fn<Promise<void>, []>();

function history(empty = false): MealsHistory {
  return {
    from: '2026-01-01', to: '2026-01-31', today: '2026-01-15',
    days: Array.from({ length: 31 }, (_, index) => {
      const date = `2026-01-${String(index + 1).padStart(2, '0')}`;
      const mealTimes = empty ? [] : index === 4 ? ['08:00', '18:30'] : index === 13 ? ['12:00'] : [];
      return { date, mealTimes };
    }),
  };
}

function SelectionProbe() {
  const { selectPet } = useSelectedPet();
  useEffect(() => { selectPet('pet-1'); }, [selectPet]);
  return null;
}

async function renderHistory(selected = true, language: 'es' | 'en' = 'es') {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <MealsHistoryScreen />
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
  jest.useFakeTimers({ now: Date.UTC(2026, 0, 15, 12) });
  jest.clearAllMocks();
  mockGetMealsHistory.mockReset();
  mockGetMealsHistory.mockResolvedValue({ kind: 'ok', history: history() });
  mockSignOut.mockResolvedValue(undefined);
  process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  jest.mocked(useAuth).mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: mockSignOut,
  } satisfies AuthContextValue);
});
afterEach(() => jest.useRealTimers());

describe('#105 R9: meals history preserves the four screen states', () => {
  it('redirects without querying when no pet is selected', async () => {
    await renderHistory(false);
    await waitFor(() => expect(screen.getByTestId('meals-history-redirect')).toHaveProp('href', '/food'));
    expect(screen.queryByTestId('screen-meals-history')).toBeNull();
    expect(mockGetMealsHistory).not.toHaveBeenCalled();
  });

  it('shows only one skeleton while the initial request is pending', async () => {
    mockGetMealsHistory.mockReturnValue(new Promise<MealsHistoryState>(() => undefined));
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-skeleton')).toBeVisible());
    expect(screen.getAllByTestId('meals-history-skeleton')).toHaveLength(1);
    expect(screen.queryByTestId('meals-history-grid')).toBeNull();
    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentInsetAdjustmentBehavior', 'automatic');
    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', { paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 });
  });

  it('shows an error and retries until the grid appears', async () => {
    mockGetMealsHistory.mockResolvedValueOnce({ kind: 'error' });
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-error')).toHaveTextContent(es['common.somethingWentWrong']));
    expect(screen.queryByTestId('meals-history-grid')).toBeNull();
    expect(screen.getByTestId('meals-history-retry')).toHaveTextContent(es['common.retry']);
    await fireEvent.press(screen.getByTestId('meals-history-retry'));
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(mockGetMealsHistory).toHaveBeenCalledTimes(2);
    expect(mockGetMealsHistory).toHaveBeenLastCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '2026-01-01', '2026-01-31');
    expect(screen.queryByTestId('meals-history-error')).toBeNull();
  });

  it.each(['unreachable', 'not-found', 'missing-config'] as const)('shows the same recoverable error for %s', async kind => {
    mockGetMealsHistory.mockResolvedValue(kind === 'unreachable' ? { kind, message: 'offline' } : { kind });
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-error')).toHaveTextContent(es['common.somethingWentWrong']));
    expect(screen.queryByTestId('meals-history-grid')).toBeNull();
    expect(screen.getByTestId('meals-history-retry')).toBeVisible();
  });

  it('signs out exactly once for unauthorized data', async () => {
    mockGetMealsHistory.mockResolvedValue({ kind: 'unauthorized' });
    await renderHistory();
    await waitFor(() => {
      expect(screen.getByTestId('screen-meals-history')).toBeVisible();
      expect(screen.queryByTestId('meals-history-skeleton')).toBeNull();
    });
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('keeps the grid visible for an empty month without dots', async () => {
    mockGetMealsHistory.mockResolvedValue({ kind: 'ok', history: history(true) });
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.getByTestId('meals-history-empty')).toHaveTextContent('Este mes no se sirvió ninguna comida');
    expect(screen.queryAllByTestId('meals-history-dot')).toHaveLength(0);
  });

  it('shows the grid without an empty message for a served month', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.queryByTestId('meals-history-empty')).toBeNull();
  });
});


describe('#105 R11: the civil month grid renders six decisions per day', () => {
  it('starts the seven weekday headers with Monday', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    const weekdays = screen.getByTestId('meals-history-weekdays');
    expect(weekdays.children).toHaveLength(7);
    const monday = new Date(Date.UTC(2024, 0, 1)).toLocaleDateString('es-MX', { weekday: 'narrow', timeZone: 'UTC' });
    expect(within(weekdays).getByText(monday)).toBeVisible();
    const first = weekdays.children[0];
    expect(typeof first === 'string' ? first : first.children[0]).toBe(monday);
  });

  it('renders five rows of seven cells including four empty fillers', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    const rows = screen.getByTestId('meals-history-grid').children;
    expect(rows).toHaveLength(5);
    for (const row of rows) {
      expect(typeof row).not.toBe('string');
      if (typeof row !== 'string') expect(row.children).toHaveLength(7);
    }
    const fillers = screen.getAllByTestId('meals-history-filler');
    expect(fillers).toHaveLength(4);
    for (const filler of fillers) expect(filler.children).toHaveLength(0);
    const first = rows[0];
    if (typeof first !== 'string') {
      expect(first.children.slice(0, 3).map(cell => typeof cell === 'string' ? cell : cell.props.testID))
        .toEqual(['meals-history-filler', 'meals-history-filler', 'meals-history-filler']);
    }
  });

  it('adds exactly one dot only to each served day', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    const served = screen.getByTestId('meals-history-day-2026-01-05');
    expect(served.children).toHaveLength(2);
    expect(within(served).getByTestId('meals-history-dot')).toBeVisible();
    const empty = screen.getByTestId('meals-history-day-2026-01-06');
    expect(empty.children).toHaveLength(2);
    expect(within(empty).queryByTestId('meals-history-dot')).toBeNull();
    expect(screen.getAllByTestId('meals-history-dot')).toHaveLength(2);
  });

  it('disables the sixteen future dates but allows today', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.getByTestId('meals-history-day-2026-01-16')).toBeDisabled();
    expect(screen.getByTestId('meals-history-day-2026-01-15')).not.toBeDisabled();
    expect(screen.getAllByTestId(/^meals-history-day-/).filter(cell => cell.props.accessibilityState?.disabled)).toHaveLength(16);
  });

  it('marks today exactly once inside its own cell', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    const today = screen.getByTestId('meals-history-day-2026-01-15');
    expect(within(today).getByTestId('meals-history-today')).toHaveTextContent('15');
    expect(screen.getAllByTestId('meals-history-today')).toHaveLength(1);
  });

  it('labels each day as a button with its civil long date', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.getByTestId('meals-history-day-2026-01-05')).toHaveProp('accessibilityLabel', 'lunes, 5 de enero');
    expect(screen.getByTestId('meals-history-day-2026-01-05')).toHaveProp('accessibilityRole', 'button');
    expect(screen.getByTestId('meals-history-day-2026-01-05')).toHaveProp('accessibilityState', { disabled: false, selected: false });
  });

  it('keeps the agreed capsule colors and tabular source anchors', () => {
    const source = readFileSync(join(process.cwd(), 'src/screens/meals-history/index.tsx'), 'utf8');
    function opening(testID: string) {
      const anchor = source.indexOf(`testID="${testID}"`);
      expect(anchor).toBeGreaterThan(-1);
      expect(source.lastIndexOf(`testID="${testID}"`)).toBe(anchor);
      return source.slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor)).split('/>')[0];
    }
    expect(opening('meals-history-today')).toContain('text-15 font-black text-accent-strong');
    expect(opening('meals-history-dot')).toContain('size-1.25 rounded-full bg-accent');
    expect(source.match(/bg-tab-pill/g)).toHaveLength(1);
    expect(source.match(/style=\{TABULAR_NUMS\}/g)).toHaveLength(2);
  });
});

function historyRange(from: string, to: string): MealsHistory {
  return {
    from, to, today: '2026-01-15',
    days: Array.from({ length: Number(to.slice(8)) }, (_, index) => ({
      date: `${from.slice(0, 7)}-${String(index + 1).padStart(2, '0')}`,
      mealTimes: [],
    })),
  };
}

describe('#105 R12: month navigation stops at the owner current month', () => {
  beforeEach(() => {
    mockGetMealsHistory.mockImplementation(async (_url, _token, _pet, from, to) => ({ kind: 'ok', history: historyRange(from, to) }));
  });

  it('starts in January and disables only the next button', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.getByTestId('meals-history-title')).toHaveTextContent('enero de 2026');
    expect(screen.getByTestId('meals-history-next')).toBeDisabled();
    expect(screen.getByTestId('meals-history-prev')).not.toBeDisabled();
    expect(screen.getByTestId('meals-history-next')).toHaveProp('accessibilityState', { disabled: true });
    expect(screen.getByTestId('meals-history-icon-next')).toHaveStyle({ color: 'token:muted' });
    expect(screen.getByTestId('meals-history-prev')).toHaveProp('accessibilityLabel', 'Mes anterior');
    expect(screen.getByTestId('meals-history-next')).toHaveProp('accessibilityLabel', 'Mes siguiente');
    expect(mockGetMealsHistory).toHaveBeenCalledTimes(1);
    expect(mockGetMealsHistory).toHaveBeenLastCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '2026-01-01', '2026-01-31');
  });

  it('moves to December with its range and no leading fillers', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-prev'));
    await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent('diciembre de 2025'));
    expect(mockGetMealsHistory).toHaveBeenCalledTimes(2);
    expect(mockGetMealsHistory).toHaveBeenLastCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '2025-12-01', '2025-12-31');
    expect(screen.getByTestId('meals-history-next')).not.toBeDisabled();
    const row = screen.getByTestId('meals-history-grid').children[0];
    if (typeof row !== 'string') {
      const first = row.children[0];
      expect(typeof first === 'string' ? first : first.props.testID).toMatch(/^meals-history-day-/);
    }
  });

  it('keeps the new month grid without skeleton or old dots while loading', async () => {
    mockGetMealsHistory.mockResolvedValueOnce({ kind: 'ok', history: history() });
    mockGetMealsHistory.mockReturnValueOnce(new Promise<MealsHistoryState>(() => undefined));
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.getAllByTestId('meals-history-dot')).toHaveLength(2);
    await fireEvent.press(screen.getByTestId('meals-history-prev'));
    await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent('diciembre de 2025'));
    expect(screen.getByTestId('meals-history-grid')).toBeVisible();
    expect(screen.queryByTestId('meals-history-skeleton')).toBeNull();
    expect(screen.queryAllByTestId('meals-history-dot')).toHaveLength(0);
  });

  it('moves back without a lower bound and forward to November', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    for (const title of ['diciembre de 2025', 'noviembre de 2025', 'octubre de 2025']) {
      await fireEvent.press(screen.getByTestId('meals-history-prev'));
      await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent(title));
    }
    expect(mockGetMealsHistory).toHaveBeenCalledTimes(4);
    expect(mockGetMealsHistory).toHaveBeenLastCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '2025-10-01', '2025-10-31');
    await fireEvent.press(screen.getByTestId('meals-history-next'));
    await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent('noviembre de 2025'));
    expect(mockGetMealsHistory).toHaveBeenCalledTimes(5);
    expect(mockGetMealsHistory).toHaveBeenLastCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '2025-11-01', '2025-11-30');
  });

  it('allows all December dates because the backend today is in January', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-prev'));
    await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent('diciembre de 2025'));
    for (const day of screen.getAllByTestId(/^meals-history-day-/)) expect(day).not.toBeDisabled();
  });
});

describe('#105 R13: tapping a served day reveals its inline detail', () => {
  it('starts without a selected day or detail', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    expect(screen.queryByTestId('meals-history-detail')).toBeNull();
  });

  it('shows both served times in order and selects the fifth day', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail')).toBeVisible());
    expect(screen.getByTestId('meals-history-detail-title')).toHaveTextContent('lunes, 5 de enero');
    expect(screen.getAllByTestId('meals-history-detail-time').map(time => time.children.join(''))).toEqual(['08:00', '18:30']);
    expect(screen.getByTestId('meals-history-detail-count')).toHaveTextContent('{{count}} comidas servidas'.replace('{{count}}', '2'));
    expect(screen.getByTestId('meals-history-day-2026-01-05')).toBeSelected();
  });

  it('switches to a single served meal and deselects the previous day', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-14'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail-count')).toHaveTextContent('1 comida servida'));
    expect(screen.getAllByTestId('meals-history-detail-time').map(time => time.children.join(''))).toEqual(['12:00']);
    expect(screen.getByTestId('meals-history-day-2026-01-05')).not.toBeSelected();
    expect(screen.getByTestId('meals-history-day-2026-01-14')).toBeSelected();
  });

  it('shows a day without meals and hides the detail on the second tap', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-06'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail-empty')).toHaveTextContent('Ese día no se sirvió ninguna comida'));
    expect(screen.queryAllByTestId('meals-history-detail-time')).toHaveLength(0);
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-06'));
    await waitFor(() => expect(screen.getByTestId('meals-history-day-2026-01-06')).not.toBeSelected());
    expect(screen.queryByTestId('meals-history-detail')).toBeNull();
  });

  it('ignores future days without showing a detail', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-20'));
    expect(screen.queryByTestId('meals-history-detail')).toBeNull();
  });

  it('keeps the selected detail when a future day is tapped', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-20'));
    expect(screen.getByTestId('meals-history-detail-title')).toHaveTextContent('lunes, 5 de enero');
    expect(screen.getByTestId('meals-history-day-2026-01-05')).toBeSelected();
  });

  it('clears the selected detail when moving to the previous month', async () => {
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-grid')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await waitFor(() => expect(screen.getByTestId('meals-history-detail')).toBeVisible());
    await fireEvent.press(screen.getByTestId('meals-history-prev'));
    await waitFor(() => expect(screen.getByTestId('meals-history-title')).toHaveTextContent('diciembre de 2025'));
    expect(screen.queryByTestId('meals-history-detail')).toBeNull();
  });
});


describe('#179 R9: marco y título en contenido', () => {
  function expectHeading() {
    const heading = screen.getByTestId('meals-history-heading');
    expect(heading).toHaveTextContent('Historial de comidas');
    expect(heading).toHaveProp('accessibilityRole', 'header');
    expect(heading).toHaveProp('className', 'text-2xl font-black tracking-title text-foreground');
  }

  it('conserva el marco y el título mientras carga el mes', async () => {
    mockGetMealsHistory.mockReturnValue(new Promise<MealsHistoryState>(() => undefined));
    await renderHistory();
    await screen.findByTestId('meals-history-skeleton');
    expectHeading();
    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', {
      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
    });
  });

  it('conserva el título en el estado de error', async () => {
    mockGetMealsHistory.mockResolvedValue({ kind: 'error' });
    await renderHistory();
    await screen.findByTestId('meals-history-error');
    expectHeading();
  });

  it('muestra un único título cuando el calendario está cargado', async () => {
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    expectHeading();
    expect(screen.getAllByText('Historial de comidas')).toHaveLength(1);
  });
});


describe('#179 R10: calendario del artboard', () => {
  function expectCalendar(empty: boolean, labels: readonly string[]) {
    const calendar = screen.getByTestId('meals-history-calendar');
    expect(calendar).toHaveProp('className', 'gap-2 rounded-24 border border-border bg-surface p-3.5');
    expect(calendar).toHaveStyle({ borderCurve: 'continuous' });
    expect(calendar.children).toHaveLength(empty ? 4 : 3);
    expect(calendar.children.map(child => typeof child === 'string' ? undefined : child.props.testID)).toEqual(
      empty ? [undefined, 'meals-history-weekdays', 'meals-history-grid', 'meals-history-empty'] : [undefined, 'meals-history-weekdays', 'meals-history-grid'],
    );
    expect(mockHomeEntrance).toHaveBeenCalledWith(expect.objectContaining({ testID: 'meals-history-calendar-entry', index: 0 }));
    const weekdays = within(calendar).getByTestId('meals-history-weekdays');
    expect(weekdays.children).toHaveLength(7);
    expect(weekdays.children.map(child => typeof child === 'string' ? child : child.children[0])).toEqual(labels);
    for (const child of weekdays.children) {
      expect(child).toHaveProp('className', 'flex-1 text-center text-xs font-bold text-muted');
    }
    expect(within(calendar).getByTestId('meals-history-title')).toHaveProp('className', 'text-base font-extrabold text-foreground');
    for (const direction of ['prev', 'next']) {
      const arrow = within(calendar).getByTestId(`meals-history-${direction}`);
      expect(arrow).toHaveProp('className', 'size-10 items-center justify-center rounded-xl bg-default');
      expect(arrow).toHaveProp('hitSlop', { top: 6, bottom: 6, left: 6, right: 6 });
      expect(arrow).toHaveStyle({ borderCurve: 'continuous', opacity: 1 });
      expect(within(arrow).getByTestId(`meals-history-icon-${direction}`)).toHaveProp('size', 18);
    }
    return calendar;
  }

  it('muestra cabecera, días y cuadrícula en un mes con comidas', async () => {
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    const calendar = expectCalendar(false, ['L', 'M', 'M', 'J', 'V', 'S', 'D']);
    expect(within(calendar).queryByTestId('meals-history-empty')).toBeNull();
    expect(screen.queryByTestId('meals-history-detail')).toBeNull();
  });

  it('añade solo el mensaje del mes vacío después de la cuadrícula', async () => {
    mockGetMealsHistory.mockResolvedValue({ kind: 'ok', history: history(true) });
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    const calendar = expectCalendar(true, ['L', 'M', 'M', 'J', 'V', 'S', 'D']);
    expect(within(calendar).getByTestId('meals-history-empty')).toHaveTextContent('Este mes no se sirvió ninguna comida');
  });

  it('conserva las siete iniciales inglesas aunque se repitan', async () => {
    await renderHistory(true, 'en');
    await screen.findByTestId('meals-history-grid');
    expectCalendar(false, ['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });
});


describe('#179 R11: celdas del artboard', () => {
  it.each([
    { label: 'hoy con comidas', date: '2026-01-15', meals: true, selected: false, numberClass: 'text-15 font-black text-accent-strong' },
    { label: 'hoy sin comidas', date: '2026-01-15', meals: false, selected: false, numberClass: 'text-15 font-black text-accent-strong' },
    { label: 'pasado con comidas seleccionado', date: '2026-01-05', meals: true, selected: true, numberClass: 'text-15 font-black text-accent-strong' },
    { label: 'pasado sin comidas seleccionado', date: '2026-01-06', meals: false, selected: true, numberClass: 'text-15 font-black text-accent-strong' },
    { label: 'pasado con comidas no seleccionado', date: '2026-01-05', meals: true, selected: false, numberClass: 'text-15 font-semibold text-foreground' },
    { label: 'pasado sin comidas', date: '2026-01-06', meals: false, selected: false, numberClass: 'text-15 font-semibold text-foreground' },
    { label: 'futuro', date: '2026-01-16', meals: false, selected: false, numberClass: 'text-15 font-medium text-muted' },
    { label: 'diciembre de 2025 con comidas', date: '2025-12-05', meals: true, selected: false, numberClass: 'text-15 font-semibold text-foreground' },
  ])('$label', async ({ date, meals, selected, numberClass }) => {
    mockGetMealsHistory.mockImplementation(async (_url, _token, _pet, from, to) => {
      const sample = historyRange(from, to);
      return { kind: 'ok', history: { ...sample, days: sample.days.map(day => ({
        ...day, mealTimes: day.date === date && meals ? ['08:00'] : [],
      })) } };
    });
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    if (date.startsWith('2025-12')) {
      await fireEvent.press(screen.getByTestId('meals-history-prev'));
    }
    const cell = await screen.findByTestId(`meals-history-day-${date}`);
    if (meals) {
      await waitFor(() => expect(within(cell).getByTestId('meals-history-dot')).toBeVisible());
    }
    if (selected) {
      await fireEvent.press(cell);
      await waitFor(() => expect(cell).toBeSelected());
    }
    expect(cell).toHaveProp('className', selected
      ? 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full bg-tab-pill'
      : 'h-11 flex-1 items-center justify-center gap-0.5 rounded-full');
    expect(cell.children).toHaveLength(2);
    const number = cell.children[0];
    const marker = cell.children[1];
    if (typeof number === 'string' || typeof marker === 'string') throw new Error('Expected day nodes');
    expect(number).toHaveTextContent(String(Number(date.slice(8))));
    expect(number).toHaveProp('className', numberClass);
    if (date === '2026-01-15') expect(number).toHaveProp('testID', 'meals-history-today');
    expect(marker).toHaveProp('testID', meals ? 'meals-history-dot' : 'meals-history-spacer');
    expect(marker).toHaveProp('className', meals ? 'size-1.25 rounded-full bg-accent' : 'size-1.25');
  });
});

describe('#179 R12: panel del día', () => {
  function expectPanel(count: number, title: string) {
    const detail = screen.getByTestId('meals-history-detail');
    expect(detail).toHaveProp('className', 'gap-2.5 rounded-24 bg-surface-secondary p-4');
    expect(detail).toHaveStyle({ borderCurve: 'continuous' });
    expect(detail.children).toHaveLength(2);
    const header = detail.children[0];
    if (typeof header === 'string') throw new Error('Expected panel header');
    expect(header).toHaveProp('className', 'flex-row items-center justify-between gap-2');
    expect(header.children).toHaveLength(count === 0 ? 1 : 2);
    const heading = within(header).getByTestId('meals-history-detail-title');
    expect(heading).toHaveTextContent(title);
    expect(heading).toHaveProp('className', 'flex-1 text-base font-extrabold text-foreground');
    expect(header.children[0]).toBe(heading);
    if (count > 0) {
      const badge = within(header).getByTestId('meals-history-detail-count');
      expect(header.children[1]).toBe(badge);
      expect(badge).toHaveProp('className', 'rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-accent-foreground');
      expect(badge).toHaveTextContent(`${count} comidas servidas`);
    } else {
      expect(within(header).queryByTestId('meals-history-detail-count')).toBeNull();
    }
    expect(mockHomeEntrance).toHaveBeenCalledWith(expect.objectContaining({ testID: 'meals-history-detail-entry', index: 1 }));
    return detail;
  }

  function expectTimes(detail: ReturnType<typeof screen.getByTestId>, values: readonly string[]) {
    const times = within(detail).getByTestId('meals-history-detail-times');
    expect(detail.children[1]).toBe(times);
    expect(times).toHaveProp('className', 'flex-row flex-wrap gap-2');
    expect(times.children).toHaveLength(values.length);
    times.children.forEach((box, index) => {
      if (typeof box === 'string') throw new Error('Expected time box');
      expect(box).toHaveProp('className', 'min-w-20 flex-1 items-center rounded-14 bg-surface p-2.5');
      expect(box).toHaveStyle({ borderCurve: 'continuous' });
      expect(box.children).toHaveLength(1);
      const time = within(box).getByTestId('meals-history-detail-time');
      expect(time).toHaveTextContent(values[index]);
      expect(time).toHaveProp('className', 'text-15 font-extrabold text-foreground');
    });
  }

  it('separa el panel del calendario y muestra dos horas con badge', async () => {
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await screen.findByTestId('meals-history-detail');
    const calendar = screen.getByTestId('meals-history-calendar');
    expect(within(calendar).queryByTestId('meals-history-detail')).toBeNull();
    const detail = expectPanel(2, 'lunes, 5 de enero');
    expectTimes(detail, ['08:00', '18:30']);
  });

  it('muestra cabecera sin badge y el mensaje de un día sin comidas', async () => {
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-06'));
    await screen.findByTestId('meals-history-detail');
    const detail = expectPanel(0, 'martes, 6 de enero');
    expect(detail.children[1]).toHaveProp('testID', 'meals-history-detail-empty');
    expect(within(detail).getByTestId('meals-history-detail-empty')).toHaveTextContent('Ese día no se sirvió ninguna comida');
    expect(within(detail).queryByTestId('meals-history-detail-times')).toBeNull();
  });

  it('conserva cinco cajas de hora en el contenedor que permite envolver', async () => {
    const sample = history();
    sample.days[4].mealTimes = ['06:00', '09:00', '12:00', '15:00', '18:00'];
    mockGetMealsHistory.mockResolvedValue({ kind: 'ok', history: sample });
    await renderHistory();
    await screen.findByTestId('meals-history-grid');
    await fireEvent.press(screen.getByTestId('meals-history-day-2026-01-05'));
    await screen.findByTestId('meals-history-detail');
    expectTimes(expectPanel(5, 'lunes, 5 de enero'), ['06:00', '09:00', '12:00', '15:00', '18:00']);
  });
});
