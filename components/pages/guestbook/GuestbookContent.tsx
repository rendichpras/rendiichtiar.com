"use client"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"

import { useTranslations } from "next-intl"

import { SignInButton } from "@/components/auth/SignInButton"

import { GuestbookForm } from "@/components/pages/guestbook/GuestbookForm"
import { GuestbookList } from "@/components/pages/guestbook/GuestbookList"
import { FormCardSkeleton } from "@/components/pages/guestbook/GuestbookSkeleton"

import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

export function GuestbookContent() {
  const t = useTranslations("pages.guestbook")
  const { isLoaded, isSignedIn } = useUser()

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
              <Separator className="bg-border" />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid gap-6"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                {!isLoaded ? (
                  <FormCardSkeleton />
                ) : isSignedIn ? (
                  <GuestbookForm />
                ) : (
                  <Card className="border-border bg-card transition-colors duration-300 hover:border-primary">
                    <CardContent className="flex flex-col gap-4">
                      <div className="text-sm text-muted-foreground">
                        {t("auth.sign_in_message")}
                      </div>
                      <SignInButton />
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <GuestbookList />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
