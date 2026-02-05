import { z } from "zod"

const ALLOWED_COVER_IMAGE_HOSTS = [
  "rendiichtiar.com",
  "www.rendiichtiar.com",
  "img.clerk.com",
] as const

function isAllowedCoverImageUrl(value: string) {
  if (!value) return true

  if (value.startsWith("/")) return true

  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return false
    return (ALLOWED_COVER_IMAGE_HOSTS as readonly string[]).includes(
      url.hostname
    )
  } catch {
    return false
  }
}

export const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(255, "Title must be less than 255 characters."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
  excerpt: z.string().optional(),
  coverImage: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => isAllowedCoverImageUrl(value ?? ""), {
      message:
        "Cover image must be a relative path or an https URL from an allowed host.",
    }),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  published: z.boolean().default(false),
})

export type BlogInput = z.infer<typeof blogSchema>
