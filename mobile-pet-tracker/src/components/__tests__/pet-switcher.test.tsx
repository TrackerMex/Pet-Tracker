import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { ScrollView, StyleSheet, Text } from 'react-native';

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


describe('#195 R9: avatar seleccionado y punto en línea', () => {
  afterEach(() => cleanup());

  it.each([null, 'http://example.test/luna.jpg'])('el seleccionado usa avatar 36 con foto %s y un aro de 44', async (photoUrl) => {
    await render(<HeroUINativeProvider><PetSwitcher pets={[makePet({ photoUrl }), makePet({ id: 'pet-2' })]} selectedPetId="pet-1" onSelect={jest.fn()} variant="glass" /></HeroUINativeProvider>);
    const chip = screen.getByTestId('pet-chip-pet-1');
    expect(chip.props.className).toBe('size-11 rounded-full border-2 border-accent bg-background p-0.5');
    expect(chip.props.accessibilityLabel).toBe('Luna');
    expect(chip.props.accessibilityRole).toBe('button');
    expect(chip.props.accessibilityState).toEqual({ selected: true });
    expect(chip.children).toHaveLength(1);
    const wrapper = chip.children[0];
    if (typeof wrapper === 'string') throw new Error('avatar wrapper missing');
    expect(wrapper.props.className).toBe('size-9 overflow-hidden rounded-full');
    expect(wrapper.children).toHaveLength(1);
    const avatar = within(wrapper).getByTestId(`pet-avatar-${photoUrl ? 'image' : 'fallback'}-pet-1`);
    if (photoUrl) {
      expect(StyleSheet.flatten(avatar.props.style)).toEqual({ width: 36, height: 36, borderRadius: 18 });
      expect(avatar.props.source).toEqual([{ uri: photoUrl, cacheKey: 'pet-1' }]);
    } else {
      expect(avatar.props.width).toBe(36);
      expect(avatar.props.height).toBe(36);
      expect(avatar.props.xml).toContain('<svg');
    }
  });

  it.each([undefined, false, true])('solo el seleccionado tiene punto cuando selectedOnline es %s', async (selectedOnline) => {
    await render(<HeroUINativeProvider><PetSwitcher pets={[makePet(), makePet({ id: 'pet-2' })]} selectedPetId="pet-1" onSelect={jest.fn()} variant="glass" selectedOnline={selectedOnline} /></HeroUINativeProvider>);
    const selected = screen.getByTestId('pet-chip-pet-1');
    const other = screen.getByTestId('pet-chip-pet-2');
    expect(selected.children).toHaveLength(selectedOnline ? 2 : 1);
    if (selectedOnline) {
      const dot = within(selected).getByTestId('pet-chip-online-pet-1');
      expect(dot.props.className).toBe('absolute -bottom-0.75 -right-0.75 size-3.5 rounded-full border-2 border-background bg-accent');
      expect(selected.children[1]).toBe(dot);
    } else expect(within(selected).queryByTestId('pet-chip-online-pet-1')).toBeNull();
    expect(within(other).queryByTestId('pet-chip-online-pet-2')).toBeNull();
    expect(other.children).toHaveLength(1);
    expect(other.props.accessibilityState).toEqual({ selected: false });
  });
});


describe('#195 R10: fila de vidrio con acción al final', () => {
  it('conserva orden, cardinalidad, iniciales y selección desde ambos chips', async () => {
    const onSelect = jest.fn();
    const pets = [makePet(), makePet({ id: 'pet-2', name: 'milo', photoUrl: 'http://example.test/milo.jpg' })];
    await render(<HeroUINativeProvider><PetSwitcher pets={pets} selectedPetId="pet-1" onSelect={onSelect} variant="glass" trailing={<Text testID="trailing">+</Text>} /></HeroUINativeProvider>);
    const first = screen.getByTestId('pet-chip-pet-1');
    const second = screen.getByTestId('pet-chip-pet-2');
    const trailing = screen.getByTestId('trailing');
    const row = first.parent!;
    expect(row.props.className).toBe('flex-row items-center gap-2 p-1');
    expect(row.children).toEqual([first, second, trailing]);
    expect(row.children).toHaveLength(pets.length + 1);
    const scroll = screen.UNSAFE_getAllByType(ScrollView)[0];
    expect(scroll.props.horizontal).toBe(true);
    expect(scroll.props.showsHorizontalScrollIndicator).toBe(false);
    expect(scroll.props.className).toBe('-m-1');
    expect(second.props.className).toBe('size-11 items-center justify-center rounded-full bg-glass-surface-strong');
    expect(second.props.accessibilityLabel).toBe('milo');
    expect(second.props.accessibilityRole).toBe('button');
    expect(second.props.accessibilityState).toEqual({ selected: false });
    const letter = within(second).getByTestId('pet-avatar-fallback-pet-2');
    expect(second.children).toEqual([letter]);
    expect(letter).toHaveTextContent('M');
    expect(letter.props.className).toBe('text-base font-extrabold text-foreground');
    expect(within(second).queryByTestId('pet-avatar-image-pet-2')).toBeNull();
    await fireEvent.press(first);
    await fireEvent.press(second);
    expect(onSelect.mock.calls).toEqual([['pet-1'], ['pet-2']]);
  });

  it('sin trailing deja exactamente un hijo por mascota', async () => {
    await render(<HeroUINativeProvider><PetSwitcher pets={[makePet()]} selectedPetId="pet-1" onSelect={jest.fn()} variant="glass" /></HeroUINativeProvider>);
    const chip = screen.getByTestId('pet-chip-pet-1');
    expect(chip.parent!.children).toEqual([chip]);
  });
});
