import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { Uniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../../../api/health';
import Index from '../health';

jest.mock('../../../api/health', () => ({
  fetchHealth: jest.fn(),
}));

jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: 'light', hasAdaptiveThemes: false }),
}));

const apiUrl = 'http://example.test/v1';
const mockFetchHealth = jest.mocked(fetchHealth);
const states: HealthState[] = [
  { kind: 'ok' },
  { kind: 'error' },
  { kind: 'unreachable', message: 'network down' },
  { kind: 'missing-config' },
];

describe('R7: health screen states and retry', () => {
  beforeEach(() => {
    mockFetchHealth.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
  });

  it.each(states)('renders $kind', async (state) => {
    mockFetchHealth.mockResolvedValueOnce(state);

    await render(<Index />, { wrapper: HeroUINativeProvider });

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent(state.kind);
    });
    expect(mockFetchHealth).toHaveBeenCalledWith(apiUrl);
  });

  it('rechecks health when retry is pressed', async () => {
    mockFetchHealth
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'ok' });

    await render(<Index />, { wrapper: HeroUINativeProvider });

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent('error');
    });
    await fireEvent.press(screen.getByTestId('health-retry'));

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent('ok');
      expect(mockFetchHealth).toHaveBeenCalledTimes(2);
    });
  });
});

describe('R6: theme toggle', () => {
  beforeEach(() => {
    mockFetchHealth.mockReset();
    mockFetchHealth.mockResolvedValue({ kind: 'ok' });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('switches from light to dark', async () => {
    const setThemeSpy = jest
      .spyOn(Uniwind, 'setTheme')
      .mockImplementation(() => undefined);

    await render(<Index />, { wrapper: HeroUINativeProvider });
    await fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(setThemeSpy).toHaveBeenCalledWith('dark');
  });
});
