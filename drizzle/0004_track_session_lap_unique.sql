CREATE UNIQUE INDEX "track_session_lap_session_lap_number_uidx" ON "track_session_lap" USING btree ("session_id","lap_number");
