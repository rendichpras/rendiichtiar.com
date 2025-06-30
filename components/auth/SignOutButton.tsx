"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ExitIcon } from "@radix-ui/react-icons"

export function SignOutButton() {
  return (
    <Button
      onClick={() => signOut()}
      variant="outline"
      size="sm"
      className="relative group border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/30"
    >
      <span className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          Keluar
        </span>
        <ExitIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5 duration-300" />
      </span>
    </Button>
  )
} 