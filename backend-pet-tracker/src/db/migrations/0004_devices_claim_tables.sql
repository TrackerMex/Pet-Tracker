CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"esn" varchar(64),
	"imei" varchar(64),
	"serial_number" varchar(64),
	"activation_code" varchar(64),
	"wialon_unit_id" text,
	"model" varchar(120),
	"status" varchar(10) DEFAULT 'available' NOT NULL,
	"battery_pct" integer,
	"connectivity" varchar(20),
	"last_message_at" timestamp with time zone,
	"ingest_watermark" timestamp with time zone,
	"is_simulated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devices_esn_unique" UNIQUE("esn"),
	CONSTRAINT "devices_imei_unique" UNIQUE("imei"),
	CONSTRAINT "devices_serial_number_unique" UNIQUE("serial_number"),
	CONSTRAINT "devices_activation_code_unique" UNIQUE("activation_code"),
	CONSTRAINT "devices_wialon_unit_id_unique" UNIQUE("wialon_unit_id"),
	CONSTRAINT "devices_status_check" CHECK ("devices"."status" in ('available', 'assigned', 'inactive'))
);
--> statement-breakpoint
CREATE TABLE "pet_devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"device_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"released_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "pet_devices" ADD CONSTRAINT "pet_devices_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_devices" ADD CONSTRAINT "pet_devices_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pet_devices_active_device_id_idx" ON "pet_devices" USING btree ("device_id") WHERE "pet_devices"."released_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "pet_devices_active_pet_id_idx" ON "pet_devices" USING btree ("pet_id") WHERE "pet_devices"."released_at" is null;--> statement-breakpoint
CREATE INDEX "pet_devices_pet_id_idx" ON "pet_devices" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "pet_devices_device_id_idx" ON "pet_devices" USING btree ("device_id");