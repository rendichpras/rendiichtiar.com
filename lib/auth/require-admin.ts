import { currentUser } from "@clerk/nextjs/server"

export async function requireAdmin() {
  const user = await currentUser()
  if (!user) throw new Error("unauthorized")

  const adminClerkId = process.env.ADMIN_CLERK_ID || ""
  const adminEmail = process.env.ADMIN_EMAIL || ""

  if (adminClerkId) {
    if (user.id !== adminClerkId) throw new Error("forbidden")
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ""
    return { email }
  }

  if (!adminEmail) throw new Error("forbidden")

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
