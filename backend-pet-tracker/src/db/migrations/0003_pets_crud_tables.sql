CREATE TABLE "pet_users" (
	"pet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(10) NOT NULL,
	"permissions" jsonb,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pet_users_pet_id_user_id_pk" PRIMARY KEY("pet_id","user_id"),
	CONSTRAINT "pet_users_role_check" CHECK ("pet_users"."role" in ('owner', 'family', 'walker', 'vet'))
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"species" varchar(10) NOT NULL,
	"breed" varchar(120),
	"birth_date" date,
	"approx_age_months" integer,
	"sex" varchar(10),
	"current_weight_kg" numeric(5, 2),
	"size" varchar(10),
	"color" varchar(60),
	"sterilized" boolean,
	"microchip" varchar(32),
	"photo_key" text,
	"lost_mode" boolean DEFAULT false NOT NULL,
	"last_position" jsonb,
	"last_communication_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pets_species_check" CHECK ("pets"."species" in ('dog', 'cat'))
);
--> statement-breakpoint
ALTER TABLE "pet_users" ADD CONSTRAINT "pet_users_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_users" ADD CONSTRAINT "pet_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pet_users_user_id_idx" ON "pet_users" USING btree ("user_id");