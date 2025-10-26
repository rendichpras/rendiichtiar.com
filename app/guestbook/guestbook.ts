"use server";

import { db } from "@/db";
import {
  guestbook as guestbookTable,
  users,
  likes as likesTable,
  accounts,
} from "@/db/schema/schema";
import { revalidatePath } from "next/cache";
import { emitEvent } from "@/lib/realtime";
import { eq, and, isNull, inArray, desc, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

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

function sanitizeMessage(s: string) {
  return s.replace(/\s+/g, " ").trim().slice(0, 280);
}

async function findRootId(id: string): Promise<string> {
  const curRows: {
    id: string;
    parentId: string | null;
    rootId: string | null;
  }[] = await db
    .select({
      id: guestbookTable.id,
      parentId: guestbookTable.parentId,
      rootId: guestbookTable.rootId,
    })
    .from(guestbookTable)
    .where(eq(guestbookTable.id, id))
    .limit(1);

  const cur = curRows[0] ?? null;
  if (!cur) return id;
  if (!cur.parentId) return cur.id;
  if (cur.rootId) return cur.rootId;

  let pid: string | null = cur.parentId;
  while (pid) {
    const pRows: {
      id: string;
      parentId: string | null;
    }[] = await db
      .select({
        id: guestbookTable.id,
        parentId: guestbookTable.parentId,
      })
      .from(guestbookTable)
      .where(eq(guestbookTable.id, pid))
      .limit(1);

    const p = pRows[0] ?? null;
    if (!p) break;
    if (!p.parentId) return p.id;
    pid = p.parentId;
  }

  return cur.id;
}

export async function getGuestbookEntries(): Promise<PublicEntry[]> {
  const rootRows = await db
    .select({
      id: guestbookTable.id,
      message: guestbookTable.message,
      createdAt: guestbookTable.createdAt,
      userId: guestbookTable.userId,
    })
    .from(guestbookTable)
    .where(isNull(guestbookTable.parentId))
    .orderBy(desc(guestbookTable.createdAt))
    .limit(50);

  if (rootRows.length === 0) return [];

  const rootIds = rootRows.map((r) => r.id);
  const rootUserIds = Array.from(new Set(rootRows.map((r) => r.userId)));

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .where(inArray(users.id, rootUserIds));

  const userMap = new Map<
    string,
    { name: string | null; email: string | null; image: string | null }
  >();
  for (const u of userRows) {
    userMap.set(u.id, {
      name: u.name ?? null,
      email: u.email ?? null,
      image: u.image ?? null,
    });
  }

  const accountRows = await db
    .select({
      userId: accounts.userId,
      provider: accounts.provider,
    })
    .from(accounts)
    .where(inArray(accounts.userId, rootUserIds));

  const providerMap = new Map<string, string>();
  for (const a of accountRows) {
    if (!providerMap.has(a.userId) && a.provider) {
      providerMap.set(a.userId, a.provider);
    }
  }

  const likesRowsRoots = await db
    .select({
      likeId: likesTable.id,
      guestbookId: likesTable.guestbookId,
      likerName: users.name,
      likerEmail: users.email,
      likerImage: users.image,
    })
    .from(likesTable)
    .leftJoin(users, eq(users.id, likesTable.userId))
    .where(inArray(likesTable.guestbookId, rootIds));

  const likesMapRoots = new Map<string, PublicLike[]>();
  for (const l of likesRowsRoots) {
    const arr = likesMapRoots.get(l.guestbookId) ?? [];
    arr.push({
      id: l.likeId,
      user: {
        name: l.likerName ?? null,
        email: l.likerEmail ?? null,
        image: l.likerImage ?? null,
      },
    });
    likesMapRoots.set(l.guestbookId, arr);
  }

  const replyRows = await db
    .select({
      id: guestbookTable.id,
      message: guestbookTable.message,
      createdAt: guestbookTable.createdAt,
      userId: guestbookTable.userId,
      parentId: guestbookTable.parentId,
      rootId: guestbookTable.rootId,
      mentionedUserId: guestbookTable.mentionedUserId,
    })
    .from(guestbookTable)
    .where(inArray(guestbookTable.rootId, rootIds))
    .orderBy(asc(guestbookTable.createdAt));

  const replyIds = replyRows.map((r) => r.id);
  const replyUserIds = Array.from(new Set(replyRows.map((r) => r.userId)));
  const replyMentionIds = Array.from(
    new Set(
      replyRows.map((r) => r.mentionedUserId).filter((v): v is string => !!v)
    )
  );

  const replyUserRows =
    replyUserIds.length > 0
      ? await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          })
          .from(users)
          .where(inArray(users.id, replyUserIds))
      : [];

  const replyUserMap = new Map<
    string,
    { name: string | null; email: string | null; image: string | null }
  >();
  for (const u of replyUserRows) {
    replyUserMap.set(u.id, {
      name: u.name ?? null,
      email: u.email ?? null,
      image: u.image ?? null,
    });
  }

  const mentionedRows =
    replyMentionIds.length > 0
      ? await db
          .select({
            id: users.id,
            name: users.name,
          })
          .from(users)
          .where(inArray(users.id, replyMentionIds))
      : [];

  const mentionedMap = new Map<string, string | null>();
  for (const m of mentionedRows) {
    mentionedMap.set(m.id, m.name ?? null);
  }

  const replyLikesRows =
    replyIds.length > 0
      ? await db
          .select({
            likeId: likesTable.id,
            guestbookId: likesTable.guestbookId,
            likerName: users.name,
            likerEmail: users.email,
            likerImage: users.image,
          })
          .from(likesTable)
          .leftJoin(users, eq(users.id, likesTable.userId))
          .where(inArray(likesTable.guestbookId, replyIds))
      : [];

  const likesMapReplies = new Map<string, PublicLike[]>();
  for (const l of replyLikesRows) {
    const arr = likesMapReplies.get(l.guestbookId) ?? [];
    arr.push({
      id: l.likeId,
      user: {
        name: l.likerName ?? null,
        email: l.likerEmail ?? null,
        image: l.likerImage ?? null,
      },
    });
    likesMapReplies.set(l.guestbookId, arr);
  }

  const repliesByRoot = new Map<string, PublicReply[]>();
  for (const r of replyRows) {
    const replyUserData = replyUserMap.get(r.userId);
    const replyObj: PublicReply = {
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      user: {
        name: replyUserData?.name ?? null,
        email: replyUserData?.email ?? null,
        image: replyUserData?.image ?? null,
      },
      mentionedUser: r.mentionedUserId
        ? { name: mentionedMap.get(r.mentionedUserId) ?? null }
        : null,
      likes: likesMapReplies.get(r.id) ?? [],
      parentId: r.parentId ?? null,
      rootId: r.rootId ?? null,
    };

    const key = r.rootId as string;
    const arr = repliesByRoot.get(key) ?? [];
    arr.push(replyObj);
    repliesByRoot.set(key, arr);
  }

  const result: PublicEntry[] = rootRows.map((root) => {
    const u = userMap.get(root.userId);
    return {
      id: root.id,
      message: root.message,
      createdAt: root.createdAt,
      user: {
        name: u?.name ?? null,
        email: u?.email ?? null,
        image: u?.image ?? null,
      },
      provider: providerMap.get(root.userId) ?? "local",
      likes: likesMapRoots.get(root.id) ?? [],
      replies: repliesByRoot.get(root.id) ?? [],
    };
  });

  return result;
}

export async function addGuestbookEntry(
  message: string,
  userEmail: string,
  parentId?: string | null,
  parentAuthor?: string | null
) {
  const uRows = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.email, userEmail))
    .limit(1);

  const userRow = uRows[0];
  if (!userRow) throw new Error("user_not_found");

  const text = sanitizeMessage(message);
  if (!text) throw new Error("empty_message");

  let mentionedUserId: string | null = null;
  if (parentAuthor) {
    const muRows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.name, parentAuthor))
      .limit(1);
    mentionedUserId = muRows[0]?.id ?? null;
  }

  let rootId: string | null = null;
  if (parentId) {
    rootId = await findRootId(parentId);
  }

  const createdRows = await db
    .insert(guestbookTable)
    .values({
      message: text,
      userId: userRow.id,
      parentId: parentId ?? null,
      rootId,
      mentionedUserId,
    })
    .returning({ id: guestbookTable.id });
  const created = createdRows[0];
  if (!created) return;

  if (parentId) {
    const mentionedUsers = alias(users, "mentionedUsers");

    const replyRows = await db
      .select({
        id: guestbookTable.id,
        message: guestbookTable.message,
        createdAt: guestbookTable.createdAt,
        parentId: guestbookTable.parentId,
        rootId: guestbookTable.rootId,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
        mentionedUserName: mentionedUsers.name,
      })
      .from(guestbookTable)
      .leftJoin(users, eq(guestbookTable.userId, users.id))
      .leftJoin(
        mentionedUsers,
        eq(guestbookTable.mentionedUserId, mentionedUsers.id)
      )
      .where(eq(guestbookTable.id, created.id))
      .limit(1);

    const r = replyRows[0];
    if (r) {
      const reply: PublicReply = {
        id: r.id,
        message: r.message,
        createdAt: r.createdAt,
        user: {
          name: r.userName ?? null,
          email: r.userEmail ?? null,
          image: r.userImage ?? null,
        },
        mentionedUser: r.mentionedUserName
          ? { name: r.mentionedUserName ?? null }
          : null,
        likes: [],
        parentId: r.parentId ?? null,
        rootId: r.rootId ?? null,
      };

      emitEvent({ type: "guestbook:reply", parentId, reply });
    }
  } else {
    const newRows = await db
      .select({
        id: guestbookTable.id,
        message: guestbookTable.message,
        createdAt: guestbookTable.createdAt,
        userId: guestbookTable.userId,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
        provider: accounts.provider,
      })
      .from(guestbookTable)
      .leftJoin(users, eq(guestbookTable.userId, users.id))
      .leftJoin(accounts, eq(accounts.userId, users.id))
      .where(eq(guestbookTable.id, created.id))
      .limit(1);

    const e = newRows[0];
    if (e) {
      const entry: PublicEntry = {
        id: e.id,
        message: e.message,
        createdAt: e.createdAt,
        user: {
          name: e.userName ?? null,
          email: e.userEmail ?? null,
          image: e.userImage ?? null,
        },
        provider: e.provider ?? "local",
        likes: [],
        replies: [],
      };

      emitEvent({ type: "guestbook:new", entry });
    }
  }

  revalidatePath("/guestbook");
}

export async function toggleLike(guestbookId: string, userEmail: string) {
  const uRows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, userEmail))
    .limit(1);

  const userRow = uRows[0];
  if (!userRow) throw new Error("user_not_found");

  const existingRows = await db
    .select({
      id: likesTable.id,
    })
    .from(likesTable)
    .where(
      and(
        eq(likesTable.userId, userRow.id),
        eq(likesTable.guestbookId, guestbookId)
      )
    )
    .limit(1);

  const existing = existingRows[0];

  if (existing) {
    await db.delete(likesTable).where(eq(likesTable.id, existing.id));

    emitEvent({
      type: "guestbook:like",
      id: guestbookId,
      userEmail,
      action: "unlike",
    });
  } else {
    await db
      .insert(likesTable)
      .values({ userId: userRow.id, guestbookId })
      .returning({ id: likesTable.id });

    emitEvent({
      type: "guestbook:like",
      id: guestbookId,
      userEmail,
      action: "like",
    });
  }

  revalidatePath("/guestbook");
}
