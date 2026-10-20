import { readFileSync } from 'fs';
import { join } from 'path';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { DeviceEventEmitter, Platform } from 'react-native';

import { getDocumentAsync } from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { QueryClientProvider } from '@tanstack/react-query';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { openBrowserAsync } from 'expo-web-browser';

import {
  confirmPetDocumentUpload,
  createPetDocument,
  listPetDocs,
  uploadPhotoToUrl,
} from '../../api/media';
import { getPet } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { useAuth } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import DocsRoute from '../../app/pets/[petId]/docs';
import DocsUploadRoute from '../../app/pets/[petId]/docs-upload';
import { createQueryClient } from '../../providers/query-provider';

const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    HomeEntrance(props: import('react-native').ViewProps & { index: number }) {
      mockHomeEntrance(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('standard-navigation', () => ({}));
// #185 R9: renderRouter carga /mock, que omite useReducedMotion en Reanimated 4.
jest.mock('react-native-reanimated/mock', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  __esModule: true,
  useReducedMotion: () => false,
}));
jest.mock('expo-linking', () => ({
  ...jest.requireActual('expo-linking'),
  createURL: (path: string) => `yourscheme://${path}`,
  resolveScheme: () => 'yourscheme',
}));

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color, size }: { color?: string; size?: number }) {
      return <View {...{ size }} testID={testID} style={{ color }} />;
    };
  return {
    ...actual,
    __esModule: true,
    FileText: icon('docs-icon-file-text'),
    ChevronRight: icon('docs-icon-chevron-right'),
    Upload: icon('docs-icon-upload'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));

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

async function renderDocs(language: 'es' | 'en' = 'es') {
  const queryClient = createQueryClient(undefined, 0);
  const app = renderRouter({
    _layout: () => (
      <HeroUINativeProvider>
        <LanguageProvider initial={language}>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
          </QueryClientProvider>
        </LanguageProvider>
      </HeroUINativeProvider>
    ),
    'pets/[petId]/docs': () => <HeaderHeightContext.Provider value={91}><DocsRoute /></HeaderHeightContext.Provider>,
    'pets/[petId]/docs-upload': () => <HeaderHeightContext.Provider value={91}><DocsUploadRoute /></HeaderHeightContext.Provider>,
  }, { initialUrl: '/pets/pet-1/docs' });
  await app;
  return { app, queryClient };
}

const mockGetDocumentAsync = jest.mocked(getDocumentAsync);
const mockOpenBrowserAsync = jest.mocked(openBrowserAsync);
const mockCreatePetDocument = jest.mocked(createPetDocument);
const mockUploadPhotoToUrl = jest.mocked(uploadPhotoToUrl);
const mockConfirmPetDocumentUpload = jest.mocked(confirmPetDocumentUpload);
const mockSignOut = jest.fn();
const originalFetch = globalThis.fetch;
const originalOS = Platform.OS;
const documentBlob = new Blob(['PDF bytes']);
const mockAssetBlob = jest.fn();
const mockAssetFetch = jest.fn();
const docOne = {
  id: 'doc-1', type: 'Vacunación', name: 'Antirrábica', date: '2026-07-12',
  downloadUrl: 'http://download.test/doc-1.pdf',
};

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
  jest.spyOn(router, 'back');
  jest.spyOn(router, 'dismissTo');
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
  (Platform as { OS: string }).OS = originalOS;
});

function uploadChildren() {
  const container = screen.getByTestId('screen-docs-upload').children[0];
  if (typeof container === 'string') throw new Error('Expected scroll content');
  return container.children.map(child => typeof child === 'string' ? child : (child.props.testID ?? child.type));
}

function listChildren() {
  const container = screen.getByTestId('screen-docs').children[0];
  if (typeof container === 'string') throw new Error('Expected scroll content');
  return container.children.map(child => typeof child === 'string' ? child : (child.props.testID ?? child.type));
}

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

describe('#185 R9 (antes #158 R5): selector y formulario de subida', () => {
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
    expect(listChildren()).toEqual(docs.length
      ? ['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload', 'docs-action-error']
      : ['View', 'docs-empty', 'docs-action-error']);
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
    expect(uploadChildren()).toEqual(['docs-upload-form']);
    expect(screen.queryByTestId('docs-upload')).toBeNull();
    expect(screen.queryByTestId('docs-empty-action')).toBeNull();
    expect(screen.getByTestId('docs-upload-file')).toHaveTextContent('vacuna.pdf');
  });

  it('declara las props, clases y fecha civil de los controles (enmendado por #177 R10)', async () => {
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
    expect(submit.props.className).toEqual(expect.stringContaining('h-14 rounded-16 bg-accent'));
    expect(submit.props.className).toEqual(expect.stringContaining('bg-accent'));
    const submitLabel = within(submit).getByText('Subir documento');
    expect(submitLabel.props.className).toEqual(expect.stringContaining('text-17 font-extrabold'));
    expect(submitLabel.props.className).toEqual(expect.stringContaining('text-accent-foreground'));
    const cancel = screen.getByTestId('docs-upload-cancel');
    expect(cancel).toHaveTextContent('Cancelar');
    expect(cancel.props.className).toEqual(expect.stringContaining('h-14 rounded-16 border-2 border-lip-gray bg-surface'));
    expect(cancel.props.className).toEqual(expect.stringContaining('button__root--variant-outline'));
    const cancelLabel = within(cancel).getByText('Cancelar');
    expect(cancelLabel.props.className).toEqual(expect.stringContaining('text-17 font-extrabold'));
    expect(cancelLabel.props.className).toEqual(expect.stringContaining('text-foreground'));
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

describe('#185 R9 (antes #158 R6): validación antes de leer o crear', () => {
  it.each([
    { label: 'tipo solo con espacios', input: 'docs-type-input', value: '   ', message: 'Este campo es obligatorio' },
    { label: 'nombre vacío', input: 'docs-name-input', value: '', message: 'Este campo es obligatorio' },
    { label: 'fecha sin formato ISO', input: 'docs-date-input', value: '09/10/2026', message: 'Escribe una fecha válida con formato AAAA-MM-DD' },
  ])('#186 R6: rechaza $label bajo su campo sin llamadas', async ({ input, value, message }) => {
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId(input), value);
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId(`${input}-message`)).toHaveTextContent(message));
    const field = screen.getByTestId(input).parent!;
    expect(within(field).queryByTestId(`${input}-message`)).toHaveTextContent(message);
    expect(field.children[field.children.length - 1]).toBe(screen.getByTestId(`${input}-error`));
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
    expect(screen.getByTestId('docs-upload-submit')).not.toBeDisabled();
    expect(uploadChildren()).toEqual(['docs-upload-form']);
    expect(mockGetDocumentAsync).toHaveBeenCalledTimes(1);
    expect(mockAssetFetch).not.toHaveBeenCalled();
    expect(mockCreatePetDocument).not.toHaveBeenCalled();
  });

  it.each([{ docs: [] }, { docs: [docOne] }])('#186 R6: ordena y limpia el error de campo con lista %j', async ({ docs }) => {
    await openUploadForm(docs);
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-type-input'), '   ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId('docs-type-input-message')).toHaveTextContent('Este campo es obligatorio'));
    expect(uploadChildren()).toEqual(['docs-upload-form']);
    await fireEvent.press(screen.getByTestId('docs-upload-cancel'));
    await screen.findByTestId(docs.length ? 'docs-upload' : 'docs-empty-action');
    expect(screen.queryByTestId('docs-type-input-message')).toBeNull();
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });
});

describe('#186 R6: errores de campos y contrato del documento', () => {
  it('#186 R6: rechaza un calendario falso antes de leer el archivo', async () => {
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-date-input'), '2026-02-30');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId('docs-date-input-message')).toHaveTextContent('Escribe una fecha válida con formato AAAA-MM-DD'));
    expect(mockGetDocumentAsync).toHaveBeenCalledTimes(1);
    expect(mockAssetFetch).not.toHaveBeenCalled();
    expect(mockCreatePetDocument).not.toHaveBeenCalled();
  });

  it('#186 R6: muestra los tres campos inválidos simultáneamente', async () => {
    await openUploadForm();
    await fireEvent.changeText(screen.getByTestId('docs-date-input'), 'bad-date');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId('docs-type-input-message')).toHaveTextContent('Este campo es obligatorio'));
    expect(screen.queryByTestId('docs-type-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('docs-name-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('docs-date-input-message-row')).not.toBeNull();
  });

  it('#186 R6: el estado inválido de HeroUI marca tipo pero no veterinario', async () => {
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-type-input'), '');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.getByTestId('docs-type-input').props.className.split(/\s+/)).toContain('android:border-danger'));
    expect(screen.getByTestId('docs-vet-input').props.className.split(/\s+/)).not.toContain('android:border-danger');
    expect(screen.queryByTestId('docs-type-input-message')).toHaveTextContent('Este campo es obligatorio');
  });

  it('#186 R6: fecha recortada se envía una vez sin mensajes de campo', async () => {
    mockCreatePetDocument.mockReturnValue(pending());
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.changeText(screen.getByTestId('docs-date-input'), ' 2026-10-09 ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.getByTestId('docs-upload-submit')).toBeDisabled());
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
    expect(mockCreatePetDocument).toHaveBeenCalledTimes(1);
    expect(mockCreatePetDocument).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', {
      type: 'Vacunación', name: 'Antirrábica', date: '2026-10-09', vet: 'Dra. Pérez',
    });
  });

  it('#186 R6: el 400 conserva el aviso genérico sin mensajes de campo', async () => {
    mockCreatePetDocument.mockResolvedValue({ kind: 'invalid' });
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId('docs-action-error')).toHaveTextContent('Añade un tipo, un nombre y una fecha con formato AAAA-MM-DD'));
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
  });

  it('#186 R6: conserva maxLength 40 120 y 120', async () => {
    await openUploadForm();
    expect(screen.getByTestId('docs-type-input').props.maxLength).toBe(40);
    expect(screen.getByTestId('docs-name-input').props.maxLength).toBe(120);
    expect(screen.getByTestId('docs-vet-input').props.maxLength).toBe(120);
  });
});

const docTwo = {
  id: 'doc-2', type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01',
  downloadUrl: 'http://download.test/doc-2.pdf',
};

describe('#185 R9 (antes #158 R7): una subida correcta refresca la lista', () => {
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

describe('#185 R9 (antes #158 R8): botones bloqueados durante la subida', () => {
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
    if (stage === 'refetch') {
      await screen.findByTestId('screen-docs');
      await waitFor(() => expect(mockListPetDocs).toHaveBeenCalledTimes(2));
      expect(screen.queryByTestId('docs-upload-form')).toBeNull();
      expect(router.dismissTo).toHaveBeenCalledTimes(1);
      return;
    }
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

describe('#185 R9 (antes #158 R9): cada fallo conserva el formulario y sus valores', () => {
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

  it.each(['Error de R9', 'Error de R6'] as const)('#186 R6: quita al pulsar el error anterior: %s', async (origin) => {
    if (origin === 'Error de R9') mockCreatePetDocument.mockResolvedValue({ kind: 'error' });
    await openUploadForm();
    await fillDocumentForm();
    if (origin === 'Error de R6') await fireEvent.changeText(screen.getByTestId('docs-type-input'), '   ');
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.queryByTestId(origin === 'Error de R9' ? 'docs-action-error' : 'docs-type-input-message')).toHaveTextContent(origin === 'Error de R9' ? 'Algo salió mal' : 'Este campo es obligatorio'));
    if (origin === 'Error de R6') await fireEvent.changeText(screen.getByTestId('docs-type-input'), 'Vacunación');
    mockAssetFetch.mockReturnValueOnce(pending());
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await waitFor(() => expect(screen.getByTestId('docs-upload-submit')).toBeDisabled());
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
    expect(screen.getByTestId('docs-upload-form')).toBeVisible();
    expect(screen.queryByTestId('docs-action-error')).toBeNull();
  });
});

describe('#185 R9 (antes #158 R11): el formulario se aparta del teclado en Android', () => {
  it('añade paddingBottom 291 con layout 700, teclado en 500 y cabecera 91', async () => {
    (Platform as { OS: string }).OS = 'android';
    await openUploadForm();
    const host = await screen.findByTestId('docs-upload-keyboard-avoider');
    expect(host.props.className).toEqual(expect.stringContaining('flex-1'));
    expect(host).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(host, 'layout', {
      persist() {},
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } },
    });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardDidShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('docs-upload-keyboard-avoider')).toHaveStyle({ paddingBottom: 291 }));
  });

  it('entrega el primer toque del scroll con el teclado abierto', async () => {
    await openUploadForm();
    const scroll = await screen.findByTestId('screen-docs-upload');
    expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
  });
});

describe('#185 R2.2: la pantalla monta el formulario con los params', () => {
  it('conserva archivo, cuatro controles y métricas bajo cabecera nativa', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-09T12:00:00Z'));
    await openUploadForm();
    expect(screen.getByTestId('docs-upload-file')).toHaveTextContent('vacuna.pdf');
    expect(screen.getByTestId('docs-type-input').props.maxLength).toBe(40);
    expect(screen.getByTestId('docs-name-input').props.maxLength).toBe(120);
    expect(screen.getByTestId('docs-date-input').props.maxLength).toBeUndefined();
    expect(screen.getByTestId('docs-date-input').props.placeholder).toBe('AAAA-MM-DD');
    expect(screen.getByTestId('docs-date-input').props.value).toBe('2026-10-09');
    expect(screen.getByTestId('docs-vet-input').props.maxLength).toBe(120);
    const source = readFileSync(join(process.cwd(), 'src/screens/docs-upload-form/index.tsx'), 'utf8');
    expect(source).toContain('behavior="padding"');
    expect(source).toContain('keyboardVerticalOffset={headerHeight}');
    const scroll = screen.getByTestId('screen-docs-upload');
    expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
    expect(scroll.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
  });
});

describe('#185 R2.3: una subida correcta vuelve a la lista', () => {
  it('dismissTo recibe petId y un nonce de subida numérico', async () => {
    await openUploadForm();
    await fillDocumentForm();
    await fireEvent.press(screen.getByTestId('docs-upload-submit'));
    await screen.findByTestId('screen-docs');
    expect(router.dismissTo).toHaveBeenCalledTimes(1);
    expect(router.dismissTo).toHaveBeenCalledWith({
      pathname: '/pets/[petId]/docs', params: { petId: 'pet-1', uploaded: expect.stringMatching(/^\d+$/) },
    });
  });
});

describe('#185 R2.4: cancelar vuelve atrás', () => {
  it('vuelve una vez sin subir ni dismissTo', async () => {
    await openUploadForm();
    await fireEvent.press(screen.getByTestId('docs-upload-cancel'));
    await screen.findByTestId('screen-docs');
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.dismissTo).not.toHaveBeenCalled();
    expect(mockCreatePetDocument).not.toHaveBeenCalled();
  });
});

describe('#185 R2.5: params ausentes', () => {
  it.each(['uri', 'name'] as const)('vuelve sin formulario si falta %s', async (missing) => {
    await renderDocs();
    await screen.findByTestId('docs-upload');
    const params: Record<string, string> = {
      petId: 'pet-1', uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', size: '1000', contentType: 'application/pdf',
    };
    delete params[missing];
    await act(async () => router.push({ pathname: '/pets/[petId]/docs-upload', params }));
    await waitFor(() => expect(router.back).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('screen-docs')).toBeVisible();
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
  });
});

describe('#185 R7: botones separados', () => {
  it('agrupa submit y cancelar en ese orden con 12 px de separación', async () => {
    await openUploadForm();
    const actions = screen.getByTestId('docs-upload-actions');
    expect(actions.props.className).toBe('gap-3');
    expect(actions.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'docs-upload-submit', 'docs-upload-cancel',
    ]);
    const last = screen.getByTestId('docs-upload-form').children.at(-1);
    expect(typeof last === 'object' ? last.props.testID : last).toBe('docs-upload-actions');
  });
});

describe('#185 R5: espacio entre campos', () => {
  it('separa seis hijos ordenados con gap-4 sin márgenes locales', async () => {
    await openUploadForm();
    const form = screen.getByTestId('docs-upload-form');
    expect(form.props.className).toBe('gap-4');
    const children = form.children.map(child => {
      if (typeof child === 'string') return child;
      return child.props.testID ?? (child.props.className?.split(/\s+/).includes('text-field__root') ? 'TextField' : child.type);
    });
    expect(children).toEqual([
      'docs-upload-file', 'TextField', 'TextField', 'TextField', 'TextField', 'docs-upload-actions',
    ]);
    const fields = form.children.filter(child => typeof child !== 'string' && child.props.className?.split(/\s+/).includes('text-field__root'));
    expect(fields).toHaveLength(4);
    for (const field of fields) {
      if (typeof field === 'string') throw new Error('Expected a TextField');
      expect(field.props.className).not.toMatch(/\b(?:m[trblxy]?|p[trblxy]?)-/);
    }
  });
});

describe('#185 R6: espacio etiqueta-input', () => {
  it.each([
    [0, 'Tipo', 'docs-type-input'],
    [1, 'Nombre', 'docs-name-input'],
    [2, 'Fecha', 'docs-date-input'],
    [3, 'Veterinario (opcional)', 'docs-vet-input'],
  ] as const)('conserva los 6 px nativos de HeroUI en %s (%s)', async (index, labelText, inputId) => {
    await openUploadForm();
    const field = screen.getByTestId('docs-upload-form').children[index + 1];
    if (typeof field === 'string') throw new Error('Expected a TextField');
    expect(field.props.className).toBe('text-field__root');
    expect(field.children).toHaveLength(2);
    const [label, input] = field.children;
    if (typeof label === 'string' || typeof input === 'string') throw new Error('Expected label and input');
    expect(within(label).getByText(labelText)).toBeVisible();
    expect(input.props.testID).toBe(inputId);
    expect(screen.getByTestId(inputId)).toBeVisible();
    const css = readFileSync(join(process.cwd(), 'node_modules/heroui-native/src/styles/components/text-field.css'), 'utf8');
    const theme = readFileSync(join(process.cwd(), 'node_modules/tailwindcss/theme.css'), 'utf8');
    expect(css).toContain('gap: calc(var(--spacing) * 1.5);');
    expect(theme).toContain('--spacing: 0.25rem;');
  });
});

describe('#185 R8: clases de botón, etiqueta e input intactas', () => {
  // #185 R8: RNTL 14 expone hosts con clases de HeroUI; la fuente conserva las props exactas.
  it.each([
    ['submit', 1, 'h-14 rounded-16 bg-accent'],
    ['submitLabel', 1, 'text-17 font-extrabold text-accent-foreground'],
    ['cancel', 1, 'h-14 rounded-16 border-2 border-lip-gray bg-surface'],
    ['cancelLabel', 1, 'text-17 font-extrabold text-foreground'],
    ['labels', 8, 'text-2xs font-semibold text-foreground'],
    ['inputs', 4, 'rounded-xl bg-default'],
  ] as const)('conserva %s sin alterar sus clases', (row, count, expected) => {
    const source = readFileSync(join(process.cwd(), 'src/screens/docs-upload-form/index.tsx'), 'utf8');
    const openingTag = (id: string) => {
      const anchor = source.indexOf(`testID="${id}"`);
      expect(anchor).toBeGreaterThan(-1);
      expect(source.lastIndexOf(`testID="${id}"`)).toBe(anchor);
      return source.slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor));
    };
    const submit = openingTag('docs-upload-submit');
    const cancel = openingTag('docs-upload-cancel');
    const buttonLabels = [submit, cancel].map(tag => {
      const start = source.indexOf(tag);
      return source.slice(start, source.indexOf('</Button>', start)).match(/<(?:Button\.Label|Text)\s+className="([^"]+)"/);
    });
    const classes = {
      submit: [submit.match(/className="([^"]+)"/)?.[1]],
      submitLabel: [buttonLabels[0]?.[1]],
      cancel: [cancel.match(/className="([^"]+)"/)?.[1]],
      cancelLabel: [buttonLabels[1]?.[1]],
      labels: [...source.matchAll(/<Label(?:\.Text)?\s+className="([^"]+)"/g)].map(match => match[1]),
      inputs: [...source.matchAll(/<Input\s+[^<]*?className="([^"]+)"/g)].map(match => match[1]),
    };
    expect(classes[row]).toHaveLength(count);
    for (const className of classes[row]) expect(className).toBe(expected);
    expect(submit).toContain('isDisabled={uploading}');
    expect(cancel).toContain('isDisabled={uploading}');
    expect(cancel).toContain('variant="outline"');
  });
});
