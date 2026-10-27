CREATE TABLE "nutrition_ai_generations" (
	"pet_id" uuid NOT NULL,
	"local_day" date NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT "nutrition_ai_generations_pet_id_local_day_pk" PRIMARY KEY("pet_id","local_day"),
	CONSTRAINT "nutrition_ai_generations_count_check" CHECK ("nutrition_ai_generations"."count" > 0)
);
--> statement-breakpoint
ALTER TABLE "nutrition_plans" ADD COLUMN "ai_proposal" jsonb;--> statement-breakpoint
ALTER TABLE "nutrition_ai_generations" ADD CONSTRAINT "nutrition_ai_generations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;