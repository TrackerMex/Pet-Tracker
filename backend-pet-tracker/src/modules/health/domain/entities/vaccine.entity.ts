export type VaccineSpecies = 'dog' | 'cat';

export interface VaccineScheme {
  firstDoseMonths: number;
  series?: number[];
  boosterMonths: number;
}

export interface VaccineCatalogEntry {
  id: string;
  species: VaccineSpecies;
  name: string;
  scheme: VaccineScheme;
}

export interface PetVaccineProps {
  id: string;
  petId: string;
  catalogId: string | null;
  name: string;
  appliedAt: string;
  nextDoseAt: string | null;
  vetName: string | null;
  clinic: string | null;
  notes: string | null;
  documentKey: string | null;
}

export class PetVaccine implements PetVaccineProps {
  readonly id: string;
  readonly petId: string;
  readonly catalogId: string | null;
  readonly name: string;
  readonly appliedAt: string;
  readonly nextDoseAt: string | null;
  readonly vetName: string | null;
  readonly clinic: string | null;
  readonly notes: string | null;
  readonly documentKey: string | null;

  constructor(props: PetVaccineProps) {
    Object.assign(this, props);
  }
}
