import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import { getDocumentAsync } from 'expo-document-picker';
import { openBrowserAsync } from 'expo-web-browser';

import {
  confirmPetDocumentUpload,
  createPetDocument,
  listPetDocs,
  uploadPhotoToUrl,
  type PetDocsState,
} from '../../api/media';
import { getPet, type PetState } from '../../api/pets';
import { mediaKeys, petKeys } from '../../api/query-keys';
import type { PetProfile } from '../../api/types';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { DocsScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

jest.mock('../../api/media', () => ({
  ...jest.requireActual('../../api/media'),
  listPetDocs: jest.fn(),
  createPetDocument: jest.fn(),
  uploadPhotoToUrl: jest.fn(),
  confirmPetDocumentUpload: jest.fn(),
}));
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockListPetDocs = jest.mocked(listPetDocs);
const mockGetPet = jest.mocked(getPet);
const mockUseAuth = jest.mocked(useAuth);

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
    mealsToday: null,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
  };
}

async function renderDocs() {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <DocsScreen petId="pet-1" />
      </LanguageProvider>
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
        { id: 'doc-1', type: 'Vacunación', name: 'Antirrábica', date: '2026-07-12', downloadUrl: 'http://download.test/document.pdf' },
        { id: 'doc-2', type: 'Consulta', name: 'Control anual', date: '2026-06-03', downloadUrl: 'http://download.test/document.pdf' },
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

});

describe('#62 R10: el tipo de documento se lee como badge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({
      kind: 'ok',
      docs: [
        {
          id: 'doc-1',
          type: 'Vacunación',
          name: 'Antirrábica',
          date: '2026-07-12',
          downloadUrl: 'http://download.test/document.pdf',
        },
      ],
    });
  });

  it('aplica la receta monocroma al tipo sin cambiar su texto', async () => {
    await renderDocs();

    expect((await screen.findByText('Vacunación')).props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-category-blue text-category-blue-strong',
    );
  });
});

describe('#64 R8: la fila de documento pinta icono y badge con el color de su tipo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({
      kind: 'ok',
      docs: [
        {
          id: 'vaccine',
          type: 'Vacunación',
          name: 'Antirrábica',
          date: '2026-07-12',
          downloadUrl: 'http://download.test/document.pdf',
        },
        {
          id: 'unknown',
          type: 'Radiografía',
          name: 'Cadera',
          date: '2026-06-03',
          downloadUrl: 'http://download.test/document.pdf',
        },
      ],
    });
  });

  it('aplica el hueco conocido y conserva neutral para texto libre', async () => {
    await renderDocs();

    const vaccineRow = within(await screen.findByTestId('doc-vaccine'));
    const unknownRow = within(screen.getByTestId('doc-unknown'));
    const vaccineTile = vaccineRow.getByText('📄').parent;
    const unknownTile = unknownRow.getByText('📄').parent;

    expect(vaccineTile?.props.className).toContain('bg-category-blue');
    expect(vaccineTile?.props.className).not.toContain('bg-accent-soft');
    expect(vaccineRow.getByText('Vacunación').props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-category-blue text-category-blue-strong',
    );
    expect(unknownTile?.props.className).toContain('bg-default');
    expect(unknownTile?.props.className).not.toContain('bg-accent-soft');
    expect(unknownRow.getByText('Radiografía').props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-2xs font-bold bg-default text-muted',
    );
    expect(vaccineRow.getByText('📄')).toBeVisible();
    expect(unknownRow.getByText('📄')).toBeVisible();
  });
});

describe('#87 R9: DocsScreen lee por TanStack Query', () => {
  it('deja cada recurso en la caché bajo su clave', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    });
    const petState: PetState = { kind: 'ok', pet: makePet() };
    const docsState: PetDocsState = {
      kind: 'ok',
      docs: [
        {
          id: 'doc-cache',
          type: 'Vacunación',
          name: 'Antirrábica',
          date: '2026-07-12',
          downloadUrl: 'http://download.test/document.pdf',
        },
      ],
    };
    mockGetPet.mockResolvedValue(petState);
    mockListPetDocs.mockResolvedValue(docsState);

    const { queryClient } = await renderWithProviders(
      <HeroUINativeProvider>
        <LanguageProvider initial="es">
          <DocsScreen petId="pet-1" />
        </LanguageProvider>
      </HeroUINativeProvider>,
    );
    await screen.findByTestId('doc-doc-cache');

    expect(queryClient.getQueryData(petKeys.detail('pet-1'))).toEqual(
      petState,
    );
    expect(queryClient.getQueryData(mediaKeys.petDocs('pet-1'))).toEqual(
      docsState,
    );
  });
});

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón y conserva Documentos de', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await waitFor(() => expect(screen.getByText(es['docs.documentsOf'])).toBeVisible());
    expect(screen.queryByTestId('docs-back')).toBeNull();
  });
});

describe('#95 R6: métricas bajo cabecera nativa', () => {
  it('usa solo el inset inferior del dispositivo', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockGetPet.mockReturnValue(pending<PetState>());
    mockListPetDocs.mockReturnValue(pending<PetDocsState>());
    await renderDocs();
    expect(screen.getByTestId('screen-docs').props.contentContainerStyle).toEqual({
      padding: 24, gap: 16, paddingBottom: 48,
    });
  });
});

describe('#155 R7: sin documentos, Pingo los guarda', () => {
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

  it('queda en el sitio del vacío que sustituye', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await screen.findByTestId('docs-empty-pose');
    const slot = screen.getByTestId('docs-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-docs');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['View', 'docs-empty']);
  });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    const pose = await screen.findByTestId('docs-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-health\.webp$/) }),
    ]);
    expect(screen.getByTestId('docs-empty-title')).toHaveTextContent('Aún no hay documentos');
    expect(screen.getByTestId('docs-empty-body')).toHaveTextContent('Cuando se suba un documento médico de tu mascota, te lo guardo aquí.');
  });

  it('no ofrece acción a quien no es owner (#158 R4)', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole: 'family' } });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await screen.findByTestId('docs-empty-title');
    expect(screen.queryByTestId('docs-empty-action')).toBeNull();
  });
});

const mockGetDocumentAsync = jest.mocked(getDocumentAsync);
const mockOpenBrowserAsync = jest.mocked(openBrowserAsync);
const mockCreatePetDocument = jest.mocked(createPetDocument);
const mockUploadPhotoToUrl = jest.mocked(uploadPhotoToUrl);
const mockConfirmPetDocumentUpload = jest.mocked(confirmPetDocumentUpload);
const mockSignOut = jest.fn();
const originalFetch = globalThis.fetch;
const documentBlob = new Blob(['PDF bytes']);
const mockAssetBlob = jest.fn();
const mockAssetFetch = jest.fn();
const docOne = {
  id: 'doc-1', type: 'Vacunación', name: 'Antirrábica', date: '2026-07-12',
  downloadUrl: 'http://download.test/doc-1.pdf',
};

beforeEach(() => {
  jest.resetAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: mockSignOut,
  });
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
  mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [docOne] });
  mockGetDocumentAsync.mockResolvedValue({ canceled: true, assets: null });
  mockOpenBrowserAsync.mockReturnValue(pending());
  mockCreatePetDocument.mockResolvedValue({ kind: 'ok', documentId: 'doc-2', uploadUrl: 'http://upload.test/doc-2' });
  mockUploadPhotoToUrl.mockResolvedValue({ kind: 'ok' });
  mockConfirmPetDocumentUpload.mockResolvedValue({ kind: 'ok' });
  mockAssetBlob.mockResolvedValue(documentBlob);
  mockAssetFetch.mockResolvedValue({ blob: mockAssetBlob });
  globalThis.fetch = mockAssetFetch as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function docsChildren() {
  const container = screen.getByTestId('screen-docs').children[0];
  if (typeof container === 'string') throw new Error('Expected scroll content');
  return container.children.map(child => typeof child === 'string' ? child : (child.props.testID ?? child.type));
}

describe('#158 R3: el owner ve la acción de subir', () => {
  it('con documentos pinta el botón, sus clases y el orden exacto', async () => {
    await renderDocs();
    await screen.findByText('Luna');
    await screen.findByTestId('doc-doc-1');
    const button = await screen.findByTestId('docs-upload');
    expect(button).toHaveTextContent('Subir documento');
    expect(docsChildren()).toEqual(['View', 'docs-upload', 'doc-doc-1']);
    expect(button.props.className).toEqual(expect.stringContaining('rounded-xl'));
    expect(button.props.className).toEqual(expect.stringContaining('bg-accent'));
    const label = within(button).getByText('Subir documento');
    expect(label.props.className).toEqual(expect.stringContaining('font-bold'));
    expect(label.props.className).toEqual(expect.stringContaining('text-accent-foreground'));
  });

  it('en el vacío pinta la acción de Pingo', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await screen.findByText('Luna');
    expect(await screen.findByTestId('docs-empty-action')).toHaveTextContent('Subir documento');
  });

  it.each([
    ['docs-upload', [docOne]],
    ['docs-empty-action', []],
  ] as const)('abre el selector desde %s', async (entry, docs) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [...docs] });
    await renderDocs();
    await screen.findByText('Luna');
    fireEvent.press(await screen.findByTestId(entry));
    expect(mockGetDocumentAsync).toHaveBeenCalledTimes(1);
    expect(mockGetDocumentAsync).toHaveBeenCalledWith({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
      multiple: false,
    });
  });

  it.each(['pending', 'not-found', 'forbidden', 'unauthorized', 'error', 'unreachable', 'missing-config'] as const)(
    'sin entradas con lista %s', async (kind) => {
      if (kind === 'pending') mockListPetDocs.mockReturnValue(pending<PetDocsState>());
      else if (kind === 'unreachable') mockListPetDocs.mockResolvedValue({ kind, message: 'offline' });
      else mockListPetDocs.mockResolvedValue({ kind });
      await renderDocs();
      await screen.findByText('Luna');
      await screen.findByTestId(kind === 'pending' ? 'docs-list-skeleton' : 'docs-error');
      expect(screen.queryByTestId('docs-upload')).toBeNull();
      expect(screen.queryByTestId('docs-empty-action')).toBeNull();
    },
  );

  it.each((['pending', 'unauthorized', 'error', 'unreachable', 'missing-config'] as const).flatMap(kind => [
    { kind, docs: [docOne], node: 'doc-doc-1' },
    { kind, docs: [], node: 'docs-empty' },
  ]))('sin entradas con mascota $kind y lista $node', async ({ kind, docs, node }) => {
    if (kind === 'pending') mockGetPet.mockReturnValue(pending<PetState>());
    else if (kind === 'unreachable') mockGetPet.mockResolvedValue({ kind, message: 'offline' });
    else mockGetPet.mockResolvedValue({ kind });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs });
    const { queryClient } = await renderDocs();
    await screen.findByTestId(node);
    if (kind !== 'pending') {
      await waitFor(() => expect(queryClient.getQueryState(petKeys.detail('pet-1'))?.status).toBe('success'));
    }
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    expect(screen.queryByTestId('docs-upload')).toBeNull();
    expect(screen.queryByTestId('docs-empty-action')).toBeNull();
  });
});
