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
  ReduceMotion,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import * as heroExports from '../pet-hero-header';
import type { TestInstance } from 'test-renderer';
import { Uniwind } from 'uniwind';

import type { PetProfile } from '../../api/types';
import { MOTION_CELEBRATION_EASE_OUT } from '../../theme/motion';
import { useThemeColors } from '../../theme/use-theme-colors';
import * as themeColors from '../../theme/use-theme-colors';
import {
  PET_HERO_FADE_HEIGHT,
  PET_HERO_MEDIA_HEIGHT,
  PET_HERO_SCRIM_HEIGHT,
  STATUS_TONE_CLASSES,
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

jest.mock('heroui-native', () => {
  const actual = jest.requireActual<typeof import('heroui-native')>(
    'heroui-native',
  );
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    ...actual,
    Skeleton: (props: Record<string, unknown>) =>
      React.createElement(View, props),
  };
});

jest.mock('../ping-ring', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { PingRing: (props: Record<string, unknown>) => React.createElement(View, props) };
});

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  );
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    ...actual,
    // HeroUI Skeleton usa Animated.View; el requireActual de Jest no lo trae.
    default: { ...actual.default, View },
    useReducedMotion: () => mockUseReducedMotion(),
    withRepeat: jest.fn((animation: unknown) => animation),
    withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)),
    withTiming: jest.fn((value: number) => value),
    withDelay: jest.fn((_ms: number, animation: unknown) => animation),
    cancelAnimation: jest.fn(),
  };
});

const mockWithTiming = jest.mocked(withTiming);

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
    mealsToday: null,
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

function BackgroundProbe({ token = 'background' }: { token?: 'background' | 'scrim' }) {
  const [background] = useThemeColors([token]);

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

  it('exporta las constantes de dimensión del hero (enmendado por #195 R1)', () => {
    expect(PET_HERO_MEDIA_HEIGHT).toBe(330);
    expect(PET_HERO_FADE_HEIGHT).toBe(160);
    expect(PET_HERO_SCRIM_HEIGHT).toBe(130);
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

  it('pinta la foto de la mascota con la clave de caché estable (enmendado por #195 R2)', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });

    await renderHero(<PetHeroHeader pet={pet} variant="bleed" />);

    expect(screen.getByTestId('pet-hero-media').props.contentPosition).toEqual({ top: 0, left: '50%' });
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

  it('el pie flota sin fondo (enmendado por #195 R6)', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="bleed" />);

    const caption = screen.getByTestId('pet-hero-caption').props.className;

    expect(caption).not.toMatch(/\bbg-/);
  });

  it('el slot flota sin fondo ni padding (enmendado por #195 R5) (enmendado por #195 R14)', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    const slot = screen.getByTestId('pet-hero-slot').props.className;

    expect(slot).toBe('absolute inset-x-4');
    expect(screen.getByTestId('slot-child')).toBeOnTheScreen();
  });

  it('funde la imagen con scrim superior y degradado inferior (enmendado por #195 R3)', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    const bottom = screen.getByTestId('pet-hero-fade-bottom').props.style;
    const top = screen.getByTestId('pet-hero-scrim-top').props.style;

    expect(bottom.experimental_backgroundImage).toMatch(
      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}00 0%, #[0-9A-Fa-f]{6}59 35%, #[0-9A-Fa-f]{6}D9 65%, #[0-9A-Fa-f]{6} 100%\)$/,
    );
    expect(top.experimental_backgroundImage).toMatch(
      /^linear-gradient\(to bottom, #[0-9A-Fa-f]{6}80 0%, #[0-9A-Fa-f]{6}00 100%\)$/,
    );
    expect(bottom.height).toBe(PET_HERO_FADE_HEIGHT);
    expect(top.height).toBe(PET_HERO_SCRIM_HEIGHT);
  });

  it('usa el nombre prefijado de la propiedad, que es el único que existe en RN 0.86', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(source).toContain('experimental_backgroundImage');
    expect(source).not.toMatch(/(?<!experimental_)backgroundImage/);
  });

  // Candado de forma del token: la parada transparente del degradado se
  // concatena como `${background}00`, así que el token debe seguir siendo un
  // hex de 6 dígitos en los dos temas o la cadena deja de ser válida.
  it.each([['light', 'background'], ['dark', 'background'], ['light', 'scrim'], ['dark', 'scrim']] as const)(
    'resuelve %s %s como hex de 6 dígitos (enmendado por #195 R3)',
    async (variant, name) => {
      const token = name === 'background' ? backgroundToken(variant) : extractVariant(variant).match(/--scrim:\s*([^;]+);/)?.[1].trim() ?? '';

      expect(token).toMatch(/^#[0-9A-Fa-f]{6}$/);

      const resolve = (key: string) =>
        key === `--color-${name}` || key === `--${name}`
          ? token
          : undefined;
      const spy = jest.spyOn(Uniwind, 'getCSSVariable');

      spy.mockImplementation(
        resolve as unknown as typeof Uniwind.getCSSVariable,
      );
      const view = await render(<BackgroundProbe token={name} />);

      expect(view.getByTestId('background-probe').props.children).toMatch(
        /^#[0-9A-Fa-f]{6}$/,
      );
      spy.mockRestore();
    },
  );

  it('no renderiza texto sobre la capa de medios (enmendado por #195 R14)', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });

    await renderHero(<PetHeroHeader pet={pet} variant="bleed" />);

    expect(
      within(screen.getByTestId('pet-hero-media')).queryAllByText(/\S/),
    ).toEqual([]);
    expect(
      within(screen.getByTestId('pet-hero-caption')).getByTestId(
        'pet-hero-name',
      ),
    ).toBeOnTheScreen();
  });
});

describe('R4: el slot superior respeta la safe area', () => {
  afterEach(() => cleanup());

  it('baja el slot con insets.top + 12, nunca con un valor fijo (enmendado por #195 R5) (enmendado por #195 R14)', async () => {
    await renderHero(
      <PetHeroHeader pet={makePet()} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    expect(StyleSheet.flatten(screen.getByTestId('pet-hero-slot').props.style)).toMatchObject({
      top: 52,
    });
  });

  it('lee la safe area del hook, no de una constante del fichero', () => {
    const source = readSource('components', 'pet-hero-header.tsx');

    expect(source).toContain('useSafeAreaInsets');
    expect(source).toContain('insets.top + 12');
  });

  it('no gasta alto de foto cuando no hay slot (enmendado por #195 R5)', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} variant="card" />);

    expect(screen.queryByTestId('pet-hero-slot')).toBeNull();
    expect(screen.queryByTestId('pet-hero-fade-top')).toBeNull();
    expect(screen.queryByTestId('pet-hero-scrim-top')).toBeNull();
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

  it('sigue montando el slot mientras el detalle carga (enmendado por #195 R14)', async () => {
    await renderHero(
      <PetHeroHeader pet={null} variant="bleed">
        <Text testID="slot-child">selector</Text>
      </PetHeroHeader>,
    );

    expect(screen.getByTestId('pet-hero-slot')).toBeOnTheScreen();
    expect(screen.getByTestId('slot-child')).toBeOnTheScreen();
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
    ['success', 'bg-surface-secondary', 'bg-accent', 'text-accent-strong'],
    ['warning', 'bg-warning-soft', 'bg-warning-strong', 'text-warning-strong'],
    ['muted', 'bg-default', 'bg-muted', 'text-muted'],
  ] as const)(
    '%s: superficie, punto y tinta usan los tokens del tono (enmendado por #195 R7)',
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

  it('es una capsula rounded-full de text-xs font-bold, self-start, sin animate-pulse ni Chip (enmendado por #195 R7)', async () => {
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
      'flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-0.75',
    );
    expect(dot.props.className).toContain('relative size-2 rounded-full');
    expect(text.props.className).toContain('text-xs font-bold');
    expect(source).not.toMatch(/className=[^\n]*animate-pulse/);
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
    const view = await renderHero(<PetHeroHeader pet={makePet()} />);
    expect(view.queryByTestId('pet-hero-status')).toBeNull();

    await view.rerender(
      <PetHeroHeader
        pet={null}
        status={{ label: 'En línea', tone: 'success' }}
      />,
    );
    expect(view.queryByTestId('pet-hero-status')).toBeNull();
    expect(
      within(view.getByTestId('pet-hero-caption')).queryAllByText(/\S/),
    ).toEqual([]);
  });
});

describe('#195 R8: anillo de estado sustituye el pulso de opacidad', () => {
  afterEach(() => { cleanup(); mockUseReducedMotion.mockReturnValue(false); });
  it('success con mascota pinta un único ping con timing propio', async () => {
    mockUseReducedMotion.mockReturnValue(false);
    await renderHero(<PetHeroHeader pet={makePet()} status={{ label: 'En línea', tone: 'success' }} />);
    const dot = screen.getByTestId('pet-hero-status-dot');
    const ring = within(dot).getByTestId('pet-hero-status-ping');
    expect(dot.children).toEqual([ring]);
    expect(ring.props.className).toBe('inset-0 rounded-full bg-accent');
    expect(ring.props.delay).toBe(0);
    expect(ring.props.timing).toEqual({ ...MOTION_CELEBRATION_EASE_OUT, duration: 1600 });
    expect(dot.props.style).toBeUndefined();
  });
  it.each([['success', true], ['warning', false], ['muted', false]] as const)(
    '%s con reduceMotion %s deja el punto sin hijos', async (tone, reduced) => {
      mockUseReducedMotion.mockReturnValue(reduced);
      await renderHero(<PetHeroHeader pet={makePet()} status={{ label: 'estado', tone }} />);
      expect(screen.getByTestId('pet-hero-status-dot').children).toEqual([]);
      expect(screen.queryByTestId('pet-hero-status-ping')).toBeNull();
    },
  );
  it('sin mascota no hay anillo y la constante anterior desaparece', async () => {
    await renderHero(<PetHeroHeader pet={null} status={{ label: 'En línea', tone: 'success' }} />);
    expect(screen.queryByTestId('pet-hero-status-ping')).toBeNull();
    expect(Object.keys(heroExports)).not.toContain('STATUS_DOT_PULSE');
  });
});

describe('#127 R2: el skeleton del hero lleva su receta en el árbol', () => {
  afterEach(() => cleanup());

  it('pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 330 como único estilo (enmendado por #195 R1)', async () => {
    await renderHero(<PetHeroHeader pet={null} variant="bleed" />);

    const skeleton = screen.getByTestId('pet-hero-skeleton');

    expect(skeleton.props.className).toBe('w-full');
    expect(skeleton.props.style).toStrictEqual({ height: 330 });
  });
});


describe('#195 R4: capa de oscurecimiento', () => {
  afterEach(() => cleanup());
  it('superpone el token photo-dim sin interceptar toques, tras la foto', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} />);
    const dim = screen.getByTestId('pet-hero-dim');
    expect(dim.props.className).toBe('absolute inset-0 bg-photo-dim');
    expect(dim.props.pointerEvents).toBe('none');
    expect(dim.parent?.children[1]).toBe(dim);
  });
});


describe('#195 R1: frame de 330 y raíz estable', () => {
  afterEach(() => cleanup());
  it.each([
    ['bleed', false, false], ['bleed', true, true],
    ['card', false, true], ['card', true, false],
  ] as const)('%s con mascota %s y slot %s', async (variant, hasPet, hasSlot) => {
    await renderHero(<PetHeroHeader pet={hasPet ? makePet() : null} variant={variant}>
      {hasSlot ? <Text>slot</Text> : null}
    </PetHeroHeader>);
    const root = screen.getByTestId('pet-hero');
    const frame = screen.getByTestId('pet-hero-frame');
    expect(root.children).toEqual([frame]);
    expect(frame.props.style).toEqual({ height: 330 });
    expect(root.props.style).toEqual({ borderCurve: 'continuous' });
    expect(root.props.className).toBe(variant === 'card'
      ? 'overflow-hidden rounded-card bg-default' : 'overflow-hidden bg-default');
  });
});


describe('#195 R2: foto alineada arriba y fundido por identidad', () => {
  beforeEach(() => { mockUseReducedMotion.mockReturnValue(false); mockWithTiming.mockClear(); });
  afterEach(() => cleanup());
  it('pinta la foto como primera capa absoluta con tamaño y caché estables', async () => {
    await renderHero(<PetHeroHeader pet={makePet({ photoUrl: 'http://example.test/luna.jpg' })} />);
    const frame = screen.getByTestId('pet-hero-frame');
    const photo = screen.getByTestId('pet-hero-photo');
    expect(elementChild(frame, 0)).toBe(photo);
    expect(photo.props.className).toBe('absolute inset-0');
    const media = within(photo).getByTestId('pet-hero-media');
    expect(media.props.contentPosition).toEqual({ top: 0, left: '50%' });
    expect(media.props.source).toEqual([{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]);
    expect(StyleSheet.flatten(media.props.style)).toEqual({ width: '100%', height: 330 });
  });
  it('funde al llegar la mascota y al cambiar su id, sin repetir por nombre', async () => {
    const view = await renderHero(<PetHeroHeader pet={null} />);
    expect(mockWithTiming).not.toHaveBeenCalled();
    expect(screen.getByTestId('pet-hero-photo')).toHaveAnimatedStyle({ opacity: 1 }, { shouldMatchAllProps: true });
    await view.rerender(<PetHeroHeader pet={makePet()} />);
    expect(mockWithTiming).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 500, easing: MOTION_CELEBRATION_EASE_OUT.easing, reduceMotion: ReduceMotion.System }));
    mockWithTiming.mockClear();
    await view.rerender(<PetHeroHeader pet={makePet({ id: 'pet-2' })} />);
    expect(mockWithTiming).toHaveBeenCalledTimes(1);
    expect(mockWithTiming).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 500, reduceMotion: ReduceMotion.System }));
    mockWithTiming.mockClear();
    await view.rerender(<PetHeroHeader pet={makePet({ id: 'pet-2', name: 'Milo' })} />);
    expect(mockWithTiming).not.toHaveBeenCalled();
  });
});


describe('#195 R3: degradados exactos sobre la fotografía', () => {
  afterEach(() => { cleanup(); jest.restoreAllMocks(); });
  it('resuelve ambos colores en una llamada y conserva alfa, geometría y toques', async () => {
    const spy = jest.spyOn(themeColors, 'useThemeColors').mockReturnValue(['#FFFFFF', '#0D1117']);
    await renderHero(<PetHeroHeader pet={makePet()}><Text>slot</Text></PetHeroHeader>);
    expect(spy).toHaveBeenCalledWith(['background', 'scrim']);
    const top = screen.getByTestId('pet-hero-scrim-top');
    const bottom = screen.getByTestId('pet-hero-fade-bottom');
    expect(top.props.className).toBe('absolute inset-x-0 top-0');
    expect(bottom.props.className).toBe('absolute inset-x-0 bottom-0');
    expect(top.props.style).toEqual({ height: 130, experimental_backgroundImage: 'linear-gradient(to bottom, #0D111780 0%, #0D111700 100%)' });
    expect(bottom.props.style).toEqual({ height: 160, experimental_backgroundImage: 'linear-gradient(to bottom, #FFFFFF00 0%, #FFFFFF59 35%, #FFFFFFD9 65%, #FFFFFF 100%)' });
    expect(top.props.pointerEvents).toBe('none');
    expect(bottom.props.pointerEvents).toBe('none');
    expect(screen.queryByTestId('pet-hero-fade-top')).toBeNull();
  });
  it('sin slot no hay scrim y el código sin comentarios no usa negro de alfa cero', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} />);
    expect(screen.queryByTestId('pet-hero-scrim-top')).toBeNull();
    const source = readSource('components', 'pet-hero-header.tsx').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
    expect(source).not.toMatch(/\btransparent\b/);
  });
});


describe('#195 R5: fila superior flotante', () => {
  afterEach(() => cleanup());
  it('usa inset superior más 12 y laterales de 16 sin fondo ni padding (enmendado por #195 R14)', async () => {
    await renderHero(<PetHeroHeader pet={makePet()}><Text testID="floating-child">selector</Text></PetHeroHeader>);
    const slot = screen.getByTestId('pet-hero-slot');
    expect(slot.props.className).toBe('absolute inset-x-4');
    expect(StyleSheet.flatten(slot.props.style)).toEqual({ top: 52, opacity: 0, transform: [{ translateY: 14 }] });
    expect(within(slot).getByTestId('floating-child')).toBeOnTheScreen();
  });
  it('sin children no reserva slot ni scrim', async () => {
    await renderHero(<PetHeroHeader pet={null} />);
    expect(screen.queryByTestId('pet-hero-slot')).toBeNull();
    expect(screen.queryByTestId('pet-hero-scrim-top')).toBeNull();
  });
});


describe('#195 R7: píldora del hero sin cambiar los tonos del mapa', () => {
  afterEach(() => cleanup());
  it.each([
    ['success', 'bg-surface-secondary', 'bg-accent', 'text-accent-strong'],
    ['warning', 'bg-warning-soft', 'bg-warning-strong', 'text-warning-strong'],
    ['muted', 'bg-default', 'bg-muted', 'text-muted'],
  ] as const)('fija las tres recetas exactas de %s', async (tone, surface, dot, ink) => {
    await renderHero(<PetHeroHeader pet={makePet()} status={{ label: 'estado', tone }} />);
    const pill = screen.getByTestId('pet-hero-status');
    expect(pill.props.className).toBe(`flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-0.75 ${surface}`);
    expect(pill.children).toHaveLength(2);
    expect(elementChild(pill, 0).props.className).toBe(`relative size-2 rounded-full ${dot}`);
    expect(elementChild(pill, 1).props.className).toBe(`text-xs font-bold ${ink}`);
    expect(STATUS_TONE_CLASSES).toEqual({
      success: { surface: 'bg-success-soft', dot: 'bg-success', text: 'text-accent-strong' },
      warning: { surface: 'bg-warning-soft', dot: 'bg-warning-strong', text: 'text-warning-strong' },
      muted: { surface: 'bg-default', dot: 'bg-muted', text: 'text-muted' },
    });
  });
});


describe('#195 R6: pie y orden exacto de capas', () => {
  afterEach(() => cleanup());
  it.each([false, true])('capas con slot %s y clases exactas del pie', async (slot) => {
    await renderHero(<PetHeroHeader pet={makePet({ breed: null })} highlight={{ value: '2', label: 'Paseos' }} status={{ label: 'En línea', tone: 'success' }}>
      {slot ? <Text>selector</Text> : null}
    </PetHeroHeader>);
    const frame = screen.getByTestId('pet-hero-frame');
    expect(frame.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'pet-hero-photo', 'pet-hero-dim', ...(slot ? ['pet-hero-scrim-top'] : []),
      'pet-hero-fade-bottom', ...(slot ? ['pet-hero-slot'] : []), 'pet-hero-caption',
    ]);
    const caption = screen.getByTestId('pet-hero-caption');
    expect(caption.props.className).toBe('absolute inset-x-4 bottom-1.5 flex-row items-end justify-between gap-3');
    expect(caption.children).toHaveLength(2);
    expect(elementChild(caption, 0).props.className).toBe('min-w-0 flex-1 gap-1');
    expect(elementChild(caption, 0).children).toHaveLength(3);
    expect(elementChild(caption, 1).props.className).toBe('items-end');
    expect(elementChild(caption, 1).children).toHaveLength(2);
    expect(screen.getByTestId('pet-hero-name').props.className).toBe('text-3xl font-black leading-8.5 tracking-title text-foreground');
    expect(screen.getByTestId('pet-hero-breed').props.className).toBe('text-sm font-normal text-muted');
    expect(screen.getByTestId('pet-hero-breed')).toHaveTextContent('—');
    const value = screen.getByTestId('pet-hero-highlight-value');
    expect(value.props.className).toBe('text-28 font-black leading-8 text-foreground');
    expect(value.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(screen.getByTestId('pet-hero-highlight-label').props.className).toBe('text-xs font-semibold text-muted');
  });
  it('sin datos conserva los dos skeletons y omite la cifra', async () => {
    await renderHero(<PetHeroHeader pet={null} />);
    const caption = screen.getByTestId('pet-hero-caption');
    expect(caption.children).toHaveLength(1);
    expect(elementChild(caption, 0).children.map((child) => typeof child === 'string' ? child : child.props.className)).toEqual(['h-9 w-40 rounded-xl', 'h-6 w-24 rounded-xl']);
    expect(screen.queryByTestId('pet-hero-highlight-value')).toBeNull();
  });
});

describe('#195 R14: entradas del hero y visibilidad con movimiento reducido', () => {
  beforeEach(() => mockUseReducedMotion.mockReturnValue(false));
  afterEach(() => { cleanup(); mockUseReducedMotion.mockReturnValue(false); });

  it('anima el slot sin retraso y el pie con un único retraso de 80 ms', async () => {
    const view = await renderHero(<Text>montaje del proveedor</Text>);
    mockWithTiming.mockClear();
    jest.mocked(withDelay).mockClear();
    await view.rerender(<PetHeroHeader pet={null}><Text>selector</Text></PetHeroHeader>);
    const timing = { ...MOTION_CELEBRATION_EASE_OUT, duration: 400 };
    expect(mockWithTiming).toHaveBeenCalledWith(1, timing);
    expect(jest.mocked(withDelay)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(withDelay)).toHaveBeenCalledWith(80, 1);
    expect(mockWithTiming.mock.calls.filter((call) => call[1]?.duration === 400)).toHaveLength(2);
  });

  it('solo anima opacidad y transformación y no añade entering', async () => {
    await renderHero(<PetHeroHeader pet={makePet()}><Text>selector</Text></PetHeroHeader>);
    for (const id of ['pet-hero-slot', 'pet-hero-caption']) {
      const node = screen.getByTestId(id);
      const style = StyleSheet.flatten(node.props.style);
      expect(Object.keys(style).filter((key) => key !== 'top').sort()).toEqual(['opacity', 'transform']);
    }
    const root = screen.getByTestId('pet-hero');
    function assertNoEntering(node: TestInstance): void {
      expect(node.props.entering).toBeUndefined();
      node.children.forEach((child) => {
        if (typeof child !== 'string') assertNoEntering(child);
      });
    }
    assertNoEntering(root);
  });

  it('con reduce motion nace final sin temporizadores y sus descendientes son visibles', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    const view = await renderHero(<Text>montaje del proveedor</Text>);
    mockWithTiming.mockClear();
    jest.mocked(withDelay).mockClear();
    await view.rerender(<PetHeroHeader pet={makePet()}><Text testID="reduced-child">selector</Text></PetHeroHeader>);
    expect(mockWithTiming).not.toHaveBeenCalled();
    expect(jest.mocked(withDelay)).not.toHaveBeenCalled();
    expect(StyleSheet.flatten(screen.getByTestId('pet-hero-slot').props.style)).toEqual({ top: 52, opacity: 1, transform: [{ translateY: 0 }] });
    expect(StyleSheet.flatten(screen.getByTestId('pet-hero-caption').props.style)).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
    expect(screen.getByTestId('pet-hero-photo')).toHaveAnimatedStyle({ opacity: 1 }, { shouldMatchAllProps: true });
    for (const id of ['pet-hero-slot', 'pet-hero-caption', 'pet-hero-media', 'reduced-child', 'pet-hero-name']) {
      expect(screen.getByTestId(id)).toBeVisible();
    }
  });
});
