"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/i18n"
import { SiGithub, SiGoogle } from "react-icons/si"

export function SignInButton() {
  const { messages } = useI18n()

  return (
    <div className="flex w-full flex-col gap-3">
      <Button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/guestbook" })}
        variant="outline"
        className="w-full justify-center gap-2 rounded-xl border-border/30 text-sm font-medium hover:border-border/50"
        aria-label={messages.common.auth.login.google}
      >
        <SiGoogle className="h-4 w-4 text-foreground" aria-hidden="true" />
        <span>{messages.common.auth.login.google}</span>
      </Button>

      <div className="relative flex items-center">
        <Separator className="bg-border/60" />
        <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] uppercase text-muted-foreground">
          {messages.common.auth.login.or}
        </span>
      </div>

      <Button
        type="button"
        onClick={() => signIn("github", { callbackUrl: "/guestbook" })}
        variant="outline"
        className="w-full justify-center gap-2 rounded-xl border-border/30 text-sm font-medium hover:border-border/50"
        aria-label={messages.common.auth.login.github}
      >
        <SiGithub className="h-4 w-4 text-foreground" aria-hidden="true" />
        <span>{messages.common.auth.login.github}</span>
      </Button>
    </div>
  )
}