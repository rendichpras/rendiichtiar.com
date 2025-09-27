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
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center lg:min-h-[calc(100vh-8rem)]">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 sm:space-y-8">
                <div className="relative">
                  <motion.h1
                    className="text-8xl font-bold text-primary/20 sm:text-9xl"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  >
                    404
                  </motion.h1>
                  <motion.div
                    className="absolute -top-6 right-0 text-6xl"
                    initial={{ rotate: -45 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    aria-hidden
                  >
                    👻
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{messages.error.not_found.heading}</h2>
                  <p className="mx-auto max-w-lg text-muted-foreground">{messages.error.not_found.message}</p>
                  <Button size="lg" onClick={() => router.push("/")} className="bg-primary/10 text-primary hover:bg-primary/20">
                    {messages.error.not_found.back_home}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
