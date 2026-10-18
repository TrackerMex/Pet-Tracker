import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import { getDocumentAsync } from 'expo-document-picker';
import { router } from 'expo-router';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { openBrowserAsync } from 'expo-web-browser';

import {
  listPetDocs,
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
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() } }));
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

function docsView(language: 'es' | 'en' = 'es', uploaded?: string) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <HeaderHeightContext.Provider value={91}>
          <DocsScreen petId="pet-1" uploaded={uploaded} />
        </HeaderHeightContext.Provider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderDocs(language: 'es' | 'en' = 'es', uploaded?: string) {
  return renderWithProviders(docsView(language, uploaded));
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
    expect(within(screen.getByTestId('doc-doc-1')).getByText('Vacunación')).toBeVisible();
    expect(screen.getByText('Antirrábica')).toBeVisible();
    expect(screen.getByText('12 jul 2026')).toBeVisible();
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

    expect(within(await screen.findByTestId('doc-doc-1')).getByText('Vacunación').props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
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
    const vaccineTile = vaccineRow.getByTestId('docs-mosaic-vaccine', { includeHiddenElements: true });
    const unknownTile = unknownRow.getByTestId('docs-mosaic-unknown', { includeHiddenElements: true });

    expect(vaccineTile?.props.className).toContain('bg-category-blue');
    expect(vaccineTile?.props.className).not.toContain('bg-accent-soft');
    expect(vaccineRow.getByText('Vacunación').props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-category-blue text-category-blue-strong',
    );
    expect(unknownTile?.props.className).toContain('bg-default');
    expect(unknownTile?.props.className).not.toContain('bg-accent-soft');
    expect(unknownRow.getByText('Radiografía').props.className).toBe(
      'self-start rounded-full px-2 py-0.5 text-11 font-extrabold bg-default text-muted',
    );
    expect(vaccineRow.getByTestId('docs-icon-file-text', { includeHiddenElements: true })).toBeVisible();
    expect(unknownRow.getByTestId('docs-icon-file-text', { includeHiddenElements: true })).toBeVisible();
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
      paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48,
    });
  });
});

describe('#175 R4: esqueleto del tamaño de la fila', () => {
  it('pinta tres esqueletos de 80 px con el radio de la fila', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());
    mockListPetDocs.mockReturnValue(pending<PetDocsState>());
    await renderDocs();

    const skeleton = screen.getByTestId('docs-list-skeleton');
    expect(skeleton.props.className).toBe('gap-3.5');
    expect(skeleton.children).toHaveLength(3);
    for (const child of skeleton.children) {
      if (typeof child === 'string') throw new Error('Expected a skeleton element');
      const classes = child.props.className.split(/\s+/);
      expect(classes).toEqual(expect.arrayContaining(['h-20', 'w-full', 'rounded-card']));
      expect(classes).not.toContain('h-24');
    }
  });
});

describe('#175 R5: cabecera del artboard', () => {
  it('pinta una columna sin gap con eyebrow y título exactos', async () => {
    await renderDocs();
    await screen.findByText('Luna');
    const container = screen.getByTestId('screen-docs').children[0];
    if (typeof container === 'string') throw new Error('Expected scroll content');
    const header = container.children[0];
    if (typeof header === 'string') throw new Error('Expected a header element');

    expect(header.props.className).toBeUndefined();
    expect(header.children).toHaveLength(2);
    expect(header.children[0]).toHaveProperty('props.className', 'text-11 font-extrabold uppercase tracking-eyebrow text-muted');
    expect(header.children[1]).toHaveProperty('props.className', 'text-26 font-black tracking-title text-foreground');
    expect(within(header).getByText('Documentos de')).toBeVisible();
    expect(within(header).getByText('Luna')).toBeVisible();
  });

  it('conserva una sola cabecera nativa de Documentos con título vacío', () => {
    const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
    const layout = readFileSync(`${process.cwd()}/src/app/_layout.tsx`, 'utf8');
    expect(layout.split("name=\"pets/[petId]/docs\" options={{ ...headerOptions, title: '' }}")).toHaveLength(2);
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
const mockSignOut = jest.fn();
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
    expect(within(button).getByText('Subir documento')).toBeVisible();
    expect(docsChildren()).toEqual(['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload']);
    expect(button.props.className).not.toContain('bg-accent');
    const label = within(button).getByText('Subir documento');
    expect(label.props.className).toBe('text-15 font-extrabold text-foreground');
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
        'docs-empty-float', 'docs-empty-title', 'docs-empty-body', // #171 R10
      ]);
    });
  });
});

const docTwo = {
  id: 'doc-2', type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01',
  downloadUrl: 'http://download.test/doc-2.pdf',
};

const documentAsset = {
  uri: 'file:///cache/vacuna.pdf', name: 'vacuna.pdf', mimeType: 'application/pdf', size: 1000,
  lastModified: 0,
};

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
      ? ['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload', 'docs-action-error']
      : ['View', 'docs-filters', 'docs-entry-doc-1', 'docs-action-error']);
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

describe('#175 R6: fila del artboard', () => {
  it.each([
    ['Vacunación', 'bg-category-blue', 'text-category-blue-strong', 'category-blue-strong'],
    ['Consulta', 'bg-category-green', 'text-category-green-strong', 'category-green-strong'],
    ['Desparasitación', 'bg-category-amber', 'text-category-amber-strong', 'category-amber-strong'],
    ['Análisis', 'bg-category-violet', 'text-category-violet-strong', 'category-violet-strong'],
    ['Radiografía', 'bg-default', 'text-muted', 'muted'],
  ] as const)('compone mosaico, columna y chevron para %s', async (type, surface, ink, iconColor) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [{ ...docOne, type }] });
    await renderDocs();
    const row = await screen.findByTestId('doc-doc-1');
    expect(row.children).toHaveLength(3);
    const classes = row.props.className.split(/\s+/);
    expect(classes).toEqual(expect.arrayContaining(['flex-row', 'items-center', 'gap-3', 'px-3.5', 'py-3', 'shadow-none']));
    expect(classes).not.toContain('shadow-sm');
    const [mosaic, column, chevron] = row.children;
    if (typeof mosaic === 'string' || typeof column === 'string' || typeof chevron === 'string') {
      throw new Error('Expected row elements');
    }
    expect(mosaic.props.testID).toBe('docs-mosaic-doc-1');
    expect(mosaic.props.className).toBe(`h-14 w-12 items-center justify-center rounded-xl ${surface}`);
    expect(mosaic.props.style).toEqual({ borderCurve: 'continuous' });
    expect(mosaic.children).toHaveLength(1);
    const icon = within(mosaic).getByTestId('docs-icon-file-text', { includeHiddenElements: true });
    expect(icon.props.size).toBe(24);
    expect(icon.props.style.color).toBe(iconColor);
    expect(column.props.className).toBe('min-w-0 flex-1 gap-0.75');
    expect(column.children).toHaveLength(3);
    expect(column.children[0]).toHaveProperty('props.className', `self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${surface} ${ink}`);
    expect(column.children[0]).toHaveTextContent(type);
    expect(column.children[1]).toHaveTextContent('Antirrábica');
    expect(column.children[2]).toHaveTextContent('12 jul 2026');
    expect(column.children[2]).toHaveProperty('props.className', 'text-xs font-normal text-muted');
    expect(chevron.props.testID).toBe('docs-icon-chevron-right');
    expect(chevron.props.size).toBe(18);
    expect(chevron.props.style.color).toBe('muted');
  });

  it('limita el nombre a una línea con la tipografía exacta', async () => {
    await renderDocs();
    const row = await screen.findByTestId('doc-doc-1');
    const name = within(row).getByText('Antirrábica');
    expect(name.props.numberOfLines).toBe(1);
    expect(name.props.className).toBe('text-15 font-extrabold text-foreground');
  });

  it('formatea en español fechas que cruzan mes y año', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [
      { ...docOne, date: '2026-01-10' },
      { ...docOne, id: 'doc-2', date: '2025-12-02' },
    ] });
    await renderDocs();
    const first = await screen.findByTestId('doc-doc-1');
    const second = screen.getByTestId('doc-doc-2');
    expect(within(first).getByText('10 ene 2026')).toBeVisible();
    expect(within(second).getByText('2 dic 2025')).toBeVisible();
    expect(screen.queryByText(/^2026-01-10$/)).toBeNull();
    expect(screen.queryByText(/^2025-12-02$/)).toBeNull();
  });

  it('formatea en inglés fechas que cruzan mes y año', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [
      { ...docOne, date: '2026-01-10' },
      { ...docOne, id: 'doc-2', date: '2025-12-02' },
    ] });
    await renderDocs('en');
    const first = await screen.findByTestId('doc-doc-1');
    const second = screen.getByTestId('doc-doc-2');
    expect(within(first).getByText('Jan 10, 2026')).toBeVisible();
    expect(within(second).getByText('Dec 2, 2025')).toBeVisible();
    expect(screen.queryByText(/^2026-01-10$/)).toBeNull();
    expect(screen.queryByText(/^2025-12-02$/)).toBeNull();
  });

  it('envuelve cada fila con su índice y conserva el orden del backend', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [
      { ...docOne, id: 'third' },
      { ...docOne, id: 'first' },
      { ...docOne, id: 'second' },
    ] });
    await renderDocs();
    await screen.findByTestId('doc-third');
    expect(docsChildren().filter((id) => typeof id === 'string' && id.startsWith('docs-entry-'))).toEqual([
      'docs-entry-third', 'docs-entry-first', 'docs-entry-second',
    ]);
    for (const [index, id] of ['third', 'first', 'second'].entries()) {
      const entry = screen.getByTestId(`docs-entry-${id}`);
      expect(entry.props.index).toBe(index);
      expect(entry.children).toHaveLength(1);
      expect(entry.children[0]).toHaveProperty('props.testID', `doc-${id}`);
      expect(mockHomeEntrance).toHaveBeenCalledWith(expect.objectContaining({ index, testID: `docs-entry-${id}` }));
    }
    expect(screen.getAllByTestId(/^doc-/).map(({ props }) => props.testID)).toEqual([
      'doc-third', 'doc-first', 'doc-second',
    ]);
  });
});

describe('#175 R7: zona de subida del artboard', () => {
  it('compone el círculo, el título y la pista con sus medidas exactas', async () => {
    await renderDocs();
    const zone = await screen.findByTestId('docs-upload');
    expect(zone.props.accessibilityRole).toBe('button');
    expect(zone.props.className).toBe('mt-1.5 items-center gap-1.5 rounded-24 border-2 border-dashed border-lip-gray p-4.5');
    expect(zone.children).toHaveLength(3);
    const [circle, title, hint] = zone.children;
    if (typeof circle === 'string') throw new Error('Expected an upload circle');
    expect(circle.props.className).toBe('size-12 items-center justify-center rounded-full bg-surface-secondary');
    expect(circle.children).toHaveLength(1);
    const icon = within(circle).getByTestId('docs-icon-upload', { includeHiddenElements: true });
    expect(icon.props.size).toBe(22);
    expect(icon.props.style.color).toBe('accent-strong');
    expect(title).toHaveProperty('props.className', 'text-15 font-extrabold text-foreground');
    expect(hint).toHaveProperty('props.className', 'text-center text-xs font-normal text-muted');
    expect(within(zone).getByText('Subir documento')).toBeVisible();
    expect(within(zone).getByText('PDF o foto de recetas, análisis y cartillas')).toBeVisible();
  });

  it('conserva esquinas continuas y responde al pulsado con opacidad', async () => {
    await renderDocs();
    const zone = await screen.findByTestId('docs-upload');
    expect(zone).toHaveStyle({ borderCurve: 'continuous', opacity: 1 });
    await fireEvent(zone, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(zone).toHaveStyle({ borderCurve: 'continuous', opacity: 0.8 });
  });
});

const filterDocs = [
  { ...docOne, id: 'unknown', type: 'Radiografía' },
  { ...docOne, id: 'analysis', type: 'Análisis' },
  { ...docOne, id: 'checkup', type: 'Consulta' },
  { ...docOne, id: 'vaccine', type: 'Vacunación' },
  { ...docOne, id: 'deworming', type: 'Desparasitación' },
];

describe('#175 R8: chips de filtro', () => {
  it('ordena las cinco categorías presentes y sus etiquetas antes de la primera entrada', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: filterDocs });
    await renderDocs();
    await screen.findByTestId('doc-unknown');
    const filters = screen.getByTestId('docs-filters');
    expect(filters.props.className).toBe('flex-row flex-wrap gap-1.5');
    expect(filters.children).toHaveLength(6);
    expect(filters.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'docs-filter-all', 'docs-filter-blue', 'docs-filter-green', 'docs-filter-amber', 'docs-filter-violet', 'docs-filter-neutral',
    ]);
    for (const [id, label] of [
      ['all', 'Todos'], ['blue', 'Vacunación'], ['green', 'Consulta'],
      ['amber', 'Desparasitación'], ['violet', 'Análisis'], ['neutral', 'Otros'],
    ]) {
      expect(within(screen.getByTestId(`docs-filter-${id}`)).getByText(label)).toBeVisible();
    }
    const order = docsChildren();
    expect(order[order.indexOf('docs-entry-unknown') - 1]).toBe('docs-filters');
  });

  it('omite ámbar y neutral en la lista del artboard', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [
      { ...docOne, id: 'analysis', type: 'Análisis' },
      { ...docOne, id: 'vaccine', type: 'Vacunación' },
      { ...docOne, id: 'checkup', type: 'Consulta' },
    ] });
    await renderDocs();
    await screen.findByTestId('doc-analysis');
    const filters = screen.getByTestId('docs-filters');
    expect(filters.children).toHaveLength(4);
    expect(filters.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'docs-filter-all', 'docs-filter-blue', 'docs-filter-green', 'docs-filter-violet',
    ]);
  });

  it.each([
    ['all', 'Todos', 'bg-foreground', 'text-background', true],
    ['blue', 'Vacunación', 'bg-category-blue', 'text-category-blue-strong', false],
    ['green', 'Consulta', 'bg-category-green', 'text-category-green-strong', false],
    ['amber', 'Desparasitación', 'bg-category-amber', 'text-category-amber-strong', false],
    ['violet', 'Análisis', 'bg-category-violet', 'text-category-violet-strong', false],
    ['neutral', 'Otros', 'bg-default', 'text-muted', false],
  ] as const)('cierra clases, objetivo táctil y pulsado de %s', async (id, label, surface, ink, selected) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: filterDocs });
    await renderDocs();
    await screen.findByTestId('doc-unknown');
    const chip = screen.getByTestId(`docs-filter-${id}`);
    expect(chip.props.className).toBe(`h-8.5 items-center justify-center rounded-full px-3 ${surface}`);
    expect(chip.props.accessibilityRole).toBe('button');
    expect(chip.props.accessibilityState).toEqual({ selected });
    expect(chip.props.hitSlop).toEqual({ top: 6, bottom: 6, left: 6, right: 6 });
    expect(chip.children).toHaveLength(1);
    expect(within(chip).getByText(label).props.className).toBe(`text-13 font-extrabold ${ink}`);
    expect(chip).toHaveStyle({ opacity: 1 });
    await fireEvent(chip, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(chip).toHaveStyle({ opacity: 0.8 });
  });

  it.each(['empty', 'error', 'loading'] as const)('no pinta filtros con lista %s', async (state) => {
    if (state === 'loading') mockListPetDocs.mockReturnValue(pending<PetDocsState>());
    else if (state === 'error') mockListPetDocs.mockResolvedValue({ kind: 'error' });
    else mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await screen.findByTestId(state === 'loading' ? 'docs-list-skeleton' : state === 'error' ? 'docs-error' : 'docs-empty');
    expect(screen.queryByTestId('docs-filters')).toBeNull();
  });
});

describe('#175 R9: filtrar por categoría', () => {
  it.each([
    ['blue', 'vaccine'], ['green', 'checkup'], ['amber', 'deworming'],
    ['violet', 'analysis'], ['neutral', 'unknown'],
  ] as const)('filtra %s, conserva el orden y renumera las entradas', async (slot, id) => {
    const original = filterDocs.find((document) => document.id === id)!;
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [{ ...original, id: 'extra' }, ...filterDocs] });
    await renderDocs();
    await screen.findByTestId('doc-unknown');
    await fireEvent.press(screen.getByTestId(`docs-filter-${slot}`));
    await waitFor(() => expect(docsChildren()).toEqual([
      'View', 'docs-filters', 'docs-entry-extra', `docs-entry-${id}`, 'docs-upload',
    ]));
    expect(screen.getByTestId('docs-entry-extra').props.index).toBe(0);
    expect(screen.getByTestId(`docs-entry-${id}`).props.index).toBe(1);
    for (const candidate of ['all', 'blue', 'green', 'amber', 'violet', 'neutral']) {
      expect(screen.getByTestId(`docs-filter-${candidate}`).props.accessibilityState).toEqual({ selected: candidate === slot });
    }
    const selected = screen.getByTestId(`docs-filter-${slot}`);
    expect(selected.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-foreground');
    expect(selected.children[0]).toHaveProperty('props.className', 'text-13 font-extrabold text-background');
    const all = screen.getByTestId('docs-filter-all');
    expect(all.props.className).toBe('h-8.5 items-center justify-center rounded-full px-3 bg-default');
    expect(within(all).getByText('Todos').props.className).toBe('text-13 font-extrabold text-foreground');
  });

  it.each([
    ['vacuna', 'blue', 'vaccine'], ['Vaccination', 'blue', 'vaccine'],
    ['  VACUNACIÓN  ', 'blue', 'vaccine'], ['vacunacion', 'blue', 'vaccine'],
    ['checkup', 'green', 'checkup'], ['Deworming', 'amber', 'deworming'],
    ['lab', 'violet', 'analysis'],
  ] as const)('incluye el sinónimo %s en %s', async (type, slot, originalId) => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [...filterDocs, { ...docOne, id: 'variant', type }] });
    await renderDocs();
    await screen.findByTestId('doc-variant');
    await fireEvent.press(screen.getByTestId(`docs-filter-${slot}`));
    await waitFor(() => expect(docsChildren()).toEqual([
      'View', 'docs-filters', `docs-entry-${originalId}`, 'docs-entry-variant', 'docs-upload',
    ]));
    expect(within(screen.getByTestId('doc-variant')).getByText('Antirrábica')).toBeVisible();
  });

  it('incluye Radiografía y Receta solo en Otros', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [
      ...filterDocs.filter((document) => ['unknown', 'analysis', 'vaccine'].includes(document.id)),
      { ...docOne, id: 'prescription', type: 'Receta' },
    ] });
    await renderDocs();
    await screen.findByTestId('doc-prescription');
    await fireEvent.press(screen.getByTestId('docs-filter-neutral'));
    await waitFor(() => expect(docsChildren()).toEqual([
      'View', 'docs-filters', 'docs-entry-unknown', 'docs-entry-prescription', 'docs-upload',
    ]));
    expect(within(screen.getByTestId('doc-unknown')).getByText('Radiografía')).toBeVisible();
    expect(within(screen.getByTestId('doc-prescription')).getByText('Receta')).toBeVisible();
    for (const [slot, id] of [['blue', 'vaccine'], ['violet', 'analysis']]) {
      await fireEvent.press(screen.getByTestId(`docs-filter-${slot}`));
      await waitFor(() => expect(docsChildren()).toEqual([
        'View', 'docs-filters', `docs-entry-${id}`, 'docs-upload',
      ]));
      expect(screen.queryByTestId('doc-unknown')).toBeNull();
      expect(screen.queryByTestId('doc-prescription')).toBeNull();
    }
  });

  it('restaura con Todos las entradas y el orden del backend', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: filterDocs });
    await renderDocs();
    await screen.findByTestId('doc-unknown');
    await fireEvent.press(screen.getByTestId('docs-filter-blue'));
    await waitFor(() => expect(screen.getByTestId('docs-filter-blue').props.accessibilityState).toEqual({ selected: true }));
    await fireEvent.press(screen.getByTestId('docs-filter-all'));
    await waitFor(() => expect(screen.getByTestId('docs-filter-all').props.accessibilityState).toEqual({ selected: true }));
    expect(docsChildren()).toEqual([
      'View', 'docs-filters', 'docs-entry-unknown', 'docs-entry-analysis', 'docs-entry-checkup',
      'docs-entry-vaccine', 'docs-entry-deworming', 'docs-upload',
    ]);
  });

  it('vuelve a Todos después de una subida correcta con Análisis seleccionado', async () => {
    const analysis = { ...docOne, id: 'analysis', type: 'Análisis' };
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [analysis, docOne] });
    mockListPetDocs.mockResolvedValueOnce({ kind: 'ok', docs: [analysis, docOne, docTwo] });
    const view = await renderDocs();
    await screen.findByTestId('doc-analysis');
    await fireEvent.press(screen.getByTestId('docs-filter-violet'));
    await waitFor(() => expect(screen.getByTestId('docs-filter-violet').props.accessibilityState).toEqual({ selected: true }));
    await view.rerender(docsView('es', '1')); // #185 R2.3: resultado recibido desde la pantalla de subida
    await screen.findByTestId('doc-doc-2');
    await waitFor(() => expect(screen.getByTestId('docs-filter-all').props.accessibilityState).toEqual({ selected: true }));
    expect(screen.getByTestId('docs-filter-violet').props.accessibilityState).toEqual({ selected: false });
    expect(docsChildren()).toEqual([
      'View', 'docs-filters', 'docs-entry-analysis', 'docs-entry-doc-1', 'docs-entry-doc-2', 'docs-upload',
    ]);
    expect(screen.queryByTestId('docs-upload-form')).toBeNull();
  });
});


describe('#185 R1: el formulario no es hijo de la lista', () => {
  it('mantiene el formulario fuera del scroll y del teclado de la lista con documentos', async () => {
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [documentAsset] });
    await renderDocs();
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    await waitFor(() => expect(mockGetDocumentAsync).toHaveBeenCalledTimes(1));
    expect(within(screen.getByTestId('screen-docs')).queryByTestId('docs-upload-form')).toBeNull();
    expect(within(screen.getByTestId('docs-keyboard-avoider')).queryByTestId('docs-upload-form')).toBeNull();
  });

  it('mantiene el formulario fuera del scroll y del teclado de la lista vacía', async () => {
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [documentAsset] });
    await renderDocs();
    await fireEvent.press(await screen.findByTestId('docs-empty-action'));
    await waitFor(() => expect(mockGetDocumentAsync).toHaveBeenCalledTimes(1));
    expect(within(screen.getByTestId('screen-docs')).queryByTestId('docs-upload-form')).toBeNull();
    expect(within(screen.getByTestId('docs-keyboard-avoider')).queryByTestId('docs-upload-form')).toBeNull();
  });
});


describe('#185 R2.1: elegir archivo navega a la pantalla del formulario', () => {
  it.each([
    ['vacuna.pdf', 'application/pdf'],
    ['vacuna.jpg', 'image/jpeg'],
    ['vacuna.png', 'image/png'],
  ])('navega una vez con los params de %s', async (name, contentType) => {
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: `file:///cache/${name}`, name, mimeType: contentType, size: 1000, lastModified: 0 }],
    });
    await renderDocs();
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/pets/[petId]/docs-upload',
      params: { petId: 'pet-1', uri: `file:///cache/${name}`, name, mimeType: contentType, size: '1000', contentType },
    });
    expect(screen.getByTestId('docs-upload')).toBeVisible();
  });

  it.each([
    [{ ...documentAsset, mimeType: 'text/plain', name: 'a.txt' }, 'Choose a PDF, JPEG, or PNG file'],
    [{ ...documentAsset, size: 10485761 }, 'The file is larger than 10 MB'],
  ] as const)('no navega al rechazar el archivo: %s', async (asset, error) => {
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [asset] });
    await renderDocs('en');
    await fireEvent.press(await screen.findByTestId('docs-upload'));
    expect(screen.getByTestId('docs-action-error')).toHaveTextContent(error);
    expect(router.push).not.toHaveBeenCalled();
  });
});


describe('#185 R2.3: la lista refresca y vuelve a «Todos» al recibir uploaded', () => {
  it('refresca una vez por cambio de nonce y restaura Todos', async () => {
    const view = await renderDocs();
    await fireEvent.press(await screen.findByTestId('docs-filter-blue'));
    expect(screen.getByTestId('docs-filter-blue').props.accessibilityState).toEqual({ selected: true });
    await view.rerender(docsView('es', '1'));
    await waitFor(() => expect(mockListPetDocs).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId('docs-filter-all').props.accessibilityState).toEqual({ selected: true });
    await fireEvent.press(screen.getByTestId('docs-filter-blue'));
    await view.rerender(docsView('es', '1'));
    expect(mockListPetDocs).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('docs-filter-blue').props.accessibilityState).toEqual({ selected: true });
  });

  it('no refresca ni reinicia el filtro con uploaded vacío o ausente', async () => {
    const view = await renderDocs('es', '');
    await fireEvent.press(await screen.findByTestId('docs-filter-blue'));
    await view.rerender(docsView('es', ''));
    await view.rerender(docsView());
    expect(mockListPetDocs).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('docs-filter-blue').props.accessibilityState).toEqual({ selected: true });
  });
});
