import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// User
export const users = pgTable("User", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: false,
  }),
  image: text("image"),
})

// Account
export const accounts = pgTable(
  "Account",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerProviderAccountIdUnique: uniqueIndex(
      "Account_provider_providerAccountId_unique"
    ).on(table.provider, table.providerAccountId),
  })
)

// Session
export const sessions = pgTable("Session", {
  id: text("id").primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: false,
  }).notNull(),
})

// Guestbook
export const guestbook = pgTable(
  "Guestbook",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    message: text("message").notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    parentId: text("parentId"),
    rootId: text("rootId"),

    mentionedUserId: text("mentionedUserId").references(() => users.id),
  },
  (table) => ({
    parentIdx: index("Guestbook_parentId_idx").on(table.parentId),
    rootIdx: index("Guestbook_rootId_idx").on(table.rootId),

    parentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "Guestbook_parentId_fkey",
    }).onDelete("cascade"),

    rootFk: foreignKey({
      columns: [table.rootId],
      foreignColumns: [table.id],
      name: "Guestbook_rootId_fkey",
    }).onDelete("cascade"),
  })
)

// Like
export const likes = pgTable(
  "Like",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    guestbookId: text("guestbookId")
      .notNull()
      .references(() => guestbook.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userGuestUnique: uniqueIndex("Like_userId_guestbookId_unique").on(
      table.userId,
      table.guestbookId
    ),
  })
)

// Contact
export const contacts = pgTable("Contact", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: false,
  })
    .defaultNow()
    .notNull(),
  status: text("status").notNull().default("UNREAD"),
})
