export interface PetWeightProps {
  id: string;
  petId: string;
  weightKg: number;
  measuredAt: string;
  bodyCondition: number | null;
}

export class PetWeight implements PetWeightProps {
  readonly id: string;
  readonly petId: string;
  readonly weightKg: number;
  readonly measuredAt: string;
  readonly bodyCondition: number | null;

  constructor(props: PetWeightProps) {
    Object.assign(this, props);
  }
}
