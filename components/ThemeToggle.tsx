"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface ThemeToggleProps {
  className?: string
  variant?: "default" | "compact"
}

export function ThemeToggle({
  className,
  variant = "default",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const t = useTranslations("common")

  const isCompact = variant === "compact"
  const isDark = theme === "dark"

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative rounded-full hover:bg-accent",
          isCompact ? "size-8" : "size-9",
          className
        )}
        aria-label={t("theme.toggle")}
      >
        <span className="size-4" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "relative overflow-hidden rounded-full hover:bg-accent",
              isCompact ? "size-8" : "size-9",
              className
            )}
            aria-label={t("theme.toggle")}
            aria-pressed={isDark}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme === "dark" ? "dark" : "light"}
                initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <Moon className="size-4 text-primary" aria-hidden="true" />
                ) : (
                  <Sun className="size-4 text-primary" aria-hidden="true" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="top">
          <p className="text-xs">
            {isDark ? t("theme.current_dark") : t("theme.current_light")}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
