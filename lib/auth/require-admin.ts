import { currentUser } from "@clerk/nextjs/server"

export async function requireAdmin() {
  const user = await currentUser()
  if (!user) throw new Error("unauthorized")

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    ""

  if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new Error("forbidden")
  }

  return { email }
}
