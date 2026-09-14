import {
  cleanup,
  render,
  screen,
  within,
} from '@testing-library/react-native';
import { blobatar } from 'blobatar';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  cancelAnimation,
  ReduceMotion,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { TestInstance } from 'test-renderer';
import { Uniwind } from 'uniwind';

import type { PetProfile } from '../../api/types';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  PET_HERO_FADE_HEIGHT,
  PET_HERO_MEDIA_HEIGHT,
  STATUS_DOT_PULSE,
  PetHeroHeader,
} from '../pet-hero-header';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const SOURCE_ROOT = join(process.cwd(), 'src');
const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  ),
  useReducedMotion: () => mockUseReducedMotion(),
  withRepeat: jest.fn((animation: unknown) => animation),
  withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)),
  withTiming: jest.fn((value: number) => value),
  cancelAnimation: jest.fn(),
}));

const mockWithRepeat = jest.mocked(withRepeat);
const mockWithTiming = jest.mocked(withTiming);
const mockCancelAnimation = jest.mocked(cancelAnimation);

function readSource(...segments: string[]): string {
  return readFileSync(join(SOURCE_ROOT, ...segments), 'utf8');
}

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

function makePet(overrides: Partial<PetProfile> = {}): PetProfile {
  return {
    id: 'pet-1',
    name: 'Luna',
    species: 'dog',
    breed: 'Mixed',
    sex: 'female',
    birthDate: null,
    approxAgeMonths: 30,
    ageMonths: 30,
    currentWeightKg: 12,
    size: 'medium',
    color: 'black',
    sterilized: true,
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
    ...overrides,
  };
}

/** Bloque de un `@variant` de global.css, con emparejado de llaves. */
function extractVariant(name: 'light' | 'dark'): string {
  const globalCss = readFileSync(
    join(SOURCE_ROOT, 'theme', 'global.css'),
    'utf8',
  );
  const marker = `@variant ${name} {`;
  const start = globalCss.indexOf(marker);
  const bodyStart = start + marker.length;
  let depth = 1;

  for (let index = bodyStart; index < globalCss.length; index += 1) {
    if (globalCss[index] === '{') depth += 1;
    if (globalCss[index] === '}') depth -= 1;
    if (depth === 0) return globalCss.slice(bodyStart, index);
  }

  return '';
}

function backgroundToken(variant: 'light' | 'dark'): string {
  return (
    extractVariant(variant).match(/--background:\s*([^;]+);/)?.[1].trim() ?? ''
  );
}

function BackgroundProbe() {
  const [background] = useThemeColors(['background']);

  return <Text testID="background-probe">{background}</Text>;
}

function HeroWrapper({ children }: { children: ReactNode }) {
  return <HeroUINativeProvider>{children}</HeroUINativeProvider>;
}

async function renderHero(element: ReactNode) {
  return render(<>{element}</>, { wrapper: HeroWrapper });
}

describe('R1: PetHeroHeader es el único hero compartido', () => {
  afterEach(() => cleanup());

  it('monta pet-hero en la variante a sangre de Home', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="bleed" />);

    expect(screen.getByTestId('pet-hero')).toBeVisible();
  });

  it('monta pet-hero en la variante card de Profile', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="card" />);

    expect(screen.getByTestId('pet-hero')).toBeVisible();
  });

  it('usa la variante card por defecto', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} />);

    expect(screen.getByTestId('pet-hero').props.className).toContain(
      'rounded-card',
    );
  });

  it('exporta las dos constantes de dimensión del hero', () => {
    expect(PET_HERO_MEDIA_HEIGHT).toBe(260);
    expect(PET_HERO_FADE_HEIGHT).toBe(64);
  });

  it('no importa el selector de mascota ni la capa de API', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    // Literal prescrito por la spec (requirements R1).
    expect(source).not.toMatch(
      /from '\.\.\/(api\/(pets|activity)|components\/pet-switcher)'/,
    );
    // Y las rutas que de verdad tendría un import desde src/components/.
    expect(source).not.toMatch(/from '\.\/pet-switcher'/);
    expect(source).not.toMatch(/from '\.\.\/api\/(?!types')/);
    expect(source).toContain("import type { PetProfile } from '../api/types';");
  });
});

describe('R2: el hero pinta foto a sangre o blobatar', () => {
  afterEach(() => cleanup());

  it('pinta la foto de la mascota con la clave de caché estable', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });

    await renderHero(<PetHeroHeader pet={pet} variant="bleed" />);

    expect(screen.getByTestId('pet-hero-media').props.source).toEqual([
      { uri: pet.photoUrl, cacheKey: pet.id },
    ]);
  });

  it('pinta el blobatar determinista cuando no hay foto', async () => {
    const pet = makePet({ photoUrl: null });

    await renderHero(<PetHeroHeader pet={pet} variant="bleed" />);

    const media = screen.getByTestId('pet-hero-media');

    expect(media.props.xml).toContain('<svg');
    expect(media.props.xml).toBe(blobatar(pet.name));
  });

  it('reserva el alto de la zona de medios en las dos ramas', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="bleed" />);

    const media = screen.getByTestId('pet-hero-media');

    expect(media.props.height).toBe(PET_HERO_MEDIA_HEIGHT);
  });
});

describe('R3: el texto del hero va sobre fondo opaco', () => {
  afterEach(() => cleanup());

  it('la banda inferior declara bg-background sin opacidad', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="bleed" />);

    const caption = screen.getByTestId('pet-hero-caption').props.className;

    expect(caption).toContain('bg-background');
    expect(caption).not.toMatch(/bg-background\/\d/);
  });

  it('la banda del slot declara bg-background sin opacidad', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    const slot = screen.getByTestId('pet-hero-slot').props.className;

    expect(slot).toContain('bg-background');
    expect(slot).not.toMatch(/bg-background\/\d/);
    expect(screen.getByTestId('slot-child')).toBeVisible();
  });

  it('funde la imagen hacia el fondo opaco por arriba y por abajo', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    const bottom = screen.getByTestId('pet-hero-fade-bottom').props.style;
    const top = screen.getByTestId('pet-hero-fade-top').props.style;

    expect(bottom.experimental_backgroundImage).toMatch(
      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6} 100%\)$/,
    );
    expect(top.experimental_backgroundImage).toMatch(
      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6} 0%, #[0-9A-Fa-f]{6}00 100%\)$/,
    );
    expect(bottom.height).toBe(PET_HERO_FADE_HEIGHT);
    expect(top.height).toBe(PET_HERO_FADE_HEIGHT);
  });

  it('usa el nombre prefijado de la propiedad, que es el único que existe en RN 0.86', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(source).toContain('experimental_backgroundImage');
    expect(source).not.toMatch(/(?<!experimental_)backgroundImage/);
  });

  // Candado de forma del token: la parada transparente del degradado se
  // concatena como `${background}00`, así que el token debe seguir siendo un
  // hex de 6 dígitos en los dos temas o la cadena deja de ser válida.
  it.each(['light', 'dark'] as const)(
    'resuelve el token background como hex de 6 dígitos en tema %s',
    async (variant) => {
      const token = backgroundToken(variant);

      expect(token).toMatch(/^#[0-9A-Fa-f]{6}$/);

      const resolve = (name: string) =>
        name === '--color-background' || name === '--background'
          ? token
          : undefined;
      const spy = jest.spyOn(Uniwind, 'getCSSVariable');

      spy.mockImplementation(
        resolve as unknown as typeof Uniwind.getCSSVariable,
      );
      const view = await render(<BackgroundProbe />);

      expect(view.getByTestId('background-probe').props.children).toMatch(
        /^#[0-9A-Fa-f]{6}$/,
      );
      spy.mockRestore();
    },
  );

  it('no renderiza texto sobre la capa de medios', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });

    await renderHero(<PetHeroHeader pet={pet} variant="bleed" />);

    expect(
      within(screen.getByTestId('pet-hero-media')).queryAllByText(/\S/),
    ).toEqual([]);
    expect(
      within(screen.getByTestId('pet-hero-caption')).getByTestId(
        'pet-hero-name',
      ),
    ).toBeVisible();
  });
});

describe('R4: el slot superior respeta la safe area', () => {
  afterEach(() => cleanup());

  it('baja el slot con insets.top + 12, nunca con un valor fijo', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    expect(screen.getByTestId('pet-hero-slot').props.style).toMatchObject({
      paddingTop: 52,
    });
  });

  it('lee la safe area del hook, no de una constante del fichero', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(source).toContain('useSafeAreaInsets');
    expect(source).toContain('insets.top + 12');
  });

  it('no gasta alto de foto cuando no hay slot', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="card" />);

    expect(screen.queryByTestId('pet-hero-slot')).toBeNull();
    expect(screen.queryByTestId('pet-hero-fade-top')).toBeNull();
    expect(screen.getByTestId('pet-hero-fade-bottom')).toBeVisible();
  });
});

describe('R8: el hero sin mascota es un skeleton dimensionado', () => {
  afterEach(() => cleanup());

  it('reserva el alto exacto de la zona de medios', async () => {
    await renderHero(<PetHeroHeader pet={null} variant="bleed" />);

    const skeleton = screen.getByTestId('pet-hero-skeleton');

    expect(StyleSheet.flatten(skeleton.props.style)).toMatchObject({
      height: PET_HERO_MEDIA_HEIGHT,
    });
    expect(screen.queryByTestId('pet-hero-media')).toBeNull();
  });

  it('sigue montando el slot mientras el detalle carga', async () => {
    await renderHero(
      <PetHeroHeader pet={null} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    expect(screen.getByTestId('pet-hero-slot')).toBeVisible();
    expect(screen.getByTestId('slot-child')).toBeVisible();
    expect(screen.getByTestId('pet-hero-skeleton')).toBeVisible();
  });

  it('reserva también las dos líneas de la banda inferior', async () => {
    await renderHero(<PetHeroHeader pet={null} variant="bleed" />);

    const caption = screen.getByTestId('pet-hero-caption');

    expect(within(caption).queryByTestId('pet-hero-name')).toBeNull();
    expect(within(caption).queryAllByText(/\S/)).toEqual([]);
  });

  it('no degrada a un Spinner suelto', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(source).toContain("import { Skeleton } from 'heroui-native';");
    expect(source).not.toContain('Spinner');
  });
});

describe('#73 R8: la pildora de estado vive en la banda inferior, encima del nombre, con todas sus decisiones candadas', () => {
  afterEach(() => cleanup());

  it('pinta la pildora con sus dos hijos en orden punto -> texto y el texto formateado por el llamante', async () => {
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );

    const pill = screen.getByTestId('pet-hero-status');
    expect(pill.children).toHaveLength(2);
    expect(elementChild(pill, 0).props.testID).toBe('pet-hero-status-dot');
    expect(elementChild(pill, 1).props.testID).toBe('pet-hero-status-text');
    expect(
      within(pill).getByTestId('pet-hero-status-text'),
    ).toHaveTextContent('En línea');
  });

  it.each([
    ['success', 'bg-success-soft', 'bg-success', 'text-accent-strong'],
    ['warning', 'bg-warning-soft', 'bg-warning-strong', 'text-warning-strong'],
    ['muted', 'bg-default', 'bg-muted', 'text-muted'],
  ] as const)(
    '%s: superficie, punto y tinta usan los tokens del tono',
    async (tone, surfaceClass, dotClass, textClass) => {
      await renderHero(
        <PetHeroHeader pet={makePet()} status={{ label: 'x', tone }} />,
      );

      const pill = screen.getByTestId('pet-hero-status');
      expect(pill.props.className).toContain(surfaceClass);
      expect(elementChild(pill, 0).props.className).toContain(dotClass);
      expect(elementChild(pill, 1).props.className).toContain(textClass);
    },
  );

  it('es una capsula rounded-full de text-2xs font-semibold, self-start, sin animate-pulse ni Chip', async () => {
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );

    const pill = screen.getByTestId('pet-hero-status');
    const dot = elementChild(pill, 0);
    const text = elementChild(pill, 1);
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(pill.props.className).toContain(
      'flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5',
    );
    expect(dot.props.className).toContain('size-1.5 rounded-full');
    expect(text.props.className).toContain('text-2xs font-semibold');
    expect(source).not.toContain('animate-pulse');
    expect(source).toContain("from 'react-native-reanimated'");
    expect(source).not.toMatch(/\bChip\b/);
  });

  it('es un solo nodo accesible con el texto del estado como nombre', async () => {
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );

    const pill = screen.getByTestId('pet-hero-status');
    expect(pill.props.accessible).toBe(true);
    expect(pill.props.accessibilityLabel).toBe('En línea');
  });

  it('va dentro de la banda inferior y antes del nombre, nunca en el slot ni sobre la foto', async () => {
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      >
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    const caption = screen.getByTestId('pet-hero-caption');
    const left = elementChild(caption, 0);
    expect(elementChild(left, 0).props.testID).toBe('pet-hero-status');
    expect(elementChild(left, 1).props.testID).toBe('pet-hero-name');
    expect(
      within(screen.getByTestId('pet-hero-slot')).queryByTestId(
        'pet-hero-status',
      ),
    ).toBeNull();
    expect(
      within(screen.getByTestId('pet-hero-media')).queryByTestId(
        'pet-hero-status',
      ),
    ).toBeNull();
  });

  it('sin status no hay pildora (Profile) y con pet null tampoco, aunque llegue status', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} />);
    expect(screen.queryByTestId('pet-hero-status')).toBeNull();
    cleanup();

    await renderHero(
      <PetHeroHeader
        pet={null}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );
    expect(screen.queryByTestId('pet-hero-status')).toBeNull();
    expect(
      within(screen.getByTestId('pet-hero-caption')).queryAllByText(/\S/),
    ).toEqual([]);
  });
});

describe('#73 E2: el punto de "en linea" pulsa con Reanimated y respeta reduced motion', () => {
  beforeEach(() => {
    mockWithRepeat.mockClear();
    mockWithTiming.mockClear();
    mockCancelAnimation.mockClear();
    mockUseReducedMotion.mockReturnValue(false);
  });

  afterEach(() => cleanup());

  it('STATUS_DOT_PULSE es el animate-pulse de Tailwind: 1000 ms por tramo, bezier(0.4, 0, 0.6, 1) y reduced motion del sistema', () => {
    expect(STATUS_DOT_PULSE).toMatchObject({
      duration: 1000,
      reduceMotion: ReduceMotion.System,
    });
    expect(readSource('components', 'pet-hero-header.tsx')).toContain(
      'easing: Easing.bezier(0.4, 0, 0.6, 1)',
    );
  });

  it('con reduced motion activo el punto es estatico: sin estilo animado y sin arrancar ningun bucle', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );
    const dot = within(screen.getByTestId('pet-hero-status')).getByTestId(
      'pet-hero-status-dot',
    );

    expect(dot).not.toHaveAnimatedStyle({ opacity: 1 });
    expect(mockWithRepeat).not.toHaveBeenCalled();
    expect(dot.props.className).toContain('bg-success');
  });

  it('con tone success el punto es el nodo animado: 1 -> 0.5 -> 1 con STATUS_DOT_PULSE, infinito y sin reverse', async () => {
    await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );
    const dot = within(screen.getByTestId('pet-hero-status')).getByTestId(
      'pet-hero-status-dot',
    );

    expect(dot).toHaveAnimatedStyle({ opacity: 1 });
    expect(mockWithTiming).toHaveBeenNthCalledWith(1, 0.5, STATUS_DOT_PULSE);
    expect(mockWithTiming).toHaveBeenNthCalledWith(2, 1, STATUS_DOT_PULSE);
    expect(mockWithRepeat).toHaveBeenCalledTimes(1);
    expect(mockWithRepeat).toHaveBeenCalledWith(expect.anything(), -1, false);
  });

  it.each([['warning'], ['muted']] as const)(
    '%s: el punto es estatico y no arranca ningun bucle',
    async (tone) => {
      await renderHero(
        <PetHeroHeader pet={makePet()} status={{ label: 'x', tone }} />,
      );
      const dot = within(screen.getByTestId('pet-hero-status')).getByTestId(
        'pet-hero-status-dot',
      );

      expect(dot).not.toHaveAnimatedStyle({ opacity: 1 });
      expect(mockWithRepeat).not.toHaveBeenCalled();
    },
  );

  it('al desmontar cancela el bucle del punto', async () => {
    const { unmount } = await renderHero(
      <PetHeroHeader
        pet={makePet()}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );

    unmount();
    expect(mockCancelAnimation).toHaveBeenCalledTimes(1);
  });
});
