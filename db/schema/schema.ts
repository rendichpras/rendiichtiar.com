import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// enum PostStatus
export const postStatusEnum = pgEnum("PostStatus", [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
])

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

// Tag
export const tags = pgTable("Tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
})

// Post
export const posts = pgTable(
  "Post",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverUrl: text("coverUrl"),

    status: postStatusEnum("status").notNull().default("DRAFT"),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),

    publishedAt: timestamp("publishedAt", {
      mode: "date",
      withTimezone: false,
    }),
    readingTime: integer("readingTime").notNull().default(0),
    views: integer("views").notNull().default(0),

    authorId: text("authorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    statusPublishedIdx: index("Post_status_publishedAt_idx").on(
      table.status,
      table.publishedAt
    ),
  })
)

// PostTag
export const postTags = pgTable(
  "PostTag",
  {
    postId: text("postId")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    tagId: text("tagId")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({
      name: "PostTag_pkey",
      columns: [table.postId, table.tagId],
    }),
  })
)

// PostComment
export const postComments = pgTable(
  "PostComment",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    postId: text("postId")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    message: text("message").notNull(),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),

    parentId: text("parentId"),

    rootId: text("rootId"),

    mentionedUserId: text("mentionedUserId").references(() => users.id),
  },
  (table) => ({
    postIdx: index("PostComment_postId_idx").on(table.postId),
    rootIdx: index("PostComment_rootId_idx").on(table.rootId),
    parentIdx: index("PostComment_parentId_idx").on(table.parentId),

    parentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "PostComment_parentId_fkey",
    }).onDelete("cascade"),
  })
)
