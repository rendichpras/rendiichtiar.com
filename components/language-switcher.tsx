"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LanguageSwitcherProps {
  variant?: "default" | "compact"
  className?: string
}

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n()
  const isCompact = variant === "compact"
  const next = language === "id" ? "en" : "id"

  return (
    <Button
      variant="ghost"
      size={isCompact ? "icon" : "default"}
      onClick={() => setLanguage(next)}
      className={cn(
        "relative overflow-hidden rounded-full hover:bg-accent",
        isCompact ? "size-8" : "h-9 min-w-[2.25rem]",
        className
      )}
      aria-label={`Switch to ${language === "id" ? "English" : "Bahasa Indonesia"}`}
      aria-pressed={language === "en"}
      title={language.toUpperCase()}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ y: language === "id" ? 0 : -30, opacity: language === "id" ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-4 w-4">
            <img src="https://flagcdn.com/id.svg" alt="Bahasa Indonesia" className="rounded-sm object-cover" />
          </div>
          {!isCompact && <span className="text-sm font-medium">ID</span>}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ y: language === "en" ? 0 : 30, opacity: language === "en" ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-4 w-4">
            <img src="https://flagcdn.com/gb.svg" alt="English" className="rounded-sm object-cover" />
          </div>
          {!isCompact && <span className="text-sm font-medium">EN</span>}
        </div>
      </motion.div>
    </Button>
  )
}
