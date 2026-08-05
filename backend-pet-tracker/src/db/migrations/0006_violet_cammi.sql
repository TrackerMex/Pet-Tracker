CREATE TABLE "geofences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" varchar(20) DEFAULT 'safe_circle' NOT NULL,
	"geometry" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"geofence_state" jsonb DEFAULT '{"state":"unknown","updatedAt":null}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "geofences_type_check" CHECK ("geofences"."type" in ('safe_circle'))
);
--> statement-breakpoint
ALTER TABLE "geofences" ADD CONSTRAINT "geofences_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "geofences_pet_id_name_idx" ON "geofences" USING btree ("pet_id","name");--> statement-breakpoint
CREATE INDEX "geofences_pet_id_idx" ON "geofences" USING btree ("pet_id");