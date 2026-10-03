CREATE TABLE "meal_servings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"served_on" date NOT NULL,
	"meal_time" varchar(5) NOT NULL,
	"served_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "meal_servings" ADD CONSTRAINT "meal_servings_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_servings" ADD CONSTRAINT "meal_servings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meal_servings_pet_id_served_on_meal_time_idx" ON "meal_servings" USING btree ("pet_id","served_on","meal_time");--> statement-breakpoint
CREATE INDEX "meal_servings_created_by_idx" ON "meal_servings" USING btree ("created_by");