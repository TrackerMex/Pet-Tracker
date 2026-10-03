export const PET_VACCINE_READER = Symbol('PetVaccineReader');

export interface NextPetVaccine {
  id: string;
  name: string;
  nextDoseAt: string;
}

export interface PetVaccineReader {
  /** `from` es el primer dia civil incluido. */
  findNextVaccine(petId: string, from: string): Promise<NextPetVaccine | null>;
}
