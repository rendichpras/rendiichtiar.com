"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { Prisma } from "@/db/generated/client"
import { blogSchema } from "@/lib/validations/blog"

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export type CreatePostState = {
  errors?: {
    title?: string[]
    content?: string[]
    _form?: string[]
  }
  message: string
}

export async function createPost(
  prevState: CreatePostState,
  formData: FormData
) {
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    coverImage: formData.get("coverImage") as string,
    published: formData.get("published") === "on",
    slug: formData.get("slug") as string | undefined,
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
        content,
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

  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function updatePost(
  id: string,
  prevState: CreatePostState,
  formData: FormData
) {
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    coverImage: formData.get("coverImage") as string,
    published: formData.get("published") === "on",
    slug: formData.get("slug") as string | undefined,
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

  const slug = slugInput || generateSlug(title)

  try {
    await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
      },
    })
  } catch {
    return { message: "Failed to update post" }
  }

  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
  revalidatePath("/admin/blog")
  return { message: "Updated successfully" }
}

export async function deletePost(id: string) {
  try {
    await db.post.delete({ where: { id } })
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return { message: "Deleted Post" }
  } catch {
    return { message: "Failed to delete post" }
  }
}

export async function getPostBySlug(slug: string) {
  return await db.post.findUnique({
    where: { slug },
  })
}

export async function getAllPosts(
  publishedOnly = true,
  query?: string,
  page = 1,
  pageSize = 9
) {
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
  return await db.post.findUnique({
    where: { id },
  })
}
