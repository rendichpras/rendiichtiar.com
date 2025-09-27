"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type PublicUser = { name: string | null; email: string | null; image: string | null }
type PublicLike = { id: string; user: PublicUser }
type PublicReply = {
  id: string
  message: string
  createdAt: Date
  user: PublicUser
  mentionedUser?: { name: string | null } | null
  likes: PublicLike[]
}
type PublicEntry = {
  id: string
  message: string
  createdAt: Date
  user: PublicUser
  provider: string
  likes: PublicLike[]
  replies: PublicReply[]
}

export async function getGuestbookEntries(): Promise<PublicEntry[]> {
  const entries = await prisma.guestbook.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          accounts: { select: { provider: true }, take: 1 },
        },
      },
      likes: { include: { user: { select: { name: true, email: true, image: true } } } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true, image: true, email: true } },
          mentionedUser: { select: { name: true } },
          likes: { include: { user: { select: { name: true, email: true, image: true } } } },
        },
      },
    },
    take: 50,
  })

  return entries.map((e) => ({
    id: e.id,
    message: e.message,
    createdAt: e.createdAt,
    user: { name: e.user?.name ?? null, email: e.user?.email ?? null, image: e.user?.image ?? null },
    provider: (e.user as any)?.accounts?.[0]?.provider ?? "local",
    likes: e.likes.map((l) => ({
      id: l.id,
      user: { name: l.user?.name ?? null, email: l.user?.email ?? null, image: l.user?.image ?? null },
    })),
    replies: e.replies.map((r) => ({
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      user: { name: r.user?.name ?? null, email: r.user?.email ?? null, image: r.user?.image ?? null },
      mentionedUser: r.mentionedUser ? { name: r.mentionedUser.name } : null,
      likes: r.likes.map((l) => ({
        id: l.id,
        user: { name: l.user?.name ?? null, email: l.user?.email ?? null, image: l.user?.image ?? null },
      })),
    })),
  }))
}

function sanitizeMessage(s: string) {
  return s.replace(/\s+/g, " ").trim().slice(0, 280)
}

export async function addGuestbookEntry(
  message: string,
  userEmail: string,
  parentId?: string | null,
  parentAuthor?: string | null
) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) throw new Error("user_not_found")
  const text = sanitizeMessage(message)
  if (!text) throw new Error("empty_message")

  let mentionedUserId: string | null = null
  if (parentAuthor) {
    const u = await prisma.user.findFirst({ where: { name: parentAuthor } })
    mentionedUserId = u?.id ?? null
  }

  await prisma.guestbook.create({
    data: {
      message: text,
      userId: user.id,
      parentId: parentId ?? null,
      mentionedUserId,
    },
  })

  revalidatePath("/guestbook")
}

export async function toggleLike(guestbookId: string, userEmail: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) throw new Error("user_not_found")

  const existing = await prisma.like.findFirst({ where: { userId: user.id, guestbookId } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId: user.id, guestbookId } })
  }

  revalidatePath("/guestbook")
}
