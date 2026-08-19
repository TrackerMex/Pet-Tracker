import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { fetchHealth, type HealthState } from '../../api/health';
import Index from '../index';

jest.mock('../../api/health', () => ({
  fetchHealth: jest.fn(),
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

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent(state.kind);
    });
    expect(mockFetchHealth).toHaveBeenCalledWith(apiUrl);
  });

  it('rechecks health when retry is pressed', async () => {
    mockFetchHealth
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'ok' });

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent('error');
    });
    fireEvent.press(screen.getByTestId('health-retry'));

    await waitFor(() => {
      expect(screen.getByTestId('health-state')).toHaveTextContent('ok');
      expect(mockFetchHealth).toHaveBeenCalledTimes(2);
    });
  });
});
