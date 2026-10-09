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
  jest.useRealTimers();
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

describe('#158 R4: family, walker y vet no ven la acción', () => {
  describe('con documentos', () => {
    it.each(['family', 'walker', 'vet'] as const)('sin botón para %s', async (myRole) => {
      mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole } });
      await renderDocs();
      await screen.findByText('Luna');
      await screen.findByTestId('doc-doc-1');
      expect(screen.queryByTestId('docs-upload')).toBeNull();
      expect(screen.queryByTestId('docs-empty-action')).toBeNull();
    });
  });

  describe('en el vacío', () => {
    it.each(['family', 'walker', 'vet'] as const)('solo Pingo para %s', async (myRole) => {
      mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole } });
      mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
      await renderDocs();
      await screen.findByText('Luna');
      const empty = await screen.findByTestId('docs-empty');
      expect(screen.queryByTestId('docs-upload')).toBeNull();
      expect(screen.queryByTestId('docs-empty-action')).toBeNull();
      expect(empty.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual([
        'docs-empty-pose', 'docs-empty-title', 'docs-empty-body',
      ]);
    });
  });
});

const documentAsset = {
  uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', size: 1000,
  lastModified: 0,
};

async function openUploadForm(docs = [docOne]) {
  mockListPetDocs.mockResolvedValue({ kind: 'ok', docs });
  mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [documentAsset] });
  await renderDocs();
  await screen.findByText('Luna');
  const entry = await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action');
  await fireEvent.press(entry);
  return screen.findByTestId('docs-upload-form');
}

async function fillDocumentForm() {
  await fireEvent.changeText(screen.getByTestId('docs-type-input'), 'Vacunación');
  await fireEvent.changeText(screen.getByTestId('docs-name-input'), 'Antirrábica');
  await fireEvent.changeText(screen.getByTestId('docs-date-input'), '2026-10-01');
  await fireEvent.changeText(screen.getByTestId('docs-vet-input'), 'Dra. Pérez');
}

describe('#158 R5: selector y formulario de subida', () => {
  it.each([
    { label: 'canceled', canceled: true, error: null },
    { label: 'tipo inválido', asset: { ...documentAsset, name: 'a.txt', mimeType: 'text/plain' }, error: 'Elige un archivo PDF, JPEG o PNG' },
    { label: 'mayor que el máximo', asset: { ...documentAsset, size: 10485761 }, error: 'El archivo pesa más de 10 MB' },
    { label: 'tipo inválido y demasiado grande', asset: { ...documentAsset, mimeType: 'image/heic', size: 10485761 }, error: 'Elige un archivo PDF, JPEG o PNG' },
    { label: 'en el máximo', asset: { ...documentAsset, size: 10485760 }, error: null },
    { label: 'sin tamaño', asset: { uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', lastModified: 0 }, error: null },
    { label: 'rechazo del selector', reject: true, error: 'Algo salió mal' },
  ] as const)('selector: $label', async (row) => {
    if ('reject' in row) mockGetDocumentAsync.mockRejectedValue(new Error('no native module'));
    else if ('canceled' in row) mockGetDocumentAsync.mockResolvedValue({ canceled: true, assets: null });
    else mockGetDocumentAsync.mockResolvedValue({ canceled: false, assets: [row.asset] });
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    if (row.error) {
      await screen.findByText(row.error);
      expect(screen.queryByTestId('docs-upload-form')).toBeNull();
    } else if ('canceled' in row) {
      await screen.findByTestId('docs-upload');
      expect(screen.queryByTestId('docs-upload-form')).toBeNull();
      expect(screen.queryByTestId('docs-action-error')).toBeNull();
    } else {
      expect(await screen.findByTestId('docs-upload-form')).toBeVisible();
    }
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('ordena el error del selector con lista %j', async ({ docs }) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs });
    mockGetDocumentAsync.mockResolvedValue({ canceled: false, assets: [{ ...documentAsset, mimeType: 'image/heic' }] });
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action'));
    await screen.findByText('Elige un archivo PDF, JPEG o PNG');
    expect(docsChildren()).toEqual(docs.length
      ? ['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']
      : ['View', 'docs-action-error', 'docs-empty']);
    const error = screen.getByTestId('docs-action-error');
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('quita el error al volver al selector con lista %j', async ({ docs }) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs });
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [{ ...documentAsset, mimeType: 'image/heic' }] });
    await renderDocs();
    await screen.findByText('Luna');
    const entry = await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action');
    await fireEvent.press(entry);
    await screen.findByText('Elige un archivo PDF, JPEG o PNG');
    mockGetDocumentAsync.mockReturnValueOnce(pending());
    await fireEvent.press(entry);
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('sitúa el formulario y oculta las entradas con lista %j', async ({ docs }) => {
    await openUploadForm(docs);
    expect(docsChildren()).toEqual(docs.length
      ? ['View', 'docs-upload-form', 'doc-doc-1']
      : ['View', 'docs-upload-form', 'docs-empty']);
    expect(screen.queryByTestId('docs-upload')).toBeNull();
    expect(screen.queryByTestId('docs-empty-action')).toBeNull();
    expect(screen.getByTestId('docs-upload-file')).toHaveTextContent('vacuna.pdf');
  });

  it('declara las props, clases y fecha civil de los controles', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-09T12:00:00Z'));
    await openUploadForm();
    const fields = [
      ['Tipo', 'docs-type-input', '', 40],
      ['Nombre', 'docs-name-input', '', 120],
      ['Fecha', 'docs-date-input', '2026-10-09', undefined],
      ['Veterinario (opcional)', 'docs-vet-input', '', 120],
    ] as const;
    for (const [labelText, id, value, maxLength] of fields) {
      const input = screen.getByTestId(id);
      expect(input.props.value).toBe(value);
      if (maxLength !== undefined) expect(input.props.maxLength).toBe(maxLength);
      expect(input.props.className).toEqual(expect.stringContaining('rounded-xl'));
      expect(input.props.className).toEqual(expect.stringContaining('bg-default'));
      const label = screen.getByText(labelText);
      expect(label.props.className).toEqual(expect.stringContaining('text-2xs'));
      expect(label.props.className).toEqual(expect.stringContaining('font-semibold'));
      expect(label.props.className).toEqual(expect.stringContaining('text-foreground'));
    }
    expect(screen.getByTestId('docs-date-input').props.placeholder).toBe('AAAA-MM-DD');
    const submit = screen.getByTestId('docs-upload-submit');
    expect(submit).toHaveTextContent('Subir documento');
    expect(submit.props.className).toEqual(expect.stringContaining('rounded-xl'));
    expect(submit.props.className).toEqual(expect.stringContaining('bg-accent'));
    const submitLabel = within(submit).getByText('Subir documento');
    expect(submitLabel.props.className).toEqual(expect.stringContaining('font-bold'));
    expect(submitLabel.props.className).toEqual(expect.stringContaining('text-accent-foreground'));
    const cancel = screen.getByTestId('docs-upload-cancel');
    expect(cancel).toHaveTextContent('Cancelar');
    expect(cancel.props.className).toEqual(expect.stringContaining('rounded-xl'));
    expect(cancel.props.className).toEqual(expect.stringContaining('button__root--variant-outline'));
    const cancelLabel = within(cancel).getByText('Cancelar');
    expect(cancelLabel.props.className).toEqual(expect.stringContaining('font-semibold'));
    expect(cancelLabel.props.className).toEqual(expect.stringContaining('button__label--variant-outline'));
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('cancelar reinicia los campos sin red con lista %j', async ({ docs }) => {
    await openUploadForm(docs);
    const initialDate = screen.getByTestId('docs-date-input').props.value;
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-cancel'));
    const entry = await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action');
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [documentAsset] });
    await fireEvent.press(entry);
    await screen.findByTestId('docs-upload-form');
    expect(screen.getByTestId('docs-type-input').props.value).toBe('');
    expect(screen.getByTestId('docs-name-input').props.value).toBe('');
    expect(screen.getByTestId('docs-vet-input').props.value).toBe('');
    expect(screen.getByTestId('docs-date-input').props.value).toBe(initialDate);
    expect(mockCreatePetDocument).not.toHaveBeenCalled();
    expect(mockAssetFetch).not.toHaveBeenCalled();
  });
});

describe('#158 R6: validación antes de leer o crear', () => {
  it.each([
    { label: 'tipo solo con espacios', input: 'docs-type-input', value: '   ' },
    { label: 'nombre vacío', input: 'docs-name-input', value: '' },
    { label: 'fecha sin formato ISO', input: 'docs-date-input', value: '09/10/2026' },
  ])('rechaza $label sin llamadas', async ({ input, value }) => {
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId(input), value);
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByText('Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD');
    expect(mockAssetFetch).not.toHaveBeenCalled();
    expect(mockCreatePetDocument).not.toHaveBeenCalled();
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('ordena y limpia el error con lista %j', async ({ docs }) => {
    await openUploadForm(docs);
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-type-input'), '   ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByText('Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD');
    expect(docsChildren()).toEqual(docs.length
      ? ['View', 'docs-upload-form', 'docs-action-error', 'doc-doc-1']
      : ['View', 'docs-upload-form', 'docs-action-error', 'docs-empty']);
    await fireEvent.press(screen.getByTestId('docs-upload-cancel'));
    await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action');
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });
});

const docTwo = {
  id: 'doc-2', type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01',
  downloadUrl: 'http://download.test/doc-2.pdf',
};

describe('#158 R7: una subida correcta refresca la lista', () => {
  it('sube el PDF en orden con los cuatro campos recortados', async () => {
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', size: 1000, lastModified: 0 }],
    });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne] });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne, docTwo] });
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    await screen.findByTestId('docs-upload-form');
    await fireEvent.changeText(screen.getByTestId('docs-type-input'), ' Vacunación ');
    await fireEvent.changeText(screen.getByTestId('docs-name-input'), ' Antirrábica ');
    await fireEvent.changeText(screen.getByTestId('docs-date-input'), ' 2026-10-01 ');
    await fireEvent.changeText(screen.getByTestId('docs-vet-input'), ' Dra. Pérez ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(within(screen.getByTestId('doc-doc-2')).getByText('Antirrábica')).toHaveTextContent('Antirrábica'));
    expect(mockAssetFetch).toHaveBeenCalledWith('file:///cache/vacuna.pdf');
    expect(mockCreatePetDocument).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', {
      type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01', vet: 'Dra. Pérez',
    });
    expect(mockCreatePetDocument.mock.calls[0][3]).toEqual({
      type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01', vet: 'Dra. Pérez',
    });
    expect(mockUploadPhotoToUrl).toHaveBeenCalledWith('http://upload.test/doc-2', documentBlob, 'application/pdf');
    expect(mockConfirmPetDocumentUpload).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', 'doc-2');
    const order = [
      mockAssetFetch.mock.invocationCallOrder[0],
      mockAssetBlob.mock.invocationCallOrder[0],
      mockCreatePetDocument.mock.invocationCallOrder[0],
      mockUploadPhotoToUrl.mock.invocationCallOrder[0],
      mockConfirmPetDocumentUpload.mock.invocationCallOrder[0],
      mockListPetDocs.mock.invocationCallOrder[1],
    ];
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(6);
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
    expect(screen.getByTestId('docs-upload')).toBeVisible();
  });

  it('sube el PNG sin mimeType y omite el veterinario vacío', async () => {
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file:///cache/radiografia.png', name: 'radiografia.png', size: 2000, lastModified: 0 }],
    });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne] });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne, docTwo] });
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    await screen.findByTestId('docs-upload-form');
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-vet-input'), '   ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(within(screen.getByTestId('doc-doc-2')).getByText('Antirrábica')).toHaveTextContent('Antirrábica'));
    const input = mockCreatePetDocument.mock.calls[0][3];
    expect(input).toEqual({ type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01' });
    expect(input).not.toHaveProperty('vet');
    expect(mockAssetFetch).toHaveBeenCalledWith('file:///cache/radiografia.png');
    expect(mockUploadPhotoToUrl).toHaveBeenCalledWith('http://upload.test/doc-2', documentBlob, 'image/png');
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
    expect(screen.getByTestId('docs-upload')).toBeVisible();
  });

  it('cierra el formulario aunque el refetch responda error', async () => {
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne] });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'error' });
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByTestId('docs-error');
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
    expect(screen.queryByTestId('docs-upload')).toBeNull();
    expect(screen.queryByTestId('docs-empty-action')).toBeNull();
  });
});

describe('#158 R8: botones bloqueados durante la subida', () => {
  it.each(['fetch', 'blob', 'crear', 'PUT', 'confirmar', 'refetch'] as const)('bloquea ambos botones durante %s', async (stage) => {
    if (stage === 'fetch') mockAssetFetch.mockReturnValue(pending());
    if (stage === 'blob') mockAssetBlob.mockReturnValue(pending());
    if (stage === 'crear') mockCreatePetDocument.mockReturnValue(pending());
    if (stage === 'PUT') mockUploadPhotoToUrl.mockReturnValue(pending());
    if (stage === 'confirmar') mockConfirmPetDocumentUpload.mockReturnValue(pending());
    if (stage === 'refetch') {
      mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [docOne] });
      mockListPetDocs.mockReturnValueOnce(pending());
    }
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    if (stage === 'fetch') await waitFor(() => expect(mockAssetFetch).toHaveBeenCalledTimes(1));
    if (stage === 'blob') await waitFor(() => expect(mockAssetBlob).toHaveBeenCalledTimes(1));
    if (stage === 'crear') await waitFor(() => expect(mockCreatePetDocument).toHaveBeenCalledTimes(1));
    if (stage === 'PUT') await waitFor(() => expect(mockUploadPhotoToUrl).toHaveBeenCalledTimes(1));
    if (stage === 'confirmar') await waitFor(() => expect(mockConfirmPetDocumentUpload).toHaveBeenCalledTimes(1));
    if (stage === 'refetch') await waitFor(() => expect(mockListPetDocs).toHaveBeenCalledTimes(2));
    const submit = screen.getByTestId('docs-upload-submit');
    const cancel = screen.getByTestId('docs-upload-cancel');
    expect(submit.props.accessibilityState?.disabled).toBe(true);
    expect(cancel.props.accessibilityState?.disabled).toBe(true);
    await fireEvent.press(submit);
    expect(mockAssetFetch).toHaveBeenCalledTimes(1);
    expect(mockCreatePetDocument).toHaveBeenCalledTimes(stage === 'fetch' || stage === 'blob' ? 0 : 1);
    await fireEvent.press(cancel);
    expect(screen.getByTestId('docs-upload-form')).toBeVisible();
  });

  it('rehabilita ambos botones cuando crear responde forbidden', async () => {
    mockCreatePetDocument.mockResolvedValue({ kind: 'forbidden' });
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByText('Solo el dueño puede subir documentos');
    expect(screen.getByTestId('docs-upload-submit').props.accessibilityState?.disabled).toBe(false);
    expect(screen.getByTestId('docs-upload-cancel').props.accessibilityState?.disabled).toBe(false);
  });
});

describe('#158 R9: cada fallo conserva el formulario y sus valores', () => {
  it.each([
    { label: 'lectura fetch rechaza', stage: 'fetch', error: 'No se pudo subir el archivo. Inténtalo de nuevo' },
    { label: 'lectura blob rechaza', stage: 'blob', error: 'No se pudo subir el archivo. Inténtalo de nuevo' },
    { label: 'crear invalid', stage: 'crear', state: { kind: 'invalid' }, error: 'Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD' },
    { label: 'crear forbidden', stage: 'crear', state: { kind: 'forbidden' }, error: 'Solo el dueño puede subir documentos' },
    { label: 'crear unreachable', stage: 'crear', state: { kind: 'unreachable', message: 'offline' }, error: 'No se pudo conectar con el servidor' },
    { label: 'crear not-found', stage: 'crear', state: { kind: 'not-found' }, error: 'Algo salió mal' },
    { label: 'crear error', stage: 'crear', state: { kind: 'error' }, error: 'Algo salió mal' },
    { label: 'crear missing-config', stage: 'crear', state: { kind: 'missing-config' }, error: 'Algo salió mal' },
    { label: 'crear rechaza', stage: 'crear', reject: true, error: 'Algo salió mal' },
    { label: 'PUT error', stage: 'PUT', state: { kind: 'error' }, error: 'No se pudo subir el archivo. Inténtalo de nuevo' },
    { label: 'PUT unreachable', stage: 'PUT', state: { kind: 'unreachable', message: 'offline' }, error: 'No se pudo subir el archivo. Inténtalo de nuevo' },
    { label: 'confirmar not-uploaded', stage: 'confirmar', state: { kind: 'not-uploaded' }, error: 'No se pudo subir el archivo. Inténtalo de nuevo' },
    { label: 'confirmar too-large', stage: 'confirmar', state: { kind: 'too-large' }, error: 'El archivo pesa más de 10 MB' },
    { label: 'confirmar forbidden', stage: 'confirmar', state: { kind: 'forbidden' }, error: 'Solo el dueño puede subir documentos' },
    { label: 'confirmar unreachable', stage: 'confirmar', state: { kind: 'unreachable', message: 'offline' }, error: 'No se pudo conectar con el servidor' },
    { label: 'confirmar not-found', stage: 'confirmar', state: { kind: 'not-found' }, error: 'Algo salió mal' },
    { label: 'confirmar error', stage: 'confirmar', state: { kind: 'error' }, error: 'Algo salió mal' },
    { label: 'confirmar missing-config', stage: 'confirmar', state: { kind: 'missing-config' }, error: 'Algo salió mal' },
    { label: 'confirmar rechaza', stage: 'confirmar', reject: true, error: 'Algo salió mal' },
  ] as const)('$label', async (row) => {
    if (row.stage === 'fetch') mockAssetFetch.mockRejectedValue(new Error('local read failed'));
    if (row.stage === 'blob') mockAssetFetch.mockResolvedValue({ blob: jest.fn().mockRejectedValue(new Error('blob failed')) });
    if (row.stage === 'crear') {
      if ('reject' in row) mockCreatePetDocument.mockRejectedValue(new Error('create failed'));
      else mockCreatePetDocument.mockResolvedValue(row.state);
    }
    if (row.stage === 'PUT') mockUploadPhotoToUrl.mockResolvedValue(row.state);
    if (row.stage === 'confirmar') {
      if ('reject' in row) mockConfirmPetDocumentUpload.mockRejectedValue(new Error('confirm failed'));
      else mockConfirmPetDocumentUpload.mockResolvedValue(row.state);
    }
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByText(row.error);
    expect(screen.getByTestId('docs-upload-form')).toBeVisible();
    for (const [id, value] of [
      ['docs-type-input', 'Vacunación'],
      ['docs-name-input', 'Antirrábica'],
      ['docs-date-input', '2026-10-01'],
      ['docs-vet-input', 'Dra. Pérez'],
    ]) expect(screen.getByTestId(id).props.value).toBe(value);
    expect(screen.getByTestId('docs-upload-submit').props.accessibilityState?.disabled).toBe(false);
    expect(screen.getByTestId('docs-upload-cancel').props.accessibilityState?.disabled).toBe(false);
    expect(mockListPetDocs).toHaveBeenCalledTimes(1);
    if (row.stage === 'fetch' || row.stage === 'blob') expect(mockCreatePetDocument).not.toHaveBeenCalled();
    if (row.stage === 'crear') expect(mockUploadPhotoToUrl).not.toHaveBeenCalled();
    if (row.stage === 'PUT') expect(mockConfirmPetDocumentUpload).not.toHaveBeenCalled();
  });

  it.each(['crear', 'confirmar'] as const)('unauthorized al %s cierra la sesión sin error de acción', async (stage) => {
    if (stage === 'crear') mockCreatePetDocument.mockResolvedValue({ kind: 'unauthorized' });
    else mockConfirmPetDocumentUpload.mockResolvedValue({ kind: 'unauthorized' });
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.getByTestId('docs-upload-submit').props.accessibilityState?.disabled).toBe(false));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });

  it.each(['Error de R9', 'Error de R6'] as const)('quita al pulsar el error anterior: %s', async (origin) => {
    if (origin === 'Error de R9') mockCreatePetDocument.mockResolvedValue({ kind: 'error' });
    await openUploadForm();
    await fillDocumentForm();
    if (origin === 'Error de R6') await fireEvent.changeText(screen.getByTestId('docs-type-input'), '   ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByText(origin === 'Error de R9'
      ? 'Algo salió mal'
      : 'Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD');
    if (origin === 'Error de R6') await fireEvent.changeText(screen.getByTestId('docs-type-input'), 'Vacunación');
    mockAssetFetch.mockReturnValueOnce(pending());
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    expect(screen.getByTestId('docs-upload-form')).toBeVisible();
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });
});

describe('#158 R10: cualquier miembro abre un documento', () => {
  it.each(['owner', 'family', 'walker', 'vet'] as const)('abre la URL de descarga para %s', async (myRole) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole } });
    await renderDocs();
    await screen.findByText('Luna');
    const row = await screen.findByTestId('doc-doc-1');
    await fireEvent.press(row);
    expect(mockOpenBrowserAsync).toHaveBeenCalledTimes(1);
    expect(mockOpenBrowserAsync).toHaveBeenCalledWith('http://download.test/doc-1.pdf');
    expect(row.props.accessibilityRole).toBe('button');
  });

  it.each(['owner', 'family', 'walker', 'vet'] as const)('mantiene la lista y sitúa el error del navegador para %s', async (myRole) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole } });
    mockOpenBrowserAsync.mockRejectedValue(new Error('browser failed'));
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId('doc-doc-1'));
    await screen.findByText('Algo salió mal');
    expect(screen.getByTestId('doc-doc-1')).toBeVisible();
    expect(docsChildren()).toEqual(myRole === 'owner'
      ? ['View', 'docs-upload', 'docs-action-error', 'doc-doc-1']
      : ['View', 'docs-action-error', 'doc-doc-1']);
  });

  it('family limpia el error antes de abrir otra vez el navegador', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: { ...makePet(), myRole: 'family' } });
    mockOpenBrowserAsync.mockRejectedValueOnce(new Error('browser failed'));
    await renderDocs();
    await screen.findByText('Luna');
    await fireEvent.press(await screen.findByTestId('doc-doc-1'));
    await screen.findByText('Algo salió mal');
    mockOpenBrowserAsync.mockReturnValueOnce(pending());
    await fireEvent.press(screen.getByTestId('doc-doc-1'));
    expect(screen.getByTestId('doc-doc-1')).toBeVisible();
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
    expect(mockOpenBrowserAsync).toHaveBeenCalledTimes(2);
  });
});
