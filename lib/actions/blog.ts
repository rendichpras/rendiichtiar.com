"use server"

import { revalidatePath } from "next/cache"
import { getLocale } from "next-intl/server"
import { db } from "@/db"
import { Prisma } from "@/db/generated/client"
import { requireAdmin } from "@/lib/auth/require-admin"
import { sanitizeHtml } from "@/lib/security/sanitize-html"
import { blogSchema } from "@/lib/validations/blog"
import { redirect } from "@/i18n/routing"
import { routing, locales } from "@/i18n/routing"

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function getSafeLocaleFromFormData(formData: FormData, fallback: string) {
  const raw = formData.get("locale")
  const value = typeof raw === "string" ? raw : ""
  return routing.locales.includes(value as (typeof locales)[number])
    ? value
    : fallback
}

export type CreatePostState = {
  errors?: {
    title?: string[]
    content?: string[]
    excerpt?: string[]
    coverImage?: string[]
    published?: string[]
    slug?: string[]
    _form?: string[]
  }
  message: string
}

export async function createPost(
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  await requireAdmin()

  const locale = getSafeLocaleFromFormData(formData, await getLocale())

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    coverImage: formData.get("coverImage") as string,
    published: formData.get("published") === "on",
    slug: (formData.get("slug") as string | undefined) || undefined,
  }

  if (!rawData.slug) delete rawData.slug

  const result = blogSchema.safeParse(rawData)
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Validation Error. Failed to Create Post.",
    }
  }

  const {
    title,
    content,
    excerpt,
    coverImage,
    published,
    slug: slugInput,
  } = result.data

  const sanitizedContent = sanitizeHtml(content)
  let slug = slugInput || generateSlug(title)

  const existingPost = await db.post.findUnique({ where: { slug } })
  if (existingPost) {
    slug = `${slug}-${Date.now()}`
  }

  try {
    await db.post.create({
      data: {
        title,
        slug,
        content: sanitizedContent,
        excerpt,
        coverImage,
        published,
      },
    })
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Database Error: Failed to Create Post.",
    }
  }

  revalidatePath(`/${locale}/blog`)
  revalidatePath(`/${locale}/admin/blog`)

  redirect({ href: "/admin/blog", locale })
  return { message: "Redirecting..." }
}

export async function updatePost(
  id: string,
  prevState: CreatePostState,
  formData: FormData
) {
  await requireAdmin()

  const locale = getSafeLocaleFromFormData(formData, await getLocale())

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    coverImage: formData.get("coverImage") as string,
    published: formData.get("published") === "on",
    slug: (formData.get("slug") as string | undefined) || undefined,
  }

  if (!rawData.slug) delete rawData.slug

  const result = blogSchema.safeParse(rawData)
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Validation Error. Failed to Update Post.",
    }
  }

  const {
    title,
    content,
    excerpt,
    coverImage,
    published,
    slug: slugInput,
  } = result.data

  const sanitizedContent = sanitizeHtml(content)
  const slug = slugInput || generateSlug(title)

  try {
    await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        content: sanitizedContent,
        excerpt,
        coverImage,
        published,
      },
    })
  } catch {
    return { message: "Failed to update post" }
  }

  revalidatePath(`/${locale}/blog`)
  revalidatePath(`/${locale}/blog/${slug}`)

  revalidatePath(`/${locale}/admin/blog`)
  revalidatePath(`/${locale}/admin/blog/${id}`)

  return { message: "Updated successfully" }
}

export async function deletePost(id: string, locale?: string) {
  await requireAdmin()

  try {
    await db.post.delete({ where: { id } })

    const safeLocale =
      locale && routing.locales.includes(locale as (typeof locales)[number])
        ? locale
        : await getLocale()

    revalidatePath(`/${safeLocale}/blog`)
    revalidatePath(`/${safeLocale}/admin/blog`)

    return { message: "Deleted Post" }
  } catch {
    return { message: "Failed to delete post" }
  }
}

export async function getPostBySlug(slug: string) {
  return await db.post.findFirst({
    where: {
      slug,
      published: true,
    },
  })
}

export async function getAllPosts(
  publishedOnly = true,
  query?: string,
  page = 1,
  pageSize = 9
) {
  if (!publishedOnly) {
    await requireAdmin()
  }

  const where: Prisma.PostWhereInput = publishedOnly ? { published: true } : {}

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
    ]
  }

  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.post.count({ where }),
  ])

  return {
    posts,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}

export async function getPostById(id: string) {
  await requireAdmin()

  return await db.post.findUnique({
    where: { id },
  })
}
