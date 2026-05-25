CREATE TABLE "track_session_lap" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"lap_number" integer NOT NULL,
	"lap_time" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "track_session_lap_number_positive" CHECK ("track_session_lap"."lap_number" >= 1)
);
--> statement-breakpoint
ALTER TABLE "track_session_lap" ADD CONSTRAINT "track_session_lap_session_id_track_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."track_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "track_session_lap_session_id_idx" ON "track_session_lap" USING btree ("session_id");--> statement-breakpoint
ALTER TABLE "track_session" DROP CONSTRAINT "track_session_lap_count_non_negative";--> statement-breakpoint
ALTER TABLE "track_session" DROP COLUMN "lap_count";--> statement-breakpoint
ALTER TABLE "track_session" DROP COLUMN "average_lap";
