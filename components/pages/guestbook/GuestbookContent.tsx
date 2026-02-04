"use client"

import { memo } from "react"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"

import { useTranslations } from "next-intl"

import { SignInButton } from "@/components/auth/SignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { GuestbookForm } from "@/components/pages/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/pages/guestbook/GuestbookList"
import {
  AuthBarSkeleton,
  FormCardSkeleton,
} from "@/components/pages/guestbook/GuestbookSkeleton"

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

const AuthBar = memo(function AuthBar({
  isSignedIn,
  name,
  email,
  image,
  signInMessage,
}: {
  isSignedIn: boolean
  name: string
  email: string
  image: string
  signInMessage: string
}) {
  if (isSignedIn) {
    const initial = (name || "G").charAt(0).toUpperCase()

    return (
      <Card className="border-border/30 bg-card transition-colors duration-300 hover:border-border/50">
        <CardContent className="flex items-start gap-4">
          <Avatar className="size-10 border-2 border-border/30">
            <AvatarImage src={image} alt={name} />
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
    <Card className="border-border/30 bg-card transition-colors duration-300 hover:border-border/50">
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

export function GuestbookContent() {
  const t = useTranslations("pages.guestbook")
  const { isLoaded, isSignedIn, user } = useUser()

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    ""
  const name = user?.fullName || user?.username || "Guest"
  const image = user?.imageUrl || ""

  return (
    <>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="max-w-2xl space-y-2"
            >
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: { opacity: 1, scaleX: 1 },
              }}
            >
              <Separator className="bg-border/40" />
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="space-y-6"
              >
                {!isLoaded ? (
                  <AuthBarSkeleton />
                ) : (
                  <AuthBar
                    isSignedIn={!!isSignedIn}
                    name={name}
                    email={email}
                    image={image}
                    signInMessage={t("auth.sign_in_message")}
                  />
                )}

                {!isLoaded ? (
                  <FormCardSkeleton />
                ) : (
                  isSignedIn && (
                    <Card className="border-border/30 bg-card transition-colors duration-300 hover:border-border/50">
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold text-foreground sm:text-base">
                          {t("title")}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                          {t("subtitle")}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <GuestbookForm />
                      </CardContent>
                    </Card>
                  )
                )}
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden border-border/30 bg-card transition-colors duration-300 hover:border-border/50 lg:h-[calc(100vh-8rem)]">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-foreground sm:text-base">
                      {t("list.title")}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                      {t("list.subtitle")}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0">
                    <ScrollArea className="h-full pr-2">
                      <GuestbookList />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
