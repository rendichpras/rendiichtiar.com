"use client"

import { memo } from "react"
import type { Session } from "next-auth"

import { PageTransition } from "@/components/animations/page-transition"
import { useI18n } from "@/lib/i18n"

import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/pages/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/pages/guestbook/GuestbookList"

import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <CardContent className="flex items-start gap-4">
          <Avatar className="size-10 border-2 border-border/30">
            <AvatarImage src={user?.image || ""} alt={name} />
            <AvatarFallback className="text-sm font-medium text-foreground/90">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground/90">
                  {name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>

              <SignOutButton />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/30 bg-card/30 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground/90">
          {signInMessage}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignInButton />
      </CardContent>
    </Card>
  )
})

export function GuestbookContent({ session }: Props) {
  const { messages } = useI18n()

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pt-0 lg:pl-64">
        <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 xl:px-24">
          <div className="max-w-2xl space-y-2">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              {messages.guestbook.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.guestbook.subtitle}
            </p>
          </div>

          <Separator className="my-6 bg-border/40" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
            <div className="space-y-6">
              <AuthBar
                session={session}
                signInMessage={messages.guestbook.auth.sign_in_message}
              />

              {session && (
                <Card className="border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-foreground sm:text-base">
                      {messages.guestbook.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                      {messages.guestbook.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <GuestbookForm />
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="h-[calc(100vh-12rem)] overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 lg:h-[calc(100vh-8rem)]">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-foreground sm:text-base">
                  {messages.guestbook.list.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                  {messages.guestbook.list.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <ScrollArea className="max-h-[60vh] pr-2">
                  <GuestbookList />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}