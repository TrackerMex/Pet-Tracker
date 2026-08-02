CREATE TABLE "activity_daily" (
	"pet_id" uuid NOT NULL,
	"date" date NOT NULL,
	"distance_m" integer NOT NULL,
	"active_minutes" integer NOT NULL,
	"rest_minutes" integer NOT NULL,
	"walk_count" integer NOT NULL,
	"avg_walk_minutes" numeric(6, 2) NOT NULL,
	"first_walk_at" timestamp with time zone,
	"last_walk_at" timestamp with time zone,
	"time_away_minutes" integer,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activity_daily_pet_id_date_pk" PRIMARY KEY("pet_id","date"),
	CONSTRAINT "activity_daily_distance_m_check" CHECK ("activity_daily"."distance_m" >= 0),
	CONSTRAINT "activity_daily_active_minutes_check" CHECK ("activity_daily"."active_minutes" >= 0),
	CONSTRAINT "activity_daily_rest_minutes_check" CHECK ("activity_daily"."rest_minutes" >= 0),
	CONSTRAINT "activity_daily_walk_count_check" CHECK ("activity_daily"."walk_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "activity_daily" ADD CONSTRAINT "activity_daily_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;