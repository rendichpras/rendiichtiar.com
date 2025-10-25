"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { emitEvent } from "@/lib/realtime";

type PublicUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};
type PublicLike = { id: string; user: PublicUser };
type PublicReply = {
  id: string;
  message: string;
  createdAt: Date;
  user: PublicUser;
  mentionedUser?: { name: string | null } | null;
  likes: PublicLike[];
  parentId?: string | null;
  rootId?: string | null;
};
type PublicEntry = {
  id: string;
  message: string;
  createdAt: Date;
  user: PublicUser;
  provider: string;
  likes: PublicLike[];
  replies: PublicReply[];
};

function mapUser(u: any): PublicUser {
  return {
    name: u?.name ?? null,
    email: u?.email ?? null,
    image: u?.image ?? null,
  };
}
function mapLikes(arr: any[]): PublicLike[] {
  return arr.map((l) => ({ id: l.id, user: mapUser(l.user) }));
}
function sanitizeMessage(s: string) {
  return s.replace(/\s+/g, " ").trim().slice(0, 280);
}
async function findRootId(id: string): Promise<string> {
  let cur: {
    id: string;
    parentId: string | null;
    rootId: string | null;
  } | null = await prisma.guestbook.findUnique({
    where: { id },
    select: { id: true, parentId: true, rootId: true },
  });

  if (!cur) return id;
  if (!cur.parentId) return cur.id;
  if (cur.rootId) return cur.rootId;

  let pid: string | null = cur.parentId;
  while (pid) {
    const p: { id: string; parentId: string | null } | null =
      await prisma.guestbook.findUnique({
        where: { id: pid },
        select: { id: true, parentId: true },
      });
    if (!p) break;
    if (!p.parentId) return p.id;
    pid = p.parentId;
  }
  return cur.id;
}

export async function getGuestbookEntries(): Promise<PublicEntry[]> {
  const roots = await prisma.guestbook.findMany({
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
      likes: {
        include: { user: { select: { name: true, email: true, image: true } } },
      },
    },
    take: 50,
  });

  const rootIds = roots.map((r) => r.id);
  const replies = await prisma.guestbook.findMany({
    where: { rootId: { in: rootIds } },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      mentionedUser: { select: { name: true } },
      likes: {
        include: { user: { select: { name: true, email: true, image: true } } },
      },
    },
  });

  const repliesByRoot = new Map<string, PublicReply[]>();
  for (const r of replies) {
    const pr: PublicReply = {
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      user: mapUser(r.user),
      mentionedUser: r.mentionedUser ? { name: r.mentionedUser.name } : null,
      likes: mapLikes(r.likes),
      parentId: r.parentId ?? null,
      rootId: r.rootId ?? null,
    };
    const key = r.rootId as string;
    const arr = repliesByRoot.get(key) ?? [];
    arr.push(pr);
    repliesByRoot.set(key, arr);
  }

  return roots.map((e) => ({
    id: e.id,
    message: e.message,
    createdAt: e.createdAt,
    user: mapUser(e.user),
    provider: (e.user as any)?.accounts?.[0]?.provider ?? "local",
    likes: mapLikes(e.likes),
    replies: repliesByRoot.get(e.id) ?? [],
  }));
}

export async function addGuestbookEntry(
  message: string,
  userEmail: string,
  parentId?: string | null,
  parentAuthor?: string | null
) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("user_not_found");
  const text = sanitizeMessage(message);
  if (!text) throw new Error("empty_message");

  let mentionedUserId: string | null = null;
  if (parentAuthor) {
    const u = await prisma.user.findFirst({ where: { name: parentAuthor } });
    mentionedUserId = u?.id ?? null;
  }

  let rootId: string | null = null;
  if (parentId) rootId = await findRootId(parentId);

  const created = await prisma.guestbook.create({
    data: {
      message: text,
      userId: user.id,
      parentId: parentId ?? null,
      rootId,
      mentionedUserId,
    },
    select: { id: true },
  });

  if (parentId) {
    const r = await prisma.guestbook.findUnique({
      where: { id: created.id },
      include: {
        user: { select: { name: true, email: true, image: true } },
        mentionedUser: { select: { name: true } },
        likes: {
          include: {
            user: { select: { name: true, email: true, image: true } },
          },
        },
      },
    });
    if (r) {
      const reply: PublicReply = {
        id: r.id,
        message: r.message,
        createdAt: r.createdAt,
        user: mapUser(r.user),
        mentionedUser: r.mentionedUser ? { name: r.mentionedUser.name } : null,
        likes: mapLikes(r.likes),
        parentId: r.parentId ?? null,
        rootId: r.rootId ?? null,
      };
      emitEvent({ type: "guestbook:reply", parentId, reply });
    }
  } else {
    const e = await prisma.guestbook.findUnique({
      where: { id: created.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            accounts: { select: { provider: true }, take: 1 },
          },
        },
        likes: {
          include: {
            user: { select: { name: true, email: true, image: true } },
          },
        },
      },
    });
    if (e) {
      const entry: PublicEntry = {
        id: e.id,
        message: e.message,
        createdAt: e.createdAt,
        user: mapUser(e.user),
        provider: (e.user as any)?.accounts?.[0]?.provider ?? "local",
        likes: mapLikes(e.likes),
        replies: [],
      };
      emitEvent({ type: "guestbook:new", entry });
    }
  }

  revalidatePath("/guestbook");
}

export async function toggleLike(guestbookId: string, userEmail: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("user_not_found");

  const existing = await prisma.like.findFirst({
    where: { userId: user.id, guestbookId },
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    emitEvent({
      type: "guestbook:like",
      id: guestbookId,
      userEmail,
      action: "unlike",
    });
  } else {
    await prisma.like.create({ data: { userId: user.id, guestbookId } });
    emitEvent({
      type: "guestbook:like",
      id: guestbookId,
      userEmail,
      action: "like",
    });
  }

  revalidatePath("/guestbook");
}
