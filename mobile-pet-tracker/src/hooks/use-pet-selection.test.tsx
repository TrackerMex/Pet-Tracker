import { renderHook } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';

import type { PetsState } from '../api/pets';
import type { PetProfile } from '../api/types';
import {
  useSelectedPet,
  type SelectedPetContextValue,
} from '../providers/selected-pet-provider';
import type { ApiResult } from './use-api';
import { usePetSelection } from './use-pet-selection';

jest.mock('expo-router', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('../providers/selected-pet-provider', () => ({
  useSelectedPet: jest.fn(),
}));

const mockUseIsFocused = jest.mocked(useIsFocused);
const mockUseSelectedPet = jest.mocked(useSelectedPet);
const mockSelectPet = jest.fn();

function makePet(id: string): PetProfile {
  return { id } as PetProfile;
}

function petsResult(
  pets: PetProfile[],
  isRefreshing = false,
): ApiResult<PetsState> {
  return {
    data: { kind: 'ok', pets },
    isRefreshing,
    refetch: jest.fn(),
  };
}

describe('R10: usePetSelection respeta el foco y la revalidación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockUseSelectedPet.mockReturnValue({
      selectedPetId: 'pet-new',
      selectPet: mockSelectPet,
    } satisfies SelectedPetContextValue);
  });

  it('no pisa la selección desde una pantalla desenfocada con lista stale', async () => {
    mockUseIsFocused.mockReturnValue(false);

    await renderHook(() => usePetSelection(petsResult([makePet('pet-old')])));

    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('no pisa la selección mientras la pantalla enfocada revalida', async () => {
    await renderHook(() =>
      usePetSelection(petsResult([makePet('pet-old')], true)),
    );

    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('selecciona el primer pet cuando la selección no existe en la lista enfocada', async () => {
    await renderHook(() => usePetSelection(petsResult([makePet('pet-old')])));

    expect(mockSelectPet).toHaveBeenCalledTimes(1);
    expect(mockSelectPet).toHaveBeenCalledWith('pet-old');
  });

  it('conserva la selección cuando existe en la lista enfocada', async () => {
    await renderHook(() =>
      usePetSelection(
        petsResult([makePet('pet-old'), makePet('pet-new')]),
      ),
    );

    expect(mockSelectPet).not.toHaveBeenCalled();
  });
});
