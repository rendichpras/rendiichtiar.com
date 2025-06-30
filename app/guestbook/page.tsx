import { getServerSession } from "next-auth/next"
import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/guestbook/GuestbookList"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageTransition } from "../components/page-transition"

export default async function GuestbookPage() {
  const session = await getServerSession()

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section - Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Buku Tamu</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Silahkan isi buku tamu dengan pesan, saran, pertanyaan, atau apa saja yang ingin Anda sampaikan!
                </p>
              </div>

              <Separator className="bg-border/60" />

              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm">Masuk sebagai</span>
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        {session.user?.name}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <SignOutButton />
                    </div>
                  </div>
                  <GuestbookForm />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Silahkan masuk untuk memulai. Jangan khawatir, data Anda aman.
                  </p>
                  <SignInButton />
                </div>
              )}
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