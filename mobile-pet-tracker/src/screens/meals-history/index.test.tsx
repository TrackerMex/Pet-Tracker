import { fireEvent, screen, waitFor } from '@testing-library/react-native';
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
    Redirect: ({ href }: { href: string }) =>
      React.createElement(View, { testID: 'meals-history-redirect', href }),
  };
});
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (testID: string) => function MockIcon({ color }: { color?: string }) {
    return <View testID={testID} style={{ color }} />;
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

async function renderHistory(selected = true) {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
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
    expect(screen.getByTestId('screen-meals-history')).toHaveProp('contentContainerStyle', { padding: 24, gap: 16, paddingBottom: 48 });
  });

  it('shows an error and retries until the grid appears', async () => {
    mockGetMealsHistory.mockResolvedValueOnce({ kind: 'error' });
    await renderHistory();
    await waitFor(() => expect(screen.getByTestId('meals-history-error')).toHaveTextContent(es['common.somethingWentWrong']));
    expect(screen.queryByTestId('meals-history-grid')).toBeNull();
    expect(screen.getByTestId('meals-history-retry')).toHaveTextContent(es['common.retry']);
    fireEvent.press(screen.getByTestId('meals-history-retry'));
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
