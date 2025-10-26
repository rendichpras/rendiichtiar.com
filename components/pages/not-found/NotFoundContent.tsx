"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { useI18n } from "@/lib/i18n"

export function NotFoundContent() {
  const router = useRouter()
  const { messages } = useI18n()

  return (
    <PageTransition>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center lg:min-h-[calc(100vh-8rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-6 sm:space-y-8"
            >
              <div className="relative">
                <motion.h1
                  className="text-7xl font-bold text-primary/20 sm:text-8xl md:text-9xl"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.15,
                  }}
                >
                  404
                </motion.h1>

                <motion.div
                  className="absolute -top-6 right-0 text-5xl sm:text-6xl"
                  initial={{ rotate: -45 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  aria-hidden="true"
                >
                  👻
                </motion.div>
              </div>

              <div className="space-y-4 text-center">
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {messages.common.error.not_found.heading}
                </h2>

                <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
                  {messages.common.error.not_found.message}
                </p>

                <Button
                  size="lg"
                  onClick={() => router.push("/")}
                  className="rounded-xl border border-border/30 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {messages.common.error.not_found.back_home}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
