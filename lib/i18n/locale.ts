import { routing, locales } from "@/i18n/routing"

export type AppLocale = (typeof locales)[number]

export function isSupportedLocale(locale: string): locale is AppLocale {
  return routing.locales.includes(locale as AppLocale)
}

export function getSafeLocaleFromFormData(
  formData: FormData,
  fallback: string
) {
  const raw = formData.get("locale")
  const value = typeof raw === "string" ? raw : ""
  return isSupportedLocale(value) ? value : fallback
}
