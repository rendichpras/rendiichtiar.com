import { z } from "zod"

export const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(255, "Title must be less than 255 characters."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
  excerpt: z.string().optional(),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  published: z.boolean().default(false),
})

export type BlogInput = z.infer<typeof blogSchema>
