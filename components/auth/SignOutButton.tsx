"use client"

import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

export function SignOutButton() {
  const t = useTranslations("common")
  const clerk = useClerk()
  const locale = useLocale()

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg border-border/30 text-xs hover:border-border/50"
      onClick={() => void clerk.signOut({ redirectUrl: `/${locale}` })}
    >
      {t("auth.logout.title")}
    </Button>
  )
}
