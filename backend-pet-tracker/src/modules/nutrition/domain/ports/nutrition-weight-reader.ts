export const NUTRITION_WEIGHT_READER = Symbol('NutritionWeightReader');

export interface NutritionWeightPoint {
  measuredAt: string;
  weightKg: number;
}

export interface NutritionWeightReader {
  /** Los `limit` pesos más recientes, del más antiguo al más reciente. */
  listRecent(petId: string, limit: number): Promise<NutritionWeightPoint[]>;
}
