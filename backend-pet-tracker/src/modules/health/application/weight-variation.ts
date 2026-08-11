import { PetWeightProps } from '@/modules/health/domain/entities/weight.entity';

export interface WeightEntry extends PetWeightProps {
  variation: number | null;
}
