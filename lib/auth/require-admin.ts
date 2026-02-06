import { currentUser } from "@clerk/nextjs/server"
import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/routing"

export async function requireAdmin(shouldRedirect = false) {
  const user = await currentUser()
  if (!user) {
    if (shouldRedirect) {
      const locale = await getLocale()
      redirect({ href: "/sign-in", locale })
    }
    throw new Error("unauthorized")
  }

  const adminClerkId = process.env.ADMIN_CLERK_ID || ""

  if (!adminClerkId) {
    if (process.env.NODE_ENV === "production") {
      if (shouldRedirect) {
        const locale = await getLocale()
        redirect({ href: "/", locale })
      }
      throw new Error("forbidden")
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase()
    if (!adminEmail) {
      if (shouldRedirect) {
        const locale = await getLocale()
        redirect({ href: "/", locale })
      }
      throw new Error("forbidden")
    }

    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ""

    if (email.toLowerCase() !== adminEmail) {
      if (shouldRedirect) {
        const locale = await getLocale()
        redirect({ href: "/", locale })
      }
      throw new Error("forbidden")
    }
    return { email }
  }

  if (user.id !== adminClerkId) {
    if (shouldRedirect) {
      const locale = await getLocale()
      redirect({ href: "/", locale })
    }
    throw new Error("forbidden")
  }

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    ""

  return { email }
}
