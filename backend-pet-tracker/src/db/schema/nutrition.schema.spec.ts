import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { nutritionPlans, nutritionProfiles } from './nutrition.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function findNutritionMigration(): { file: string; sql: string } {
  const file = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .find((name) =>
      readFileSync(join(MIGRATIONS_DIR, name), 'utf8').includes(
        'CREATE TABLE "nutrition_profiles"',
      ),
    );

  if (!file) throw new Error('Nutrition migration not found');
  return { file, sql: readFileSync(join(MIGRATIONS_DIR, file), 'utf8') };
}

describe('R15 (nutrition-profile-engine #17): tablas de nutricion y migracion 0013 nueva', () => {
  it('declara nutrition_profiles con tipos, nulabilidad, checks y cascade', () => {
    const config = getTableConfig(nutritionProfiles);
    const columns = new Map(
      config.columns.map((column) => [column.name, column]),
    );

    expect([...columns.keys()].sort()).toEqual(
      [
        'pet_id',
        'activity_level',
        'body_condition',
        'target_weight_kg',
        'food_type',
        'kcal_per_100g',
        'allergies',
        'diseases',
        'created_at',
        'updated_at',
      ].sort(),
    );
    expect(columns.get('pet_id')?.primary).toBe(true);
    expect(columns.get('activity_level')?.getSQLType()).toBe('varchar(10)');
    expect(columns.get('body_condition')?.notNull).toBe(false);
    expect(columns.get('target_weight_kg')?.getSQLType()).toBe('numeric(5, 2)');
    expect(columns.get('food_type')?.getSQLType()).toBe('varchar(10)');
    expect(columns.get('kcal_per_100g')?.getSQLType()).toBe('numeric(6, 1)');
    expect(columns.get('kcal_per_100g')?.notNull).toBe(true);
    expect(columns.get('allergies')?.notNull).toBe(true);
    expect(columns.get('diseases')?.notNull).toBe(true);
    expect(columns.get('created_at')?.notNull).toBe(true);
    expect(columns.get('updated_at')?.notNull).toBe(true);
    expect(config.checks.map((item) => item.name)).toEqual(
      expect.arrayContaining([
        'nutrition_profiles_activity_level_check',
        'nutrition_profiles_body_condition_check',
        'nutrition_profiles_food_type_check',
        'nutrition_profiles_kcal_per_100g_check',
      ]),
    );
    const petForeignKey = config.foreignKeys.find(
      (foreignKey) => foreignKey.reference().columns[0].name === 'pet_id',
    );
    expect(petForeignKey?.onDelete).toBe('cascade');
    expect(config.indexes).toHaveLength(0);
  });

  it('declara nutrition_plans con historial, checks, cascade e indice', () => {
    const config = getTableConfig(nutritionPlans);
    const columns = new Map(
      config.columns.map((column) => [column.name, column]),
    );

    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'pet_id',
        'rer_kcal',
        'mer_kcal',
        'daily_grams',
        'meals_per_day',
        'meal_times',
        'objective',
        'warnings',
        'ai_explanation',
        'inputs_hash',
        'generated_at',
      ].sort(),
    );
    expect(columns.get('id')?.primary).toBe(true);
    expect(columns.get('ai_explanation')?.notNull).toBe(false);
    expect(columns.get('inputs_hash')?.getSQLType()).toBe('char(64)');
    expect(columns.get('inputs_hash')?.notNull).toBe(true);
    expect(config.checks.map((item) => item.name)).toEqual(
      expect.arrayContaining([
        'nutrition_plans_meals_per_day_check',
        'nutrition_plans_objective_check',
      ]),
    );
    const petForeignKey = config.foreignKeys.find(
      (foreignKey) => foreignKey.reference().columns[0].name === 'pet_id',
    );
    expect(petForeignKey?.onDelete).toBe('cascade');
    expect(config.indexes.map((item) => item.config.name)).toContain(
      'nutrition_plans_pet_id_generated_at_idx',
    );
    expect(config.uniqueConstraints).toHaveLength(0);
  });

  it('usa 0013 nueva sin alterar pets ni weights', () => {
    const migration = findNutritionMigration();

    expect(migration.file).toMatch(/^0013_.*\.sql$/);
    expect(migration.sql).toContain('CREATE TABLE "nutrition_profiles"');
    expect(migration.sql).toContain('CREATE TABLE "nutrition_plans"');
    expect(migration.sql).not.toContain('ALTER TABLE "pets"');
    expect(migration.sql).not.toContain('ALTER TABLE "weights"');
    expect(migration.sql).not.toMatch(/UNIQUE\s*\(\s*"pet_id"\s*,\s*"inputs_hash"/i);
  });
});
