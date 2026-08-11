CREATE TABLE "weights" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"weight_kg" numeric(5, 2) NOT NULL,
	"body_condition" integer,
	"measured_at" date NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "weights_body_condition_check" CHECK ("weights"."body_condition" between 1 and 9)
);
--> statement-breakpoint
ALTER TABLE "weights" ADD CONSTRAINT "weights_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weights" ADD CONSTRAINT "weights_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "weights_pet_id_measured_at_idx" ON "weights" USING btree ("pet_id","measured_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "weights_created_by_idx" ON "weights" USING btree ("created_by");