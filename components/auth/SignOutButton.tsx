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
      className="group relative bg-background/50 border-primary/20 backdrop-blur-sm hover:border-primary/30"
      aria-label="Keluar"
    >
      <span className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">Keluar</span>
        <ExitIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:translate-x-0.5 group-hover:text-primary duration-300" />
      </span>
    </Button>
  )
}
