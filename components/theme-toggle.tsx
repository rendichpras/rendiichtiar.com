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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative size-9 rounded-full",
          variant === "compact" && "size-8",
          className
        )}
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all" />
      </Button>
    )
  }

  const isCompact = variant === "compact"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative overflow-hidden",
        isCompact ? "size-8" : "size-9",
        "rounded-full hover:bg-accent",
        className
      )}
      aria-label={messages.theme.toggle}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 0 : 1,
          opacity: theme === "dark" ? 0 : 1,
          rotate: theme === "dark" ? -45 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="size-4 text-yellow-500" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 45
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="size-4 text-primary" />
      </motion.div>
    </Button>
  )
} 