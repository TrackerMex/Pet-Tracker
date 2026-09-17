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

export class NutritionPlanRequiredError extends Error {
  constructor(petId: string) {
    super(`Nutrition plan for pet ${petId} is required`);
    this.name = 'NutritionPlanRequiredError';
  }
}

export class MealTimeNotInPlanError extends Error {
  constructor(petId: string, mealTime: string) {
    super(`Meal time ${mealTime} is not in the current plan for pet ${petId}`);
    this.name = 'MealTimeNotInPlanError';
  }
}

export class MealAlreadyServedError extends Error {
  constructor(petId: string, servedOn: string, mealTime: string) {
    super(
      `Meal ${mealTime} for pet ${petId} was already served on ${servedOn}`,
    );
    this.name = 'MealAlreadyServedError';
  }
}

export class MealServingNotFoundError extends Error {
  constructor(petId: string, servedOn: string, mealTime: string) {
    super(`Meal ${mealTime} for pet ${petId} was not served on ${servedOn}`);
    this.name = 'MealServingNotFoundError';
  }
}
