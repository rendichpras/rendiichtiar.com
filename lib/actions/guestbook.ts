"use server"

import { db } from "@/db"
import { ensureDbUser } from "@/lib/auth/ensure-db-user"
import { validateGuestbookMessage } from "@/lib/guestbook/message"
import { resolveMentionedUserIdByName } from "@/lib/guestbook/mentions"
import { resolveGuestbookRootId } from "@/lib/guestbook/threading"
import { emitEvent } from "@/lib/realtime"
import { getClientIp } from "@/lib/security/client-ip"

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

  const repliesByRoot = replies.reduce((acc, r) => {
    if (!r.rootId) return acc
    acc.set(r.rootId, [...(acc.get(r.rootId) || []), r])
    return acc
  }, new Map<string, typeof replies>())

  return entries.map((e) => {
    const isOwner = adminClerkId ? e.user.clerkId === adminClerkId : false
    const mappedLikes = e.likes.map((l) => ({
      id: l.id,
      user: { name: l.user.name, clerkId: l.user.clerkId },
    }))

    const mappedReplies = (repliesByRoot.get(e.id) || []).map((r) => ({
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
    }))

    return {
      id: e.id,
      message: e.message,
      createdAt: e.createdAt,
      user: {
        name: e.user.name,
        image: e.user.imageUrl,
        isOwner,
      },
      provider: e.user.authProvider ?? "clerk",
      likes: mappedLikes,
      replies: mappedReplies,
    }
  })
}

export async function addGuestbookEntry(
  message: string,
  parentId?: string,
  parentAuthor?: string
) {
  try {
    const dbUser = await ensureDbUser()
    const trimmed = validateGuestbookMessage(message)

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

    const mentionedUserId = await resolveMentionedUserIdByName(parentAuthor)
    const rootId = parentId ? await resolveGuestbookRootId(parentId) : null

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
        likes: {
          include: { user: { select: { name: true, clerkId: true } } },
        },
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
