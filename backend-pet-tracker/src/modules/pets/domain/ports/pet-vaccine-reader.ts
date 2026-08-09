export const PET_VACCINE_READER = Symbol('PetVaccineReader');

export interface NextPetVaccine {
  id: string;
  name: string;
  nextDoseAt: string;
}

export interface PetVaccineReader {
  findNextVaccine(petId: string, after: string): Promise<NextPetVaccine | null>;
}
