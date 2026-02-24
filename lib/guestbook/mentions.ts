import { db } from "@/db"

export async function resolveMentionedUserIdByName(parentAuthor?: string) {
  if (!parentAuthor) return null

  const user = await db.user.findFirst({
    where: {
      name: { equals: parentAuthor, mode: "insensitive" },
    },
    select: { id: true },
  })

  return user?.id ?? null
}
