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
import { Uniwind } from 'uniwind';

import type { PetProfile } from '../../api/types';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  PET_HERO_FADE_HEIGHT,
  PET_HERO_MEDIA_HEIGHT,
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

function readSource(...segments: string[]): string {
  return readFileSync(join(SOURCE_ROOT, ...segments), 'utf8');
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

      const spy = jest
        .spyOn(Uniwind, 'getCSSVariable')
        .mockImplementation((name: string) =>
          name === '--color-background' || name === '--background'
            ? token
            : undefined,
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
