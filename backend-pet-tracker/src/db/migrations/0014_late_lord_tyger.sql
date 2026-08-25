CREATE TABLE "pet_documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"type" varchar(40) NOT NULL,
	"name" varchar(120) NOT NULL,
	"date" date NOT NULL,
	"vet" varchar(120),
	"key" text NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pet_documents" ADD CONSTRAINT "pet_documents_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_documents" ADD CONSTRAINT "pet_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pet_documents_pet_id_idx" ON "pet_documents" USING btree ("pet_id");