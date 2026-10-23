import { act, cleanup, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import type { PetProfile } from '../../api/types';
import { PetHeroHeader } from '../pet-hero-header';

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

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));
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

function HeroWrapper({ children }: { children: ReactNode }) {
  return <HeroUINativeProvider>{children}</HeroUINativeProvider>;
}

async function renderHero(element: ReactNode) {
  return render(<>{element}</>, { wrapper: HeroWrapper });
}

describe('#195 R14: movimiento real del hero', () => {
  beforeEach(() => { jest.useFakeTimers(); mockUseReducedMotion.mockReturnValue(false); });
  afterEach(() => { cleanup(); jest.useRealTimers(); });

  it('el slot sube en 400 ms y el pie espera 80 ms antes de subir', async () => {
    await renderHero(<PetHeroHeader pet={makePet()}><Text testID="motion-child">selector</Text></PetHeroHeader>);
    const slot = screen.getByTestId('pet-hero-slot');
    const caption = screen.getByTestId('pet-hero-caption');
    expect(StyleSheet.flatten(slot.props.style)).toEqual({ top: 52, opacity: 0, transform: [{ translateY: 14 }] });
    expect(getAnimatedStyle(slot)).toEqual({ top: 52, opacity: 0, transform: [{ translateY: 14 }] });
    expect(getAnimatedStyle(caption)).toEqual({ opacity: 0, transform: [{ translateY: 14 }] });
    for (const id of ['motion-child', 'pet-hero-name', 'pet-hero-media']) expect(screen.getByTestId(id)).toBeOnTheScreen();
    await act(async () => { jest.advanceTimersByTime(64); });
    const intermediate = getAnimatedStyle(slot) as { opacity: number; transform: { translateY: number }[] };
    expect(intermediate.opacity).toBeGreaterThan(0);
    expect(intermediate.opacity).toBeLessThan(1);
    expect(intermediate.transform[0].translateY).toBeGreaterThan(0);
    expect(intermediate.transform[0].translateY).toBeLessThan(14);
    expect(getAnimatedStyle(caption)).toEqual({ opacity: 0, transform: [{ translateY: 14 }] });
    await act(async () => { jest.advanceTimersByTime(352); });
    expect(getAnimatedStyle(slot)).toEqual({ top: 52, opacity: 1, transform: [{ translateY: 0 }] });
    await act(async () => { jest.advanceTimersByTime(80); });
    expect(getAnimatedStyle(caption)).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
    for (const id of ['motion-child', 'pet-hero-name', 'pet-hero-media']) expect(screen.getByTestId(id)).toBeOnTheScreen();
  });

  it('la foto empieza en cero y termina su fundido a los 516 ms', async () => {
    await renderHero(<PetHeroHeader pet={makePet()} />);
    const photo = screen.getByTestId('pet-hero-photo');
    expect(getAnimatedStyle(photo)).toEqual({ opacity: 0 });
    expect(screen.getByTestId('pet-hero-media')).toBeOnTheScreen();
    await act(async () => { jest.advanceTimersByTime(516); });
    expect(getAnimatedStyle(photo)).toEqual({ opacity: 1 });
    expect(screen.getByTestId('pet-hero-media')).toBeOnTheScreen();
  });
});
