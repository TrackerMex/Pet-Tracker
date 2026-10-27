import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { PetProfile } from '../../api/types';
import { TabPetHeader, TAB_PET_HEADER_HEIGHT, TAB_PET_HEADER_SCROLL_MIN } from '../tab-pet-header';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
const { readFileSync } = require('fs');

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


const pets = [makePet(), makePet({ id: 'pet-2', name: 'Milo' })];

describe('#222 R1: Componente TabPetHeader', () => {
  it('#222 R1: con cero mascotas no pinta nada', async () => {
    await render(<TabPetHeader testID="x-header" pets={[]} selectedPetId={null} onSelect={jest.fn()} horizontalInset={24} />);
    expect(screen.queryByTestId('x-header')).toBeNull();
  });

  it('#222 R1: con mascotas pinta la raíz con la receta de vidrio plano y sus rellenos', async () => {
    await render(<HeroUINativeProvider><TabPetHeader testID="x-header" pets={pets} selectedPetId="pet-1" onSelect={jest.fn()} horizontalInset={24} /></HeroUINativeProvider>);
    const root = screen.getByTestId('x-header');
    expect(root.props.className).toBe('absolute inset-x-0 top-0 border-b border-border bg-glass-surface-strong');
    expect(root.props.style).toEqual({ paddingTop: 47, paddingBottom: 7 });
  });

  it('#222 R1: TAB_PET_HEADER_HEIGHT suma 7 + 50 + 7 + 1', () => {
    expect(TAB_PET_HEADER_HEIGHT).toBe(65);
    expect(TAB_PET_HEADER_SCROLL_MIN).toBe(7);
  });

  it('#222 R1: monta el selector avatars con edgeInset = horizontalInset - 5', async () => {
    const onSelect = jest.fn();
    const app = await render(<HeroUINativeProvider><TabPetHeader testID="x-header" pets={pets} selectedPetId="pet-1" onSelect={onSelect} horizontalInset={24} /></HeroUINativeProvider>);
    expect(screen.getByTestId('x-header').children).toHaveLength(1);
    expect(screen.getByTestId('pet-switcher-scroll').props.contentContainerStyle).toEqual({ paddingHorizontal: 19 });
    expect(screen.getByTestId('pet-avatar-pet-1').props.className).toContain('size-10');
    expect(screen.getByTestId('pet-chip-pet-1').props.accessibilityState).toEqual({ selected: true });
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    expect(onSelect).toHaveBeenCalledWith('pet-2');
    await app.rerender(<HeroUINativeProvider><TabPetHeader testID="x-header" pets={pets} selectedPetId="pet-2" onSelect={onSelect} horizontalInset={20} /></HeroUINativeProvider>);
    expect(screen.getByTestId('pet-switcher-scroll').props.contentContainerStyle).toEqual({ paddingHorizontal: 15 });
  });

  it('#222 R1: pasa scrollHint al selector', async () => {
    const app = await render(<HeroUINativeProvider><TabPetHeader testID="x-header" pets={pets} selectedPetId="pet-1" onSelect={jest.fn()} horizontalInset={24} scrollHint="pista recibida" /></HeroUINativeProvider>);
    expect(screen.getByTestId('pet-switcher-scroll').props.accessibilityLabel).toBe('pista recibida');
    await app.rerender(<HeroUINativeProvider><TabPetHeader testID="x-header" pets={pets} selectedPetId="pet-1" onSelect={jest.fn()} horizontalInset={24} /></HeroUINativeProvider>);
    expect(screen.getByTestId('pet-switcher-scroll').props.accessibilityLabel).toBeUndefined();
  });

  it('#222 R1: no importa expo-blur ni llama a t()', () => {
    const source = readFileSync('src/components/tab-pet-header.tsx', 'utf8');
    expect(source).not.toContain(['expo', 'blur'].join('-'));
    expect(source).not.toContain(['Style', 'Sheet'].join(''));
    expect(source).not.toMatch(/\bt\(/);
    expect(source).not.toContain('useTranslate');
  });
});

