import * as SecureStore from 'expo-secure-store';

import {
  getStoredLanguage,
  setStoredLanguage,
} from './language-preference';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockGetItem = jest.mocked(SecureStore.getItemAsync);
const mockSetItem = jest.mocked(SecureStore.setItemAsync);

describe('#65 R13: la preferencia de idioma persiste y es best-effort', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(['es', 'en'] as const)('reads the stored %s language', async (language) => {
    mockGetItem.mockResolvedValue(language);

    await expect(getStoredLanguage()).resolves.toBe(language);
    expect(mockGetItem).toHaveBeenCalledWith('language_preference');
  });

  it.each([null, 'fr', ''])('ignores an unsupported value %p', async (value) => {
    mockGetItem.mockResolvedValue(value);

    await expect(getStoredLanguage()).resolves.toBeUndefined();
  });

  it('degrades a read failure to undefined', async () => {
    mockGetItem.mockRejectedValue(new Error('storage unavailable'));

    await expect(getStoredLanguage()).resolves.toBeUndefined();
  });

  it('stores a supported language', async () => {
    mockSetItem.mockResolvedValue();

    await expect(setStoredLanguage('en')).resolves.toBeUndefined();
    expect(mockSetItem).toHaveBeenCalledWith('language_preference', 'en');
  });

  it('swallows a write failure', async () => {
    mockSetItem.mockRejectedValue(new Error('storage unavailable'));

    await expect(setStoredLanguage('es')).resolves.toBeUndefined();
  });
});
