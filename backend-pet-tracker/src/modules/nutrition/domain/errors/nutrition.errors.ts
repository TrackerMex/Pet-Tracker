export class NutritionProfileNotFoundError extends Error {
  constructor(petId: string) {
    super(`Nutrition profile for pet ${petId} not found`);
    this.name = 'NutritionProfileNotFoundError';
  }
}
