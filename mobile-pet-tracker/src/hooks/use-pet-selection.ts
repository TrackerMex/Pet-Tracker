import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import type { PetsState } from '../api/pets';
import { useSelectedPet } from '../providers/selected-pet-provider';
import type { ApiResult } from './use-api';

export function usePetSelection(pets: ApiResult<PetsState>): void {
  const isFocused = useIsFocused();
  const { selectedPetId, selectPet } = useSelectedPet();

  useEffect(() => {
    if (!isFocused) return;
    if (pets.isRefreshing) return;
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;

    const selectionExists = pets.data.pets.some(
      ({ id }) => id === selectedPetId,
    );
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [isFocused, pets.data, pets.isRefreshing, selectPet, selectedPetId]);
}
