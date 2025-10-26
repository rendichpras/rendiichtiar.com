"use server"

import { randomUUID } from "crypto"
import { db } from "@/db"
import { users, posts, tags, postTags, postComments } from "@/db/schema/schema"
import { auth } from "@/lib/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import type { Session } from "next-auth"
import { eq, and, inArray, desc, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

const calcReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function makeExcerpt(markdown: string, maxLen = 200) {
  const plain = markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_>#\-]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (plain.length <= maxLen) return plain
  return plain.slice(0, maxLen - 1).trimEnd() + "…"
}

async function requireSession(): Promise<{
  userId: string
  isAdmin: boolean
}> {
  const session = (await auth()) as Session | null
  if (!session?.user?.email) throw new Error("unauthorized")

  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)

  const u = rows[0]
  if (!u) throw new Error("unauthorized")

  const isAdmin = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return { userId: u.id, isAdmin }
}

async function requireAdmin(): Promise<{ userId: string }> {
  const { userId, isAdmin } = await requireSession()
  if (!isAdmin) throw new Error("forbidden")
  return { userId }
}

async function upsertTags(names: string[]) {
  const unique = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)))

  const ids: string[] = []

  for (const name of unique) {
    const slug = slugify(name)

    const inserted = await db
      .insert(tags)
      .values({
        id: randomUUID(),
        name,
        slug,
      })
      .onConflictDoUpdate({
        target: tags.slug,
        set: { name },
      })
      .returning({ id: tags.id })

    ids.push(inserted[0]!.id)
  }

  return ids
}

export async function createPost(input: {
  title: string
  content: string
  coverUrl?: string
  tags?: string[]
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED"
  publishedAt?: Date | null
}) {
  const { userId } = await requireAdmin()

  const slug = slugify(input.title)
  const readingTime = calcReadingTime(input.content)
  const excerpt = makeExcerpt(input.content)
  const tagIds = input.tags?.length ? await upsertTags(input.tags) : []

  const normalizedStatus = input.status ?? "DRAFT"
  const publishTime =
    input.publishedAt ?? (normalizedStatus === "PUBLISHED" ? new Date() : null)

  const createdPost = await db.transaction(async (tx) => {
    const insertedPost = await tx
      .insert(posts)
      .values({
        id: randomUUID(),
        slug,
        title: input.title,
        excerpt,
        content: input.content,
        coverUrl: input.coverUrl ?? null,
        status: normalizedStatus,
        publishedAt: publishTime,
        readingTime,
        authorId: userId,
      })
      .returning({
        id: posts.id,
        slug: posts.slug,
      })

    const p = insertedPost[0]!
    if (tagIds.length) {
      await tx.insert(postTags).values(
        tagIds.map((tagId) => ({
          postId: p.id,
          tagId,
        }))
      )
    }

    return p
  })

  revalidateTag("blog-posts", "max")
  revalidatePath("/blog")
  return createdPost
}

export async function updatePost(
  id: string,
  input: {
    title?: string
    content?: string
    coverUrl?: string | null
    tags?: string[]
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED"
    publishedAt?: Date | null
  }
) {
  await requireAdmin()

  const updateData: Record<string, any> = {}

  if (typeof input.title === "string" && input.title.trim()) {
    updateData.title = input.title.trim()
    updateData.slug = slugify(input.title)
  }

  if (typeof input.content === "string") {
    updateData.content = input.content
    updateData.readingTime = calcReadingTime(input.content)
    updateData.excerpt = makeExcerpt(input.content)
  }

  if (input.coverUrl !== undefined) {
    updateData.coverUrl = input.coverUrl || null
  }

  if (input.status) {
    updateData.status = input.status
    if (input.status === "PUBLISHED" && !input.publishedAt) {
      updateData.publishedAt = new Date()
    }
  }

  if (input.publishedAt !== undefined) {
    updateData.publishedAt = input.publishedAt
  }

  updateData.updatedAt = new Date()

  const updated = await db.transaction(async (tx) => {
    if (input.tags) {
      const tagIds = await upsertTags(input.tags)

      await tx.delete(postTags).where(eq(postTags.postId, id))

      if (tagIds.length) {
        await tx.insert(postTags).values(
          tagIds.map((tagId) => ({
            postId: id,
            tagId,
          }))
        )
      }
    }

    const updatedRows = await tx
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning({
        id: posts.id,
        slug: posts.slug,
      })

    return updatedRows[0]!
  })

  revalidateTag("blog-posts", "max")
  revalidatePath("/blog")
  revalidatePath(`/blog/${updated.slug}`)
  return updated
}

export async function deletePost(id: string) {
  await requireAdmin()

  const deletedRows = await db.delete(posts).where(eq(posts.id, id)).returning({
    id: posts.id,
    slug: posts.slug,
  })

  const p = deletedRows[0]

  revalidateTag("blog-posts", "max")
  revalidatePath("/blog")
  return p
}

export async function publishPost(id: string) {
  await requireAdmin()

  const publishedRows = await db
    .update(posts)
    .set({
      status: "PUBLISHED",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning({
      slug: posts.slug,
    })

  const p = publishedRows[0]!

  revalidateTag("blog-posts", "max")
  revalidatePath("/blog")
  revalidatePath(`/blog/${p.slug}`)
  return p
}

export async function getPosts(input?: {
  tag?: string
  page?: number
  pageSize?: number
}) {
  const page = Math.max(1, input?.page ?? 1)
  const pageSize = Math.min(20, Math.max(1, input?.pageSize ?? 10))
  const offset = (page - 1) * pageSize

  let totalRows
  if (input?.tag) {
    totalRows = await db
      .select({
        count: sql<number>`count(distinct ${posts.id})`,
      })
      .from(posts)
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .where(and(eq(posts.status, "PUBLISHED"), eq(tags.slug, input.tag)))
  } else {
    totalRows = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"))
  }

  const total = Number(totalRows[0]?.count ?? 0)

  let pageIdRows
  if (input?.tag) {
    pageIdRows = await db
      .select({
        id: posts.id,
      })
      .from(posts)
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .where(and(eq(posts.status, "PUBLISHED"), eq(tags.slug, input.tag)))
      .orderBy(desc(posts.publishedAt))
      .limit(pageSize)
      .offset(offset)
  } else {
    pageIdRows = await db
      .select({
        id: posts.id,
      })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"))
      .orderBy(desc(posts.publishedAt))
      .limit(pageSize)
      .offset(offset)
  }

  const postIds = pageIdRows.map((r) => r.id)
  if (postIds.length === 0) {
    return {
      items: [],
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    }
  }

  const detailRows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      subtitle: posts.subtitle,
      excerpt: posts.excerpt,
      content: posts.content,
      coverUrl: posts.coverUrl,
      status: posts.status,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      readingTime: posts.readingTime,
      views: posts.views,
      authorId: posts.authorId,

      authorName: users.name,
      authorEmail: users.email,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .where(inArray(posts.id, postIds))
    .orderBy(desc(posts.publishedAt))

  const tagRows = await db
    .select({
      postId: postTags.postId,
      tagId: tags.id,
      tagSlug: tags.slug,
      tagName: tags.name,
    })
    .from(postTags)
    .leftJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, postIds))

  const tagMap = new Map<
    string,
    { tag: { id: string; slug: string; name: string } }[]
  >()

  for (const t of tagRows) {
    if (!t.tagId || !t.tagSlug || !t.tagName) continue

    const arr = tagMap.get(t.postId) ?? []
    arr.push({
      tag: {
        id: t.tagId,
        slug: t.tagSlug,
        name: t.tagName,
      },
    })
    tagMap.set(t.postId, arr)
  }

  const items = detailRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    content: row.content,
    coverUrl: row.coverUrl,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt,
    readingTime: row.readingTime,
    views: row.views,
    authorId: row.authorId,
    author: {
      id: row.authorId,
      name: row.authorName,
      email: row.authorEmail,
      image: row.authorImage,
    },
    tags: tagMap.get(row.id) ?? [],
  }))

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
}

export async function getPostBySlug(slug: string) {
  const postRows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      subtitle: posts.subtitle,
      excerpt: posts.excerpt,
      content: posts.content,
      coverUrl: posts.coverUrl,
      status: posts.status,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      readingTime: posts.readingTime,
      views: posts.views,
      authorId: posts.authorId,

      authorName: users.name,
      authorEmail: users.email,
      authorImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.authorId))
    .where(eq(posts.slug, slug))
    .limit(1)

  const p = postRows[0]
  if (!p) return null

  const tagRows = await db
    .select({
      tagId: tags.id,
      tagSlug: tags.slug,
      tagName: tags.name,
    })
    .from(postTags)
    .leftJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, p.id))

  const filteredTagRows = tagRows.filter(
    (t) => t.tagId && t.tagSlug && t.tagName
  )

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    excerpt: p.excerpt,
    content: p.content,
    coverUrl: p.coverUrl,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    views: p.views,
    authorId: p.authorId,
    author: {
      id: p.authorId,
      name: p.authorName,
      email: p.authorEmail,
      image: p.authorImage,
    },
    tags: filteredTagRows.map((t) => ({
      tag: {
        id: t.tagId as string,
        slug: t.tagSlug as string,
        name: t.tagName as string,
      },
    })),
  }
}

export async function incrementView(slug: string) {
  await db
    .update(posts)
    .set({
      views: sql`${posts.views} + 1`,
    })
    .where(eq(posts.slug, slug))
}

async function findRootId(commentId: string): Promise<string> {
  const curRows: {
    id: string
    parentId: string | null
    rootId: string | null
  }[] = await db
    .select({
      id: postComments.id,
      parentId: postComments.parentId,
      rootId: postComments.rootId,
    })
    .from(postComments)
    .where(eq(postComments.id, commentId))
    .limit(1)

  const cur = curRows[0] ?? null
  if (!cur) return commentId
  if (!cur.parentId) return cur.id
  if (cur.rootId) return cur.rootId

  let pid: string | null = cur.parentId
  while (pid) {
    const parentRows: {
      id: string
      parentId: string | null
    }[] = await db
      .select({
        id: postComments.id,
        parentId: postComments.parentId,
      })
      .from(postComments)
      .where(eq(postComments.id, pid))
      .limit(1)

    const parentRes = parentRows[0] ?? null
    if (!parentRes) break
    if (!parentRes.parentId) return parentRes.id
    pid = parentRes.parentId
  }

  return cur.id
}

export async function addPostComment(input: {
  postId: string
  message: string
  parentId?: string | null
  parentAuthor?: string | null
}) {
  const { userId } = await requireSession()

  const text = input.message.trim().slice(0, 280)
  if (!text) throw new Error("empty_message")

  const rootId = input.parentId ? await findRootId(input.parentId) : null

  let mentionedUserId: string | null = null
  if (input.parentAuthor) {
    const uRows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.name, input.parentAuthor))
      .limit(1)
    mentionedUserId = uRows[0]?.id ?? null
  }

  const insertedRows = await db
    .insert(postComments)
    .values({
      id: randomUUID(),
      postId: input.postId,
      userId,
      message: text,
      parentId: input.parentId ?? null,
      rootId,
      mentionedUserId,
    })
    .returning({
      id: postComments.id,
      postId: postComments.postId,
      userId: postComments.userId,
      message: postComments.message,
      parentId: postComments.parentId,
      rootId: postComments.rootId,
      mentionedUserId: postComments.mentionedUserId,
      createdAt: postComments.createdAt,
    })

  const c = insertedRows[0]

  const slugRows = await db
    .select({
      slug: posts.slug,
    })
    .from(posts)
    .where(eq(posts.id, input.postId))
    .limit(1)

  const slugObj = slugRows[0]
  if (slugObj?.slug) {
    revalidatePath(`/blog/${slugObj.slug}`)
  }

  return c
}

export async function getPostComments(postId: string) {
  const mentionedUsers = alias(users, "mentionedUsers")

  const rows = await db
    .select({
      id: postComments.id,
      postId: postComments.postId,
      userId: postComments.userId,
      message: postComments.message,
      createdAt: postComments.createdAt,
      parentId: postComments.parentId,
      rootId: postComments.rootId,
      mentionedUserId: postComments.mentionedUserId,

      userName: users.name,
      userImage: users.image,

      mentionedUserName: mentionedUsers.name,
    })
    .from(postComments)
    .leftJoin(users, eq(postComments.userId, users.id))
    .leftJoin(
      mentionedUsers,
      eq(postComments.mentionedUserId, mentionedUsers.id)
    )
    .where(eq(postComments.postId, postId))
    .orderBy(postComments.createdAt)

  return rows.map((r) => ({
    id: r.id,
    postId: r.postId,
    userId: r.userId,
    message: r.message,
    createdAt: r.createdAt,
    parentId: r.parentId,
    rootId: r.rootId,
    mentionedUserId: r.mentionedUserId,
    user: {
      name: r.userName,
      image: r.userImage,
    },
    mentionedUser: r.mentionedUserName ? { name: r.mentionedUserName } : null,
  }))
}
