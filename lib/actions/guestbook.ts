"use server"

import { db } from "@/db"
import { ensureDbUser } from "@/lib/auth/ensure-db-user"
import { emitEvent } from "@/lib/realtime"
import { getClientIp } from "@/lib/security/client-ip"
import { guestbookSchema } from "@/lib/validations/guestbook"

function validateMessage(message: string) {
  const result = guestbookSchema.safeParse({ message })

  if (!result.success) {
    const error = result.error.issues[0].message
    throw new Error(error)
  }

  return result.data.message.trim()
}

async function resolveMentionedUserId(parentAuthor?: string) {
  if (!parentAuthor) return null
  const u = await db.user.findFirst({
    where: {
      name: {
        equals: parentAuthor,
        mode: "insensitive",
      },
    },
    select: { id: true },
  })
  return u?.id ?? null
}

async function resolveRootId(parentId: string) {
  let current: {
    id: string
    parentId: string | null
    rootId: string | null
  } | null = await db.guestbookEntry.findUnique({
    where: { id: parentId },
    select: { id: true, parentId: true, rootId: true },
  })
  if (!current) return null

  if (current.rootId) return current.rootId

  while (current && current.parentId) {
    const next: {
      id: string
      parentId: string | null
      rootId: string | null
    } | null = await db.guestbookEntry.findUnique({
      where: { id: current.parentId },
      select: { id: true, parentId: true, rootId: true },
    })
    if (!next) break
    if (next.rootId) return next.rootId
    current = next
  }

  return current?.id ?? null
}

export async function getGuestbookEntries() {
  const adminClerkId = process.env.ADMIN_CLERK_ID ?? ""

  const entries = await db.guestbookEntry.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: {
          name: true,
          clerkId: true,
          imageUrl: true,
          authProvider: true,
        },
      },
      likes: {
        include: { user: { select: { name: true, clerkId: true } } },
      },
    },
  })

  const rootIds = entries.map((e) => e.id)

  const replies = await db.guestbookEntry.findMany({
    where: { rootId: { in: rootIds } },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, clerkId: true, imageUrl: true } },
      mentionedUser: { select: { name: true } },
      likes: {
        include: { user: { select: { name: true, clerkId: true } } },
      },
    },
  })

  const repliesByRoot = new Map<string, (typeof replies)[number][]>()
  for (const r of replies) {
    if (!r.rootId) continue
    const arr = repliesByRoot.get(r.rootId) ?? []
    arr.push(r)
    repliesByRoot.set(r.rootId, arr)
  }

  return entries.map((e) => ({
    id: e.id,
    message: e.message,
    createdAt: e.createdAt,
    user: {
      name: e.user.name,
      image: e.user.imageUrl,
      isOwner: adminClerkId ? e.user.clerkId === adminClerkId : false,
    },
    provider: e.user.authProvider ?? "clerk",
    likes: e.likes.map((l) => ({
      id: l.id,
      user: { name: l.user.name, clerkId: l.user.clerkId },
    })),
    replies: (repliesByRoot.get(e.id) ?? []).map((r) => ({
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      user: {
        name: r.user.name,
        image: r.user.imageUrl,
        isOwner: adminClerkId ? r.user.clerkId === adminClerkId : false,
      },
      mentionedUser: r.mentionedUser ? { name: r.mentionedUser.name } : null,
      likes: r.likes.map((l) => ({
        id: l.id,
        user: { name: l.user.name, clerkId: l.user.clerkId },
      })),
      parentId: r.parentId,
      rootId: r.rootId,
    })),
  }))
}

export async function addGuestbookEntry(
  message: string,
  parentId?: string,
  parentAuthor?: string
) {
  try {
    const dbUser = await ensureDbUser()
    const trimmed = validateMessage(message)

    const ip = await getClientIp()

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

    const recentByUser = await db.guestbookEntry.findFirst({
      where: { userId: dbUser.id, createdAt: { gte: oneMinuteAgo } },
      select: { id: true },
    })

    const recentByIp = ip
      ? await db.guestbookEntry.findFirst({
          where: { ipAddress: ip, createdAt: { gte: oneMinuteAgo } },
          select: { id: true },
        })
      : null

    if (recentByUser || recentByIp) {
      return { success: false, error: "rate_limit_exceeded" }
    }

    const mentionedUserId = await resolveMentionedUserId(parentAuthor)
    const rootId = parentId ? await resolveRootId(parentId) : null

    const entry = await db.guestbookEntry.create({
      data: {
        message: trimmed,
        userId: dbUser.id,
        parentId: parentId ?? null,
        rootId,
        mentionedUserId,
        ipAddress: ip,
      },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
            authProvider: true,
          },
        },
        likes: { include: { user: { select: { name: true, clerkId: true } } } },
      },
    })

    await emitEvent({
      type: "guestbook:refresh",
      reason: parentId ? "reply" : "new",
      entryId: entry.id,
      rootId: entry.rootId ?? (parentId ? (rootId ?? parentId) : undefined),
      ts: Date.now(),
    })

    return { success: true, entryId: entry.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error"
    return { success: false, error: message }
  }
}

export async function toggleLike(entryId: string) {
  try {
    const dbUser = await ensureDbUser()

    const existing = await db.like.findUnique({
      where: {
        userId_guestbookEntryId: {
          userId: dbUser.id,
          guestbookEntryId: entryId,
        },
      },
      select: { id: true },
    })

    if (existing) {
      await db.like.delete({ where: { id: existing.id } })
      await emitEvent({
        type: "guestbook:refresh",
        reason: "unlike",
        entryId,
        ts: Date.now(),
      })
      return { success: true, liked: false }
    }

    await db.like.create({
      data: {
        userId: dbUser.id,
        guestbookEntryId: entryId,
      },
    })

    await emitEvent({
      type: "guestbook:refresh",
      reason: "like",
      entryId,
      ts: Date.now(),
    })

    return { success: true, liked: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error"
    return { success: false, error: message }
  }
}
