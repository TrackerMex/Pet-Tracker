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
