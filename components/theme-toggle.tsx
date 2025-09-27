"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { motion } from "framer-motion"

interface ThemeToggleProps {
  className?: string
  variant?: "default" | "compact"
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { messages } = useI18n()
  const isCompact = variant === "compact"

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("relative rounded-full", isCompact ? "size-8" : "size-9", className)}>
        <Sun className="size-4 rotate-0 scale-100 transition-all" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("relative overflow-hidden rounded-full hover:bg-accent", isCompact ? "size-8" : "size-9", className)}
      aria-label={messages.theme.toggle}
      aria-pressed={isDark}
      title={isDark ? "Dark" : "Light"}
    >
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? -45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="size-4 text-yellow-500" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 45 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="size-4 text-primary" />
      </motion.div>
    </Button>
  )
}
