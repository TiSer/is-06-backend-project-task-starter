import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// =============================================================================
// Better Auth tables — DO NOT rename or remove these.
// Better Auth's Drizzle adapter expects these exact table and column names.
// If you need to extend a row (e.g. add `role` to `user`), add a column here
// rather than wrapping these in another table.
// =============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;

// =============================================================================
// Domain — track_session (REST: /api/v1/track_sessions)
// =============================================================================

export const trackSession = pgTable(
  "track_session",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    trackId: text("track_id").notNull(),
    title: text("title").notNull(),
    sessionDate: date("session_date").notNull(),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("track_session_author_id_idx").on(table.authorId),
    index("track_session_published_idx").on(table.published),
  ],
);

export const trackSessionLap = pgTable(
  "track_session_lap",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => trackSession.id, { onDelete: "cascade" }),
    lapNumber: integer("lap_number").notNull(),
    lapTime: text("lap_time").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("track_session_lap_session_id_idx").on(table.sessionId),
    uniqueIndex("track_session_lap_session_lap_number_uidx").on(
      table.sessionId,
      table.lapNumber,
    ),
    check("track_session_lap_number_positive", sql`${table.lapNumber} >= 1`),
  ],
);

export type TrackSession = typeof trackSession.$inferSelect;
export type NewTrackSession = typeof trackSession.$inferInsert;
export type TrackSessionLap = typeof trackSessionLap.$inferSelect;
