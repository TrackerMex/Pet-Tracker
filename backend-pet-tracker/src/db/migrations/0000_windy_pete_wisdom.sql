CREATE TABLE "schema_bootstrap" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "schema_bootstrap_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
