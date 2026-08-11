import { PetWeight } from '@/modules/health/domain/entities/weight.entity';

export const WEIGHT_REPOSITORY = Symbol('WeightRepository');

export interface NewPetWeight {
  petId: string;
  weightKg: number;
  measuredAt: string;
  bodyCondition: number | null;
  createdBy: string;
}

export interface WeightRepository {
  create(data: NewPetWeight): Promise<PetWeight>;
}
