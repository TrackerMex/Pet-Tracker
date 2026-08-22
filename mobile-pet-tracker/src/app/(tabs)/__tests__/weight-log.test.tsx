import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import {
  createWeight,
  listWeights,
  type CreateWeightState,
  type WeightsState,
} from '../../../api/health-records';
import type { WeightEntry } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../../providers/selected-pet-provider';
import WeightLogScreen from '../weight-log';

jest.mock('../../../api/health-records', () => ({
  createWeight: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    router: { push: jest.fn(), back: jest.fn() },
    Redirect: ({ href }: { href: string }) => {
      const props = { testID: 'weight-log-redirect', href };

      return React.createElement(View, props);
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockCreateWeight = jest.mocked(createWeight);
const mockListWeights = jest.mocked(listWeights);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

function makeWeight(overrides: Partial<WeightEntry> = {}): WeightEntry {
  return {
    id: 'weight-1',
    petId: 'pet-1',
    weightKg: 12.4,
    measuredAt: '2026-08-21',
    bodyCondition: 5,
    variation: 0.4,
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function localTodayIso(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function SelectionProbe() {
  const { selectPet } = useSelectedPet();

  useEffect(() => {
    selectPet('pet-1');
  }, [selectPet]);

  return null;
}

async function renderWeightLog(selected = true) {
  await render(
    <HeroUINativeProvider>
      <SelectedPetProvider>
        {selected ? <SelectionProbe /> : null}
        <WeightLogScreen />
      </SelectedPetProvider>
    </HeroUINativeProvider>,
  );
}

describe('R7: weight log lista el historial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
  });

  it('redirects a cold deep-link without a selected pet', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog(false);

    expect(screen.getByTestId('weight-log-redirect').props.href).toBe('/health');
    expect(screen.queryByTestId('screen-weight-log')).toBeNull();
    expect(mockListWeights).not.toHaveBeenCalled();
  });

  it('shows loading, safe padding, and navigates back', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(screen.getByText('Weight log')).toBeVisible();
    expect(screen.getByTestId('weight-log-loading')).toBeVisible();
    expect(
      screen.getByTestId('screen-weight-log').props.contentContainerStyle,
    ).toEqual(expect.objectContaining({ padding: 24, paddingBottom: 120 }));

    await fireEvent.press(screen.getByTestId('weight-log-back'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('keeps API order and renders each weight detail', async () => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [
        makeWeight(),
        makeWeight({
          id: 'weight-2',
          weightKg: 12,
          measuredAt: '2026-07-21',
          bodyCondition: null,
          variation: null,
        }),
      ],
    });

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-row-weight-1')).toBeVisible(),
    );
    expect(screen.getAllByTestId(/^weight-row-/).map(({ props }) => props.testID)).toEqual([
      'weight-row-weight-1',
      'weight-row-weight-2',
    ]);
    const newest = within(screen.getByTestId('weight-row-weight-1'));
    expect(newest.getByText('12.4 kg')).toBeVisible();
    expect(newest.getByText('2026-08-21')).toBeVisible();
    expect(newest.getByText('+0.4 kg')).toBeVisible();
    expect(newest.getByText('BC 5/9')).toBeVisible();
    const oldest = within(screen.getByTestId('weight-row-weight-2'));
    expect(oldest.getByText('—')).toBeVisible();
    expect(oldest.queryByText(/^BC /)).toBeNull();
    expect(mockListWeights).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('shows the empty state', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-empty')).toHaveTextContent(
        'No weight entries yet',
      ),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind list error', async (state) => {
    mockListWeights
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', weights: [] });

    await renderWeightLog();
    await waitFor(() =>
      expect(screen.getByTestId('weight-log-error')).toHaveTextContent(
        'Something went wrong',
      ),
    );

    await fireEvent.press(screen.getByTestId('weight-log-retry'));

    await waitFor(() => expect(screen.getByTestId('weight-log-empty')).toBeVisible());
    expect(mockListWeights).toHaveBeenCalledTimes(2);
  });
});

describe('R8: weight log monta la gráfica', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
  });

  it('passes loaded entries to the chart', async () => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [
        makeWeight(),
        makeWeight({ id: 'weight-2', measuredAt: '2026-07-21' }),
      ],
    });

    await renderWeightLog();

    await waitFor(() => expect(screen.getByTestId('weight-chart')).toBeVisible());
  });
});

describe('R9: alta de peso con degradación por kind', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  it('renders the inline form with the local date prefilled', async () => {
    mockCreateWeight.mockReturnValue(pending<CreateWeightState>());

    await renderWeightLog();

    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    expect(screen.getByTestId('weight-input').props.keyboardType).toBe(
      'decimal-pad',
    );
    expect(screen.getByTestId('weight-date-input').props.value).toBe(
      localTodayIso(),
    );
    expect(screen.getByTestId('weight-bc-input').props.keyboardType).toBe(
      'number-pad',
    );
  });

  it('rejects an invalid weight without calling the API', async () => {
    mockCreateWeight.mockResolvedValue({ kind: 'error' });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), 'not-a-number');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    expect(screen.getByTestId('weight-form-error')).toHaveTextContent(
      'Enter a valid weight',
    );
    expect(mockCreateWeight).not.toHaveBeenCalled();
  });

  it('submits all fields, clears them, and refetches the list', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ weightKg: 12.8, bodyCondition: 6 }),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.8');
    await fireEvent.changeText(
      screen.getByTestId('weight-date-input'),
      '2026-08-20',
    );
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), '6');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(mockCreateWeight).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        { weightKg: 12.8, measuredAt: '2026-08-20', bodyCondition: 6 },
      ),
    );
    await waitFor(() => expect(mockListWeights).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId('weight-input').props.value).toBe('');
    expect(screen.getByTestId('weight-bc-input').props.value).toBe('');
    expect(screen.getByTestId('weight-date-input').props.value).toBe(
      localTodayIso(),
    );
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
  });

  it('omits body condition when its field is blank', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ bodyCondition: null }),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(mockCreateWeight).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        { weightKg: 12.4, measuredAt: localTodayIso() },
      ),
    );
  });

  it('joins backend validation messages', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'weightKg', message: 'Weight is too high' },
        { path: 'measuredAt', message: 'Date is in the future' },
      ],
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '1000');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-form-error').props.children).toBe(
        'Weight is too high\nDate is in the future',
      ),
    );
  });

  it.each([
    [{ kind: 'forbidden' } as const, 'Only the owner can log weights'],
    [{ kind: 'error' } as const, 'Something went wrong'],
    [{ kind: 'missing-config' } as const, 'Something went wrong'],
    [
      { kind: 'unreachable', message: 'network down' } as const,
      'Cannot reach server',
    ],
  ])('maps $expected.kind to its form error', async (result, message) => {
    mockCreateWeight.mockResolvedValue(result);

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-form-error')).toHaveTextContent(message),
    );
  });

  it('disables submit while the request is pending', async () => {
    mockCreateWeight.mockReturnValue(pending<CreateWeightState>());

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-submit').props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      ),
    );
  });
});
