"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Session } from "next-auth";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const calcReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

function makeExcerpt(markdown: string, maxLen = 200) {
  const plain = markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_>#\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen - 1).trimEnd() + "…";
}

async function requireSession(): Promise<{
  userId: string;
  isAdmin: boolean;
}> {
  const session = (await auth()) as Session | null;
  if (!session?.user?.email) throw new Error("unauthorized");

  let userId = (session.user as any).id as string | undefined;
  if (!userId) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!u) throw new Error("unauthorized");
    userId = u.id;
  }

  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  return { userId, isAdmin };
}

async function requireAdmin(): Promise<{ userId: string }> {
  const { userId, isAdmin } = await requireSession();
  if (!isAdmin) throw new Error("forbidden");
  return { userId };
}

async function upsertTags(names: string[]) {
  const unique = Array.from(
    new Set(names.map((n) => n.trim()).filter(Boolean))
  );

  const ids: string[] = [];
  for (const name of unique) {
    const slug = slugify(name);
    const t = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
      select: { id: true },
    });
    ids.push(t.id);
  }
  return ids;
}

export async function createPost(input: {
  title: string;
  content: string;
  coverUrl?: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt?: Date | null;
}) {
  const { userId } = await requireAdmin();

  const slug = slugify(input.title);
  const readingTime = calcReadingTime(input.content);
  const excerpt = makeExcerpt(input.content);
  const tagIds = input.tags?.length ? await upsertTags(input.tags) : [];

  const normalizedStatus = input.status ?? "DRAFT";

  const post = await prisma.post.create({
    data: {
      slug,
      title: input.title,
      excerpt,
      content: input.content,
      coverUrl: input.coverUrl ?? null,
      status: normalizedStatus,
      publishedAt:
        input.publishedAt ??
        (normalizedStatus === "PUBLISHED" ? new Date() : null),
      readingTime,
      authorId: userId,
      tags: tagIds.length
        ? {
            createMany: {
              data: tagIds.map((tagId) => ({ tagId })),
            },
          }
        : undefined,
    },
    select: { id: true, slug: true },
  });

  revalidateTag("posts");
  revalidatePath("/blog");
  return post;
}

export async function updatePost(
  id: string,
  input: {
    title?: string;
    content?: string;
    coverUrl?: string | null;
    tags?: string[];
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
    publishedAt?: Date | null;
  }
) {
  await requireAdmin();

  const data: any = {};

  if (typeof input.title === "string" && input.title.trim()) {
    data.title = input.title.trim();
    data.slug = slugify(input.title);
  }

  if (typeof input.content === "string") {
    data.content = input.content;
    data.readingTime = calcReadingTime(input.content);
    data.excerpt = makeExcerpt(input.content);
  }

  if (input.coverUrl !== undefined) {
    data.coverUrl = input.coverUrl || null;
  }

  if (input.status) {
    data.status = input.status;
    if (input.status === "PUBLISHED" && !input.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  if (input.publishedAt !== undefined) {
    data.publishedAt = input.publishedAt;
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (input.tags) {
      const tagIds = await upsertTags(input.tags);
      await tx.postTag.deleteMany({ where: { postId: id } });
      if (tagIds.length) {
        await tx.postTag.createMany({
          data: tagIds.map((tagId) => ({ postId: id, tagId })),
        });
      }
    }

    return tx.post.update({
      where: { id },
      data,
    });
  });

  revalidateTag("posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  return updated;
}

export async function deletePost(id: string) {
  await requireAdmin();
  const p = await prisma.post.delete({ where: { id } });
  revalidateTag("posts");
  revalidatePath("/blog");
  return p;
}

export async function publishPost(id: string) {
  await requireAdmin();
  const p = await prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
    select: { slug: true },
  });
  revalidateTag("posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${p.slug}`);
  return p;
}

export async function getPosts(input?: {
  tag?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, input?.page ?? 1);
  const pageSize = Math.min(20, Math.max(1, input?.pageSize ?? 10));

  const where: any = { status: "PUBLISHED" as const };
  if (input?.tag) {
    where.tags = { some: { tag: { slug: input.tag } } };
  }

  const [items, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } }, author: true },
  });
}

export async function incrementView(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}

async function findRootId(commentId: string): Promise<string> {
  let cur: {
    id: string;
    parentId: string | null;
    rootId: string | null;
  } | null = await prisma.postComment.findUnique({
    where: { id: commentId },
    select: { id: true, parentId: true, rootId: true },
  });

  if (!cur) return commentId;
  if (!cur.parentId) return cur.id;
  if (cur.rootId) return cur.rootId;

  let pid: string | null = cur.parentId;
  while (pid) {
    const parentRes: { id: string; parentId: string | null } | null =
      await prisma.postComment.findUnique({
        where: { id: pid },
        select: { id: true, parentId: true },
      });
    if (!parentRes) break;
    if (!parentRes.parentId) return parentRes.id;
    pid = parentRes.parentId;
  }
  return cur.id;
}

export async function addPostComment(input: {
  postId: string;
  message: string;
  parentId?: string | null;
  parentAuthor?: string | null;
}) {
  const { userId } = await requireSession();
  const text = input.message.trim().slice(0, 280);
  if (!text) throw new Error("empty_message");

  const rootId = input.parentId ? await findRootId(input.parentId) : null;

  let mentionedUserId: string | null = null;
  if (input.parentAuthor) {
    const u = await prisma.user.findFirst({
      where: { name: input.parentAuthor },
      select: { id: true },
    });
    mentionedUserId = u?.id ?? null;
  }

  const c = await prisma.postComment.create({
    data: {
      postId: input.postId,
      userId,
      message: text,
      parentId: input.parentId ?? null,
      rootId,
      mentionedUserId,
    },
  });

  const slugObj = await prisma.post.findUnique({
    where: { id: input.postId },
    select: { slug: true },
  });
  if (slugObj?.slug) revalidatePath(`/blog/${slugObj.slug}`);

  return c;
}

export async function getPostComments(postId: string) {
  return prisma.postComment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, image: true } },
      mentionedUser: { select: { name: true } },
    },
  });
}
