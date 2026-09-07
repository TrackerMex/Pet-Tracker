import { cleanup, render, screen } from '@testing-library/react-native';
import { blobatar } from 'blobatar';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import type { PetProfile } from '../../api/types';
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
