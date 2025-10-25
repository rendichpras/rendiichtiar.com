"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ExitIcon } from "@radix-ui/react-icons"

export function SignOutButton() {
  return (
    <Button
      type="button"
      onClick={() => signOut()}
      variant="outline"
      size="sm"
      className="group flex items-center gap-2 rounded-xl border-border/30 text-xs font-medium text-muted-foreground hover:border-border/50 hover:text-primary sm:text-sm"
      aria-label="Keluar"
    >
      <span>Keluar</span>
      <ExitIcon
        className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden="true"
      />
    </Button>
  )
}
