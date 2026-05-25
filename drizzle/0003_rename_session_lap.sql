-- For databases that applied an earlier 0002 using table name "session_lap"
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'session_lap'
  ) THEN
    ALTER TABLE "session_lap" RENAME TO "track_session_lap";
    ALTER INDEX IF EXISTS "session_lap_session_id_idx"
      RENAME TO "track_session_lap_session_id_idx";
    ALTER TABLE "track_session_lap"
      RENAME CONSTRAINT "session_lap_number_positive"
      TO "track_session_lap_number_positive";
    ALTER TABLE "track_session_lap"
      RENAME CONSTRAINT "session_lap_session_id_track_session_id_fk"
      TO "track_session_lap_session_id_track_session_id_fk";
  END IF;
END $$;
