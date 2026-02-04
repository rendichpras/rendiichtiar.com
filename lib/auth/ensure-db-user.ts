import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"

export async function ensureDbUser() {
  const user = await currentUser()
  if (!user) throw new Error("unauthorized")

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress

  if (!email) throw new Error("missing_email")

  const provider =
    user.externalAccounts?.[0]?.provider?.toString() ??
    user.externalAccounts?.[0]?.verification?.strategy?.toString() ??
    "clerk"

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.fullName ||
    null

  const image = user.imageUrl ?? null

  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    create: {
      clerkId: user.id,
      email,
      name,
      imageUrl: image,
      authProvider: provider,
    },
    update: {
      email,
      name,
      imageUrl: image,
      authProvider: provider,
    },
    select: {
      id: true,
      email: true,
      name: true,
      imageUrl: true,
      authProvider: true,
    },
  })

  return dbUser
}
