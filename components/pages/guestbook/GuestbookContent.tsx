"use client"

import { memo } from "react"
import type { Session } from "next-auth"
import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/pages/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/pages/guestbook/GuestbookList"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "@/components/animations/page-transition"
import { useI18n } from "@/lib/i18n"

interface Props {
  session?: Session | null
}

const AuthBar = memo(function AuthBar({
  session,
  signInMessage,
}: {
  session?: Session | null
  signInMessage: string
}) {
  if (session) {
    const user = session.user
    const name = user?.name || "Guest"
    const email = user?.email || ""
    const initial = name.charAt(0).toUpperCase()

    return (
      <div className="flex items-center gap-4">
        <Avatar className="size-10 border-2 border-border/30">
          <AvatarImage src={user?.image || ""} alt={name} />
          <AvatarFallback aria-hidden>{initial}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/90">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/30 p-4">
      <p className="text-sm text-muted-foreground">{signInMessage}</p>
      <SignInButton />
    </div>
  )
})

export function GuestbookContent({ session }: Props) {
  const { messages } = useI18n()

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {messages.guestbook.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">{messages.guestbook.subtitle}</p>
          </div>

          <Separator className="my-6 bg-border/40" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
            <div className="space-y-6">
              <AuthBar session={session} signInMessage={messages.guestbook.auth.sign_in_message} />
              {session && <GuestbookForm />}
            </div>

            <div className="h-[calc(100vh-12rem)] overflow-hidden lg:h-[calc(100vh-8rem)]">
              <GuestbookList />
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
