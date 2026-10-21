import { readFileSync } from 'fs';
import { join } from 'path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { HeroUINativeProvider } from 'heroui-native';

import { userKeys } from '../../api/query-keys';
import { getMe, updateMe, type MeState, type ProfileResponse } from '../../api/users';
import { useAuth } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { createQueryClient } from '../../providers/query-provider';
import { EditProfileScreen } from '.';

jest.mock('../../api/users', () => ({ getMe: jest.fn(), updateMe: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => ({ router: { back: jest.fn(), push: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));

const apiUrl = 'http://example.test/v1';
const me: ProfileResponse = {
  id: 'user-1', email: 'ada@example.test', firstName: 'Ada', lastName: 'Lovelace',
  phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City',
  createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z',
};
const mockGetMe = jest.mocked(getMe);
const mockUpdateMe = jest.mocked(updateMe);
const mockSignOut = jest.fn<Promise<void>, []>();

beforeEach(() => {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  jest.mocked(useAuth).mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: mockSignOut,
  });
  mockSignOut.mockResolvedValue(undefined);
  mockGetMe.mockImplementation(() => new Promise(() => undefined));
  mockUpdateMe.mockResolvedValue({ kind: 'ok', me });
});

async function renderEditor(initial: MeState | null = { kind: 'ok', me }) {
  const queryClient = createQueryClient(undefined, 0);
  queryClient.setQueryDefaults(userKeys.me(), { staleTime: Infinity });
  if (initial) queryClient.setQueryData(userKeys.me(), initial);
  const app = await render(
    <HeroUINativeProvider>
      <LanguageProvider initial="en">
        <QueryClientProvider client={queryClient}>
          <HeaderHeightContext.Provider value={91}>
            <EditProfileScreen />
          </HeaderHeightContext.Provider>
        </QueryClientProvider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
  return { app, queryClient };
}

describe('#194 R5: the current profile seeds the editor', () => {
  it('#194 R5: renders the saved values, title and four labels', async () => {
    await renderEditor();
    expect(await screen.findByTestId('edit-profile-first-name')).toHaveProp('value', 'Ada');
    expect(screen.getByTestId('edit-profile-last-name')).toHaveProp('value', 'Lovelace');
    expect(screen.getByTestId('edit-profile-phone')).toHaveProp('value', '+525500000000');
    expect(screen.getByTestId('edit-profile-country')).toHaveProp('value', 'MX');
    expect(screen.getByTestId('edit-profile-title')).toHaveTextContent('Edit profile');
    for (const label of ['First name', 'Last name', 'Phone', 'Country']) {
      expect(screen.getByText(label)).toBeVisible();
    }
  });

  it('#194 R5: orders the four controls without exposing email or the saved zone', async () => {
    await renderEditor();
    const form = await screen.findByTestId('edit-profile-form');
    expect(within(form).getAllByTestId(/^edit-profile-(first-name|last-name|phone|country)$/).map((input) => input.props.testID)).toEqual([
      'edit-profile-first-name', 'edit-profile-last-name', 'edit-profile-phone', 'edit-profile-country',
    ]);
    expect(screen.queryByTestId('edit-profile-email')).toBeNull();
    expect(screen.queryByDisplayValue('ada@example.test')).toBeNull();
    expect(screen.queryByDisplayValue('America/Mexico_City')).toBeNull();
  });

  it('#194 R5: uppercases the country and configures the contact keyboards', async () => {
    await renderEditor();
    const country = await screen.findByTestId('edit-profile-country');
    expect(country).toHaveProp('maxLength', 2);
    expect(country).toHaveProp('autoCapitalize', 'characters');
    await fireEvent.changeText(country, 'mx');
    expect(screen.getByTestId('edit-profile-country')).toHaveProp('value', 'MX');
    expect(screen.getByTestId('edit-profile-phone')).toHaveProp('keyboardType', 'phone-pad');
  });

  it('#194 R5: renders loading and unavailable states without a form', async () => {
    const { app } = await renderEditor(null);
    expect(await screen.findByTestId('edit-profile-skeleton', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByTestId('edit-profile-form')).toBeNull();
    await app.unmount();
    for (const kind of ['error', 'unauthorized'] as const) {
      mockGetMe.mockResolvedValue({ kind });
      const { app: unavailable } = await renderEditor(null);
      expect(await screen.findByTestId('edit-profile-state')).toHaveTextContent('Account unavailable');
      expect(screen.queryByTestId('edit-profile-form')).toBeNull();
      await unavailable.unmount();
    }
  });

  it('#194 R5: uses the native header offset and the pushed screen spacing', async () => {
    await renderEditor();
    const scroll = await screen.findByTestId('screen-edit-profile');
    expect(scroll).toHaveProp('contentContainerStyle', { padding: 24, gap: 16, paddingBottom: 48 });
    expect(scroll).toHaveProp('contentInsetAdjustmentBehavior', 'automatic');
    expect(scroll).toHaveProp('keyboardShouldPersistTaps', 'handled');
    expect(screen.getByTestId('edit-profile-keyboard-avoider')).toBeTruthy();
    const source = readFileSync(join(process.cwd(), 'src/screens/edit-profile/index.tsx'), 'utf8');
    expect(source).toContain('behavior="padding"');
    expect(source).toContain('keyboardVerticalOffset={headerHeight}');
  });

  it('#194 R5: keeps typed values when the profile cache refreshes', async () => {
    const { queryClient } = await renderEditor();
    await fireEvent.changeText(await screen.findByTestId('edit-profile-first-name'), 'Typed name');
    await act(() => queryClient.setQueryData(userKeys.me(), { kind: 'ok', me: { ...me, firstName: 'Refetched name' } }));
    await waitFor(() => expect(screen.getByTestId('edit-profile-first-name')).toHaveProp('value', 'Typed name'));
  });
});


async function changeField(field: string, value: string) {
  await fireEvent.changeText(screen.getByTestId('edit-profile-' + field), value);
}

async function saveProfile() {
  await fireEvent.press(screen.getByTestId('edit-profile-save'));
}

describe('#194 R6: saving validates every editable field', () => {
  it('#194 R6: shows only the required first name issue', async () => {
    await renderEditor();
    await changeField('first-name', '');
    await saveProfile();
    expect(await screen.findByTestId('edit-profile-first-name-message')).toHaveTextContent('Enter your first name');
    expect(screen.getByTestId('edit-profile-first-name-message-row')).toBeTruthy();
    expect(mockUpdateMe).not.toHaveBeenCalled();
    for (const field of ['last-name', 'phone', 'country']) {
      expect(screen.queryByTestId('edit-profile-' + field + '-error')).toBeNull();
    }
  });

  it('#194 R6: shows all four invalid fields together', async () => {
    await renderEditor();
    for (const [field, value] of [['first-name', ''], ['last-name', ''], ['phone', '123'], ['country', 'M']]) {
      await changeField(field, value);
    }
    await saveProfile();
    for (const [field, text] of [
      ['first-name', 'Enter your first name'], ['last-name', 'Enter your last name'],
      ['phone', 'Use at least 7 characters'], ['country', "Enter your country's 2-letter code, like MX"],
    ]) {
      expect(await screen.findByTestId('edit-profile-' + field + '-message')).toHaveTextContent(text);
    }
    expect(mockUpdateMe).not.toHaveBeenCalled();
  });

  it('#194 R6: rejects nonletter countries and oversized surnames', async () => {
    await renderEditor();
    await changeField('country', 'M1');
    await changeField('last-name', 'a'.repeat(121));
    await saveProfile();
    expect(await screen.findByTestId('edit-profile-country-message')).toHaveTextContent('Use only letters A to Z');
    expect(screen.getByTestId('edit-profile-last-name-message')).toHaveTextContent('Use 120 characters or fewer');
    expect(mockUpdateMe).not.toHaveBeenCalled();
  });

  it('#194 R6: replaces issues only on the next save', async () => {
    await renderEditor();
    await changeField('first-name', '');
    await changeField('last-name', '');
    await saveProfile();
    expect(await screen.findByTestId('edit-profile-first-name-message')).toHaveTextContent('Enter your first name');
    await changeField('first-name', 'Ada');
    expect(screen.getByTestId('edit-profile-first-name-message')).toHaveTextContent('Enter your first name');
    await saveProfile();
    await waitFor(() => {
      expect(screen.getByTestId('edit-profile-last-name-message')).toHaveTextContent('Enter your last name');
      expect(screen.queryByTestId('edit-profile-first-name-message')).toBeNull();
    });
  });

  it('#194 R6: removes the error container after correcting the form', async () => {
    await renderEditor();
    await changeField('first-name', '');
    await saveProfile();
    expect(await screen.findByTestId('edit-profile-first-name-message')).toBeVisible();
    expect(screen.getByTestId('edit-profile-first-name-error')).toBeTruthy();
    await changeField('first-name', 'Ada');
    await saveProfile();
    await waitFor(() => {
      expect(screen.getByTestId('edit-profile-first-name')).toHaveProp('value', 'Ada');
      expect(screen.queryByTestId('edit-profile-first-name-error')).toBeNull();
    });
  });

  it('#194 R6: exposes Save changes only for an available profile', async () => {
    const { app } = await renderEditor();
    expect(within(await screen.findByTestId('edit-profile-save')).getByText('Save changes')).toBeVisible();
    await app.unmount();
    for (const initial of [null, { kind: 'error' } as const]) {
      const { app: unavailable } = await renderEditor(initial);
      if (initial) expect(await screen.findByTestId('edit-profile-state')).toHaveTextContent('Account unavailable');
      else expect(await screen.findByTestId('edit-profile-skeleton', { includeHiddenElements: true })).toBeTruthy();
      expect(screen.queryByTestId('edit-profile-save')).toBeNull();
      await unavailable.unmount();
    }
  });
});
