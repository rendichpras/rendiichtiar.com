"use client"

import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/guestbook/GuestbookList"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "@/components/animations/page-transition"

export function GuestbookContent({ session }: { session: any }) {
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          {/* Header */}
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Buku Tamu</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tinggalkan pesan, kesan, atau saran Anda di buku tamu saya.
            </p>
          </div>

          <Separator className="my-6 bg-border/60" />

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
            {/* Form Section - Left Column */}
            <div className="space-y-6">
              {session ? (
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Masuk untuk mengirim pesan di buku tamu
                  </p>
                  <SignInButton />
                </div>
              )}

              {session && <GuestbookForm />}
            </div>

            {/* Messages Section - Right Column */}
            <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] overflow-hidden">
              <GuestbookList />
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
} 