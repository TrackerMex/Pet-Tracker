import {
  PetVaccine,
  VaccineCatalogEntry,
  VaccineSpecies,
} from '@/modules/health/domain/entities/vaccine.entity';

export const VACCINE_REPOSITORY = Symbol('VaccineRepository');

export interface NewPetVaccine {
  petId: string;
  catalogId: string | null;
  name: string;
  appliedAt: string;
  nextDoseAt: string | null;
  vetName: string | null;
  clinic: string | null;
  notes: string | null;
  documentKey: string | null;
  createdBy: string;
}

export type VaccineChanges = Partial<
  Pick<
    PetVaccine,
    'name' | 'appliedAt' | 'nextDoseAt' | 'vetName' | 'clinic' | 'notes'
  >
>;

export interface VaccineRepository {
  listCatalog(species: VaccineSpecies): Promise<VaccineCatalogEntry[]>;
  findCatalogById(id: string): Promise<VaccineCatalogEntry | null>;
  create(data: NewPetVaccine): Promise<PetVaccine>;
  listByPet(petId: string): Promise<PetVaccine[]>;
  findByIdAndPet(id: string, petId: string): Promise<PetVaccine | null>;
  update(id: string, changes: VaccineChanges): Promise<PetVaccine>;
  delete(id: string): Promise<void>;
}
