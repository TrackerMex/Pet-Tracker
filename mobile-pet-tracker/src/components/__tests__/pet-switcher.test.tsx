import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { PetProfile } from '../../api/types';
import { PetSwitcher } from '../pet-switcher';

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

describe('R11: pet switcher usa Avatar para cambiar de mascota', () => {
  it('renders avatar-only controls with accessible names, selection, and stable testIDs', async () => {
    const onSelect = jest.fn();
    const photoUrl = 'http://example.test/luna.jpg';
    const pets = [
      makePet({ photoUrl }),
      makePet({ id: 'pet-2', name: 'Milo' }),
    ];

    await render(
      <HeroUINativeProvider>
        <PetSwitcher
          pets={pets}
          selectedPetId="pet-1"
          onSelect={onSelect}
        />
      </HeroUINativeProvider>,
    );

    expect(screen.getAllByTestId(/^pet-chip-/).map(({ props }) => props.testID)).toEqual([
      'pet-chip-pet-1',
      'pet-chip-pet-2',
    ]);
    expect(screen.getByTestId('pet-avatar-image-pet-1')).toHaveProp('source', {
      uri: photoUrl,
    });
    expect(screen.queryByTestId('pet-avatar-image-pet-2')).toBeNull();
    expect(screen.getByTestId('pet-avatar-fallback-pet-2')).toHaveTextContent('M');
    expect(screen.queryByText('Luna')).toBeNull();
    expect(screen.queryByText('Milo')).toBeNull();
    expect(screen.getByTestId('pet-chip-pet-1')).toHaveProp(
      'accessibilityLabel',
      'Luna',
    );
    expect(screen.getByTestId('pet-chip-pet-2')).toHaveProp(
      'accessibilityLabel',
      'Milo',
    );
    expect(screen.getByTestId('pet-chip-pet-1')).toHaveProp(
      'accessibilityRole',
      'button',
    );
    expect(screen.getByTestId('pet-chip-pet-1').props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({
      selected: false,
    });
    expect(screen.getByTestId('pet-chip-pet-1')).toHaveProp(
      'className',
      expect.stringContaining('border-accent'),
    );

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('pet-2');
  });
});

describe('#173 R4: variante avatars', () => {
  async function renderAvatars(pets: PetProfile[], onSelect = jest.fn()) {
    await render(
      <HeroUINativeProvider>
        <PetSwitcher pets={pets} selectedPetId="pet-1" onSelect={onSelect} variant="avatars" />
      </HeroUINativeProvider>,
    );
  }

  it('reparte los cinco colores y vuelve a ámbar en la sexta mascota', async () => {
    const pets = Array.from({ length: 6 }, (_, index) =>
      makePet({ id: `pet-${index + 1}`, name: `Pet ${index + 1}` }),
    );
    await renderAvatars(pets);

    const surfaces = [
      'bg-category-amber', 'bg-category-violet', 'bg-category-blue',
      'bg-category-green', 'bg-category-rose', 'bg-category-amber',
    ];
    const first = screen.getByTestId('pet-chip-pet-1');
    expect(first.parent!.props.className).toBe('flex-row gap-1.5');
    expect(first.parent!.children).toHaveLength(6);
    pets.forEach((pet, index) => {
      const chip = screen.getByTestId(`pet-chip-${pet.id}`);
      expect(chip.props.className).toBe(index === 0
        ? 'rounded-full border-2 border-accent p-0.75'
        : 'rounded-full border-2 border-transparent p-0.75');
      expect(chip.props.accessibilityLabel).toBe(pet.name);
      expect(chip.props.accessibilityRole).toBe('button');
      expect(chip.props.accessibilityState).toEqual({ selected: index === 0 });
      expect(screen.getByTestId(`pet-avatar-${pet.id}`).props.className).toBe(
        `size-10 items-center justify-center overflow-hidden rounded-full ${surfaces[index]}`,
      );
    });
  });

  it('con una mascota deja un único chip y el avatar ámbar', async () => {
    await renderAvatars([makePet()]);

    const chip = screen.getByTestId('pet-chip-pet-1');
    expect(chip.parent!.children).toHaveLength(1);
    expect(chip.parent!.children[0]).toBe(chip);
    expect(screen.getByTestId('pet-avatar-pet-1').props.className).toBe(
      'size-10 items-center justify-center overflow-hidden rounded-full bg-category-amber',
    );
  });

  it('elige foto o inicial, y la inicial usa ExtraBold y tinta de su hueco', async () => {
    await renderAvatars([
      makePet({ name: 'luna', photoUrl: null }),
      makePet({ id: 'pet-2', photoUrl: 'http://example.test/milo.jpg' }),
    ]);

    const fallback = screen.getByTestId('pet-avatar-fallback-pet-1');
    expect(fallback).toHaveTextContent('L');
    expect(fallback.props.className).toBe('text-sm font-extrabold text-category-amber-strong');
    expect(screen.queryByTestId('pet-avatar-image-pet-1')).toBeNull();
    expect(screen.getByTestId('pet-avatar-image-pet-2')).toBeVisible();
    expect(screen.queryByTestId('pet-avatar-fallback-pet-2')).toBeNull();
  });

  it('#184 R3: la foto usa size 40 y la cacheKey de cada mascota', async () => {
    await renderAvatars([
      makePet({ id: 'pet-1', name: 'Luna', photoUrl: 'http://example.test/luna.jpg' }),
      makePet({ id: 'pet-2', name: 'Milo', photoUrl: 'http://example.test/milo.jpg' }),
    ]);

    expect(screen.getByTestId('pet-avatar-image-pet-1').props.source).toEqual([
      { uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' },
    ]);
    expect(screen.getByTestId('pet-avatar-image-pet-2').props.source).toEqual([
      { uri: 'http://example.test/milo.jpg', cacheKey: 'pet-2' },
    ]);
    expect(screen.getByTestId('pet-avatar-image-pet-1').props.style).toEqual({ width: 40, height: 40, borderRadius: 20 });
    expect(screen.getByTestId('pet-avatar-image-pet-2').props.style).toEqual({ width: 40, height: 40, borderRadius: 20 });
  });

  it('cada chip tiene un avatar y cada avatar un único hijo', async () => {
    const pets = [makePet(), makePet({ id: 'pet-2', photoUrl: 'http://example.test/milo.jpg' })];
    await renderAvatars(pets);

    for (const pet of pets) {
      const chip = screen.getByTestId(`pet-chip-${pet.id}`);
      const avatar = screen.getByTestId(`pet-avatar-${pet.id}`);
      expect(chip.children).toHaveLength(1);
      expect(chip.children[0]).toBe(avatar);
      expect(avatar.children).toHaveLength(1);
    }
  });

  it('pulsar la segunda mascota llama a onSelect con su id', async () => {
    const onSelect = jest.fn();
    await renderAvatars([makePet(), makePet({ id: 'pet-2' })], onSelect);

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('pet-2');
  });

  it('sin variante conserva el chip anterior y no monta el avatar nuevo', async () => {
    await render(
      <HeroUINativeProvider>
        <PetSwitcher pets={[makePet()]} selectedPetId="pet-1" onSelect={jest.fn()} />
      </HeroUINativeProvider>,
    );

    expect(screen.queryByTestId('pet-avatar-pet-1')).toBeNull();
    expect(screen.getByTestId('pet-chip-pet-1').props.className).toContain('bg-accent-soft p-1');
  });
});
