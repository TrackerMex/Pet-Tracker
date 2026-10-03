export const PET_MEALS_READER = Symbol('PetMealsReader');

export interface PetMealsToday {
  served: number;
  total: number;
}

export interface PetMealsReader {
  /** `day` es el dia civil del owner; null si no existe plan. */
  findMealsToday(petId: string, day: string): Promise<PetMealsToday | null>;
}
