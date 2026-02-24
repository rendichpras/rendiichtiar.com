import { db } from "@/db"

type RootLookup = {
  id: string
  parentId: string | null
  rootId: string | null
}

export async function resolveGuestbookRootId(parentId: string) {
  let current: RootLookup | null = await db.guestbookEntry.findUnique({
    where: { id: parentId },
    select: { id: true, parentId: true, rootId: true },
  })

  if (!current) return null
  if (current.rootId) return current.rootId

  while (current.parentId) {
    const next: RootLookup | null = await db.guestbookEntry.findUnique({
      where: { id: current.parentId },
      select: { id: true, parentId: true, rootId: true },
    })

    if (!next) break
    if (next.rootId) return next.rootId
    current = next
  }

  return current.id
}
