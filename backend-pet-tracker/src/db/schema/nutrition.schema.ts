import { sql } from 'drizzle-orm';
import {
  char,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { NutritionWarning } from '@/modules/nutrition/domain/nutrition-engine';
import { pets } from './pets.schema';

export const nutritionProfiles = pgTable(
  'nutrition_profiles',
  {
    petId: uuid('pet_id')
      .primaryKey()
      .references(() => pets.id, { onDelete: 'cascade' }),
    activityLevel: varchar('activity_level', { length: 10 })
      .$type<'low' | 'medium' | 'high'>()
      .notNull(),
    bodyCondition: integer('body_condition'),
    targetWeightKg: numeric('target_weight_kg', { precision: 5, scale: 2 }),
    foodType: varchar('food_type', { length: 10 })
      .$type<'dry' | 'wet' | 'mixed' | 'homemade'>()
      .notNull(),
    kcalPer100g: numeric('kcal_per_100g', {
      precision: 6,
      scale: 1,
    }).notNull(),
    allergies: jsonb('allergies')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    diseases: jsonb('diseases')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'nutrition_profiles_activity_level_check',
      sql`${table.activityLevel} in ('low', 'medium', 'high')`,
    ),
    check(
      'nutrition_profiles_body_condition_check',
      sql`${table.bodyCondition} between 1 and 9`,
    ),
    check(
      'nutrition_profiles_food_type_check',
      sql`${table.foodType} in ('dry', 'wet', 'mixed', 'homemade')`,
    ),
    check(
      'nutrition_profiles_kcal_per_100g_check',
      sql`${table.kcalPer100g} between 80 and 600`,
    ),
  ],
);

export const nutritionPlans = pgTable(
  'nutrition_plans',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    rerKcal: integer('rer_kcal').notNull(),
    merKcal: integer('mer_kcal').notNull(),
    dailyGrams: integer('daily_grams').notNull(),
    mealsPerDay: integer('meals_per_day').notNull(),
    mealTimes: jsonb('meal_times').$type<string[]>().notNull(),
    objective: varchar('objective', { length: 20 })
      .$type<'maintenance' | 'weight_loss' | 'growth'>()
      .notNull(),
    warnings: jsonb('warnings')
      .$type<NutritionWarning[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    aiExplanation: text('ai_explanation'),
    inputsHash: char('inputs_hash', { length: 64 }).notNull(),
    generatedAt: timestamp('generated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'nutrition_plans_meals_per_day_check',
      sql`${table.mealsPerDay} between 1 and 6`,
    ),
    check(
      'nutrition_plans_objective_check',
      sql`${table.objective} in ('maintenance', 'weight_loss', 'growth')`,
    ),
    index('nutrition_plans_pet_id_generated_at_idx').on(
      table.petId,
      table.generatedAt.desc(),
    ),
  ],
);
