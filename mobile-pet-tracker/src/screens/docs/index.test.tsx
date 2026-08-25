import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { listPetDocs, type PetDocsState } from '../../api/media';
import { getPet, type PetState } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { DocsScreen } from '.';

jest.mock('../../api/media', () => ({ listPetDocs: jest.fn() }));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockListPetDocs = jest.mocked(listPetDocs);
const mockGetPet = jest.mocked(getPet);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function makePet(): PetProfile {
  return {
    id: 'pet-1',
    name: 'Luna',
    species: 'dog',
    breed: null,
    sex: null,
    birthDate: null,
    approxAgeMonths: 12,
    ageMonths: 12,
    currentWeightKg: null,
    size: null,
    color: null,
    sterilized: null,
    microchip: null,
    photoUrl: null,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    myRole: 'owner',
    device: null,
    nextVaccine: null,
    nextReminder: null,
    activitySummary: null,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
  };
}

async function renderDocs() {
  return render(
    <HeroUINativeProvider>
      <DocsScreen petId="pet-1" />
    </HeroUINativeProvider>,
  );
}

describe('R8: pantalla Docs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('uses content-sized skeletons while pet and docs load', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());
    mockListPetDocs.mockReturnValue(pending<PetDocsState>());

    await renderDocs();

    expect(screen.getByTestId('screen-docs')).toBeVisible();
    expect(screen.getByTestId('docs-header-skeleton')).toBeVisible();
    expect(screen.getByTestId('docs-list-skeleton')).toBeVisible();
  });

  it('shows the pet name and ordered type, name, and date rows', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({
      kind: 'ok',
      docs: [
        { id: 'doc-1', type: 'Vacunación', name: 'Antirrábica', date: '2026-07-12' },
        { id: 'doc-2', type: 'Consulta', name: 'Control anual', date: '2026-06-03' },
      ],
    });

    await renderDocs();

    await waitFor(() => expect(screen.getByTestId('doc-doc-1')).toBeVisible());
    expect(screen.getByText('Documentos de')).toBeVisible();
    expect(screen.getByText('Luna')).toBeVisible();
    expect(screen.getByText('Vacunación')).toBeVisible();
    expect(screen.getByText('Antirrábica')).toBeVisible();
    expect(screen.getByText('2026-07-12')).toBeVisible();
    expect(screen.getAllByTestId(/^doc-/).map(({ props }) => props.testID)).toEqual([
      'doc-doc-1',
      'doc-doc-2',
    ]);
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    expect(mockListPetDocs).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('shows a dedicated empty state', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });

    await renderDocs();

    await waitFor(() => expect(screen.getByTestId('docs-empty')).toBeVisible());
  });

  it.each([
    { kind: 'error' },
    { kind: 'not-found' },
    { kind: 'forbidden' },
    { kind: 'unreachable', message: 'offline' },
    { kind: 'missing-config' },
  ] as PetDocsState[])('degrades and retries docs for $kind', async (state) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue(state);

    await renderDocs();
    await waitFor(() => expect(screen.getByTestId('docs-error')).toBeVisible());
    fireEvent.press(screen.getByTestId('docs-retry'));

    await waitFor(() => expect(mockListPetDocs).toHaveBeenCalledTimes(2));
  });

  it('navigates back from the header', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();

    fireEvent.press(screen.getByTestId('docs-back'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
