import * as SecureStore from 'expo-secure-store';

import { getStoredTheme, setStoredTheme } from './theme-preference';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockGetItem = jest.mocked(SecureStore.getItemAsync);
const mockSetItem = jest.mocked(SecureStore.setItemAsync);

describe('R4: preferencia de tema persistente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(['light', 'dark'] as const)('reads the stored %s theme', async (theme) => {
    mockGetItem.mockResolvedValue(theme);

    await expect(getStoredTheme()).resolves.toBe(theme);
    expect(mockGetItem).toHaveBeenCalledWith('theme_preference');
  });

  it.each([null, 'system', ''])('ignores an unsupported value %p', async (value) => {
    mockGetItem.mockResolvedValue(value);

    await expect(getStoredTheme()).resolves.toBeUndefined();
  });

  it('degrades a read failure to undefined', async () => {
    mockGetItem.mockRejectedValue(new Error('storage unavailable'));

    await expect(getStoredTheme()).resolves.toBeUndefined();
  });

  it('stores a supported theme', async () => {
    mockSetItem.mockResolvedValue();

    await expect(setStoredTheme('dark')).resolves.toBeUndefined();
    expect(mockSetItem).toHaveBeenCalledWith('theme_preference', 'dark');
  });

  it('swallows a write failure', async () => {
    mockSetItem.mockRejectedValue(new Error('storage unavailable'));

    await expect(setStoredTheme('light')).resolves.toBeUndefined();
  });
});
