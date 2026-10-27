import { UpsertNutritionProfileSchema } from './nutrition-profile.dto';

describe('R1 (nutrition-ai-structured-plan #212): cotas del perfil', () => {
  const base = {
    activityLevel: 'medium',
    foodType: 'dry',
    kcalPer100g: 350,
  };

  it('R1: rechaza allergies con 21 elementos', () => {
    expect(
      UpsertNutritionProfileSchema.safeParse({
        ...base,
        allergies: Array<string>(21).fill('pollo'),
      }).success,
    ).toBe(false);
  });

  it('R1: rechaza diseases con 21 elementos', () => {
    expect(
      UpsertNutritionProfileSchema.safeParse({
        ...base,
        diseases: Array<string>(21).fill('renal'),
      }).success,
    ).toBe(false);
  });

  it('R1: rechaza un elemento de allergies de 101 caracteres', () => {
    expect(
      UpsertNutritionProfileSchema.safeParse({
        ...base,
        allergies: ['a'.repeat(101)],
      }).success,
    ).toBe(false);
  });

  it('R1: rechaza un elemento de diseases de 101 caracteres', () => {
    expect(
      UpsertNutritionProfileSchema.safeParse({
        ...base,
        diseases: ['a'.repeat(101)],
      }).success,
    ).toBe(false);
  });

  it('R1: acepta 20 elementos de 100 caracteres en ambos campos', () => {
    expect(
      UpsertNutritionProfileSchema.safeParse({
        ...base,
        allergies: Array<string>(20).fill('a'.repeat(100)),
        diseases: Array<string>(20).fill('a'.repeat(100)),
      }).success,
    ).toBe(true);
  });
});
