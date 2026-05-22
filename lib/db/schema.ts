import {
  boolean,
  pgTable,
  text,
  timestamp,
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
// Your domain tables — define these for the homework.
// Example reference uses a `post` table with `authorId` FK to `user.id`.
// Yours can be anything — `note`, `task`, `quote`, `book`, ... — as long as it
// has owner-only mutations and at least one Zod-validated input field.
// =============================================================================

// export const post = pgTable("post", {
//   id: text("id").primaryKey(),
//   authorId: text("author_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
//   title: text("title").notNull(),
//   body: text("body").notNull(),
//   published: boolean("published").notNull().default(false),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });
