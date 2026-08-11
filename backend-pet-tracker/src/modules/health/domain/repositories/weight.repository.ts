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
  listByPet(petId: string, limit: number): Promise<PetWeight[]>;
  findPrevious(
    petId: string,
    measuredAt: string,
    id: string,
  ): Promise<PetWeight | null>;
}
