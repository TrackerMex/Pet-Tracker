CREATE TABLE "alert_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"geofence_id" uuid,
	"type" varchar(20) NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"payload" jsonb NOT NULL,
	"opened_at" timestamp with time zone NOT NULL,
	"acked_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	CONSTRAINT "alert_events_type_check" CHECK ("alert_events"."type" in ('geofence_exit', 'battery_low')),
	CONSTRAINT "alert_events_status_check" CHECK ("alert_events"."status" in ('open', 'acked', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_geofence_id_geofences_id_fk" FOREIGN KEY ("geofence_id") REFERENCES "public"."geofences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alert_events_pet_id_idx" ON "alert_events" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "alert_events_geofence_id_idx" ON "alert_events" USING btree ("geofence_id");--> statement-breakpoint
CREATE UNIQUE INDEX "alert_events_open_anti_spam_idx" ON "alert_events" USING btree ("pet_id","type",coalesce("geofence_id", '00000000-0000-0000-0000-000000000000'::uuid)) WHERE "alert_events"."status" = 'open';