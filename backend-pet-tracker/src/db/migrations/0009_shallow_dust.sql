CREATE TABLE "pet_vaccines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"catalog_id" uuid,
	"name" varchar(120) NOT NULL,
	"applied_at" date NOT NULL,
	"next_dose_at" date,
	"vet_name" varchar(120),
	"clinic" varchar(120),
	"notes" text,
	"document_key" text,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vaccine_catalog" (
	"id" uuid PRIMARY KEY NOT NULL,
	"species" varchar(10) NOT NULL,
	"name" varchar(120) NOT NULL,
	"scheme" jsonb NOT NULL,
	CONSTRAINT "vaccine_catalog_species_check" CHECK ("vaccine_catalog"."species" in ('dog', 'cat'))
);
--> statement-breakpoint
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_catalog_id_vaccine_catalog_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."vaccine_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pet_vaccines_pet_id_applied_at_idx" ON "pet_vaccines" USING btree ("pet_id","applied_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "pet_vaccines_catalog_id_idx" ON "pet_vaccines" USING btree ("catalog_id");--> statement-breakpoint
CREATE INDEX "pet_vaccines_created_by_idx" ON "pet_vaccines" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "vaccine_catalog_species_name_idx" ON "vaccine_catalog" USING btree ("species","name");