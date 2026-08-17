CREATE TABLE "device_subscriptions" (
	"device_id" uuid PRIMARY KEY NOT NULL,
	"status" varchar(16) NOT NULL,
	"plan_code" varchar(32) NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "device_subscriptions_status_check" CHECK ("device_subscriptions"."status" in ('active', 'canceled')),
	CONSTRAINT "device_subscriptions_plan_code_check" CHECK ("device_subscriptions"."plan_code" in ('track_monthly', 'grandfathered'))
);
--> statement-breakpoint
ALTER TABLE "device_subscriptions" ADD CONSTRAINT "device_subscriptions_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;