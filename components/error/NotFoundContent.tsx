"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"

export function NotFoundContent() {
  const router = useRouter()

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
        <section className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-8rem)] text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="relative">
                  <motion.h1 
                    className="text-8xl sm:text-9xl font-bold text-primary/20"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
                  >
                    404
                  </motion.h1>
                  <motion.div
                    className="absolute -top-6 right-0 text-6xl"
                    initial={{ rotate: -45 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    👻
                  </motion.div>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">Halaman Tidak Ditemukan</h2>
                  <p className="text-muted-foreground">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router.push("/")}
                  >
                    Kembali ke Beranda
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