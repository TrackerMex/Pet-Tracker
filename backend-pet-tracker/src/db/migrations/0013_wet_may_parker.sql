CREATE TABLE "nutrition_plans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"rer_kcal" integer NOT NULL,
	"mer_kcal" integer NOT NULL,
	"daily_grams" integer NOT NULL,
	"meals_per_day" integer NOT NULL,
	"meal_times" jsonb NOT NULL,
	"objective" varchar(20) NOT NULL,
	"warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ai_explanation" text,
	"inputs_hash" char(64) NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutrition_plans_meals_per_day_check" CHECK ("nutrition_plans"."meals_per_day" between 1 and 6),
	CONSTRAINT "nutrition_plans_objective_check" CHECK ("nutrition_plans"."objective" in ('maintenance', 'weight_loss', 'growth'))
);
--> statement-breakpoint
CREATE TABLE "nutrition_profiles" (
	"pet_id" uuid PRIMARY KEY NOT NULL,
	"activity_level" varchar(10) NOT NULL,
	"body_condition" integer,
	"target_weight_kg" numeric(5, 2),
	"food_type" varchar(10) NOT NULL,
	"kcal_per_100g" numeric(6, 1) NOT NULL,
	"allergies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"diseases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutrition_profiles_activity_level_check" CHECK ("nutrition_profiles"."activity_level" in ('low', 'medium', 'high')),
	CONSTRAINT "nutrition_profiles_body_condition_check" CHECK ("nutrition_profiles"."body_condition" between 1 and 9),
	CONSTRAINT "nutrition_profiles_food_type_check" CHECK ("nutrition_profiles"."food_type" in ('dry', 'wet', 'mixed', 'homemade')),
	CONSTRAINT "nutrition_profiles_kcal_per_100g_check" CHECK ("nutrition_profiles"."kcal_per_100g" between 80 and 600)
);
--> statement-breakpoint
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_profiles" ADD CONSTRAINT "nutrition_profiles_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nutrition_plans_pet_id_generated_at_idx" ON "nutrition_plans" USING btree ("pet_id","generated_at" DESC NULLS LAST);