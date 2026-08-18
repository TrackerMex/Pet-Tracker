export class NutritionProfileNotFoundError extends Error {
  constructor(petId: string) {
    super(`Nutrition profile for pet ${petId} not found`);
    this.name = 'NutritionProfileNotFoundError';
  }
}

export class NutritionProfileRequiredError extends Error {
  constructor(petId: string) {
    super(`Nutrition profile for pet ${petId} is required`);
    this.name = 'NutritionProfileRequiredError';
  }
}

export class NutritionPlanNotFoundError extends Error {
  constructor(petId: string) {
    super(`Nutrition plan for pet ${petId} not found`);
    this.name = 'NutritionPlanNotFoundError';
  }
}

export class PetWeightRequiredError extends Error {
  constructor(petId: string) {
    super(`Current weight for pet ${petId} is required`);
    this.name = 'PetWeightRequiredError';
  }
}
