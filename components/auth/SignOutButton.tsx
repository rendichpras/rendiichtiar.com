"use client"

import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function SignOutButton() {
  const { messages } = useI18n()
  const clerk = useClerk()

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-lg border-border/30 text-xs hover:border-border/50"
      onClick={() => void clerk.signOut({ redirectUrl: "/" })}
    >
      {messages.common.auth.logout.title}
    </Button>
  )
}
