export interface MealServingProps {
  id: string;
  petId: string;
  servedOn: string;
  mealTime: string;
  servedAt: Date;
  createdBy: string;
}

export class MealServing implements MealServingProps {
  readonly id: string;
  readonly petId: string;
  readonly servedOn: string;
  readonly mealTime: string;
  readonly servedAt: Date;
  readonly createdBy: string;

  constructor(props: MealServingProps) {
    Object.assign(this, props);
  }
}

/** D4: franjas del plan vigente ya servidas, en el orden del plan. */
export function servedInPlan(mealTimes: string[], served: string[]): string[] {
  return mealTimes.filter((mealTime) => served.includes(mealTime));
}

/**
 * #104 D2: cada franja vale merKcal / mealsPerDay; se redondea una sola vez
 * el agregado, así todas servidas = merKcal exacto.
 */
export function kcalConsumed(
  merKcal: number,
  mealsPerDay: number,
  servedCount: number,
): number {
  return Math.round((merKcal * servedCount) / mealsPerDay);
}
