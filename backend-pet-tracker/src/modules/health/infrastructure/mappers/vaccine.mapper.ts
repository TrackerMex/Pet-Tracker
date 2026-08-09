import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';

export interface VaccineResponse {
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

export function toVaccineResponse(vaccine: PetVaccine): VaccineResponse {
  return {
    id: vaccine.id,
    petId: vaccine.petId,
    catalogId: vaccine.catalogId,
    name: vaccine.name,
    appliedAt: vaccine.appliedAt,
    nextDoseAt: vaccine.nextDoseAt,
    vetName: vaccine.vetName,
    clinic: vaccine.clinic,
    notes: vaccine.notes,
    documentKey: vaccine.documentKey,
  };
}
