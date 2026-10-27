CREATE TABLE "pet_invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"code_hash" char(64) NOT NULL,
	"role" varchar(10) NOT NULL,
	"created_by" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_by" uuid,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pet_invites_code_hash_unique" UNIQUE("code_hash"),
	CONSTRAINT "pet_invites_role_check" CHECK ("pet_invites"."role" in ('family'))
);
--> statement-breakpoint
ALTER TABLE "pet_invites" ADD CONSTRAINT "pet_invites_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_invites" ADD CONSTRAINT "pet_invites_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_invites" ADD CONSTRAINT "pet_invites_accepted_by_users_id_fk" FOREIGN KEY ("accepted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pet_invites_pet_id_idx" ON "pet_invites" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "pet_invites_created_by_idx" ON "pet_invites" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "pet_invites_accepted_by_idx" ON "pet_invites" USING btree ("accepted_by");