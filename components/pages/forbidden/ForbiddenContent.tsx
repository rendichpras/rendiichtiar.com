"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { motion } from "framer-motion"

export function ForbiddenContent() {
  const router = useRouter()
  const t = useTranslations("common")
  const locale = useLocale()

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
            className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center lg:min-h-[calc(100vh-8rem)]"
          >
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="relative"
              >
                <h1 className="text-7xl font-bold text-primary/20 sm:text-8xl md:text-9xl">
                  403
                </h1>

                <div
                  className="absolute -top-6 right-0 text-5xl sm:text-6xl"
                  aria-hidden="true"
                >
                  🚫
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="space-y-4 text-center"
              >
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {t("error.forbidden.heading")}
                </h2>

                <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
                  {t("error.forbidden.message")}
                </p>

                <Button
                  size="lg"
                  onClick={() => router.push(`/${locale}`)}
                  className="rounded-xl border border-border bg-secondary text-primary hover:bg-secondary/80"
                >
                  {t("error.forbidden.back_home")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
