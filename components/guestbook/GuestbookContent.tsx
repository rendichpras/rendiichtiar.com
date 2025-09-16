"use client"

import type { Session } from "next-auth"
import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/guestbook/GuestbookList"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "@/components/animations/page-transition"
import { useI18n } from "@/lib/i18n"

interface Props {
  session?: Session | null
}

export function GuestbookContent({ session }: Props) {
  const { messages } = useI18n()
  const user = session?.user
  const displayName = user?.name || "Guest"
  const displayEmail = user?.email || ""

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          {/* Header */}
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {messages.guestbook.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {messages.guestbook.subtitle}
            </p>
          </div>

          <Separator className="my-6 bg-border/40" />

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
            {/* Form Section - Left */}
            <div className="space-y-6">
              {session ? (
                <div className="flex items-center gap-4">
                  <Avatar className="size-10 border-2 border-border/30">
                    <AvatarImage src={user?.image || ""} alt={displayName} />
                    <AvatarFallback aria-hidden>
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground/90">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {displayEmail}
                        </p>
                      </div>
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    {messages.guestbook.auth.sign_in_message}
                  </p>
                  <SignInButton />
                </div>
              )}

              {session && <GuestbookForm />}
            </div>

            {/* Messages Section - Right */}
            <div className="h-[calc(100vh-12rem)] overflow-hidden lg:h-[calc(100vh-8rem)]">
              <GuestbookList />
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
