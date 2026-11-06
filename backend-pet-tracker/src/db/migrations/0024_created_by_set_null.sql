ALTER TABLE "pet_vaccines" DROP CONSTRAINT "pet_vaccines_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "weights" DROP CONSTRAINT "weights_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_documents" DROP CONSTRAINT "pet_documents_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "meal_servings" DROP CONSTRAINT "meal_servings_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_vaccines" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "weights" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet_documents" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meal_servings" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reminders" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weights" ADD CONSTRAINT "weights_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_documents" ADD CONSTRAINT "pet_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_servings" ADD CONSTRAINT "meal_servings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;