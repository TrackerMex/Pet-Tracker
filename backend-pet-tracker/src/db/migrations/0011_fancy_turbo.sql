CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"title" varchar(120) NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"advance_minutes" integer DEFAULT 60 NOT NULL,
	"channel" varchar(10) DEFAULT 'push' NOT NULL,
	"status" varchar(10) DEFAULT 'scheduled' NOT NULL,
	"schedule_name" varchar(64),
	"enqueued_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	CONSTRAINT "reminders_type_check" CHECK ("reminders"."type" in ('vaccine', 'deworming', 'medication', 'appointment', 'weight', 'food', 'custom')),
	CONSTRAINT "reminders_advance_minutes_check" CHECK ("reminders"."advance_minutes" between 0 and 10080),
	CONSTRAINT "reminders_channel_check" CHECK ("reminders"."channel" in ('push')),
	CONSTRAINT "reminders_status_check" CHECK ("reminders"."status" in ('scheduled', 'sent', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reminders_pet_id_idx" ON "reminders" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "reminders_created_by_idx" ON "reminders" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "reminders_due_at_scheduled_idx" ON "reminders" USING btree ("due_at") WHERE "reminders"."status" = 'scheduled';