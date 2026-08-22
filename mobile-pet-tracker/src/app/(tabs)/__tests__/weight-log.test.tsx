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
  const React = require('react');
  const { View } = require('react-native');

  return {
    router: { push: jest.fn(), back: jest.fn() },
    Redirect: ({ href }: { href: string }) =>
      React.createElement(View, { testID: 'weight-log-redirect', href }),
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
