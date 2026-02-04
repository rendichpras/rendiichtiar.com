"use server"

import { db } from "@/db"
import { ensureDbUser } from "@/lib/auth/ensure-db-user"
import { emitEvent } from "@/lib/realtime"
import { headers } from "next/headers"
import { containsForbiddenWords } from "@/lib/constants/forbidden-words"

const MAX_MESSAGE_LENGTH = 280

function validateMessage(message: string) {
  const trimmed = message.trim()
  if (!trimmed) throw new Error("empty")
  if (trimmed.length > MAX_MESSAGE_LENGTH) throw new Error("message_too_long")

  if (containsForbiddenWords(trimmed)) {
    throw new Error("forbidden_words")
  }

  return trimmed
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
  const entries = await db.guestbookEntry.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: { name: true, email: true, imageUrl: true, authProvider: true },
      },
      likes: { include: { user: { select: { name: true, email: true } } } },
    },
  })

  const rootIds = entries.map((e) => e.id)

  const replies = await db.guestbookEntry.findMany({
    where: { rootId: { in: rootIds } },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, imageUrl: true } },
      mentionedUser: { select: { name: true } },
      likes: { include: { user: { select: { name: true, email: true } } } },
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
      email: e.user.email,
    },
    provider: e.user.authProvider ?? "clerk",
    likes: e.likes.map((l) => ({
      id: l.id,
      user: { name: l.user.name, email: l.user.email },
    })),
    replies: (repliesByRoot.get(e.id) ?? []).map((r) => ({
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      user: { name: r.user.name, image: r.user.imageUrl },
      mentionedUser: r.mentionedUser ? { name: r.mentionedUser.name } : null,
      likes: r.likes.map((l) => ({
        id: l.id,
        user: { name: l.user.name, email: l.user.email },
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
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
    const recentEntry = await db.guestbookEntry.findFirst({
      where: {
        ipAddress: ip,
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
      select: { id: true },
    })

    if (recentEntry) {
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
            email: true,
            imageUrl: true,
            authProvider: true,
          },
        },
        likes: { include: { user: { select: { name: true, email: true } } } },
      },
    })

    if (parentId) {
      emitEvent({
        type: "guestbook:reply",
        parentId: rootId ?? parentId,
        reply: {
          id: entry.id,
          message: entry.message,
          createdAt: entry.createdAt,
          user: { name: entry.user.name, image: entry.user.imageUrl },
          mentionedUser: entry.mentionedUserId
            ? { name: parentAuthor ?? null }
            : null,
          likes: [],
          parentId: entry.parentId,
          rootId: entry.rootId,
        },
      })
    } else {
      emitEvent({
        type: "guestbook:new",
        entry: {
          id: entry.id,
          message: entry.message,
          createdAt: entry.createdAt,
          user: {
            name: entry.user.name,
            image: entry.user.imageUrl,
            email: entry.user.email,
          },
          provider: entry.user.authProvider ?? "clerk",
          likes: [],
          replies: [],
        },
      })
    }

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
      emitEvent({
        type: "guestbook:like",
        id: entryId,
        userEmail: dbUser.email,
        action: "unlike",
      })
      return { success: true, liked: false }
    }

    await db.like.create({
      data: {
        userId: dbUser.id,
        guestbookEntryId: entryId,
      },
    })

    emitEvent({
      type: "guestbook:like",
      id: entryId,
      userEmail: dbUser.email,
      action: "like",
    })

    return { success: true, liked: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error"
    return { success: false, error: message }
  }
}
