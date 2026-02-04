import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

export const locales = ["en", "id"] as const

export const routing = defineRouting({
  locales,
  defaultLocale: "id",
  localePrefix: "always",
})

export const navigation = createNavigation(routing)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  navigation
