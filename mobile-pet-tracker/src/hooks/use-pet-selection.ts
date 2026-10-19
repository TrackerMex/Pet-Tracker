import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import type { PetsState } from '../api/pets';
import { useSelectedPet } from '../providers/selected-pet-provider';

export interface PetSelectionSource {
  data: PetsState | undefined;
  isRefreshing: boolean;
}

export function usePetSelection(pets: PetSelectionSource): void {
  const isFocused = useIsFocused();
  const { selectedPetId, selectPet, clearPet } = useSelectedPet();

  useEffect(() => {
    if (!isFocused) return;
    if (pets.isRefreshing) return;
    if (pets.data?.kind !== 'ok') return;
    if (pets.data.pets.length === 0) {
      if (selectedPetId !== null) clearPet();
      return;
    }

    const selectionExists = pets.data.pets.some(
      ({ id }) => id === selectedPetId,
    );
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [clearPet, isFocused, pets.data, pets.isRefreshing, selectPet, selectedPetId]);
}
