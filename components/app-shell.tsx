"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"
import { BackToTop } from "@/components/BackToTop"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <Navigation
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      <div
        className={cn(
          "relative flex min-h-screen flex-col bg-background pt-16 lg:pt-0 transition-all",
          collapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <BackToTop />
      <Toaster richColors closeButton position="top-right" />
    </>
  )
}
