"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  variant?: "default" | "compact"
  className?: string
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, messages } = useI18n()
  const isCompact = variant === "compact"
  const nextLang = language === "id" ? "en" : "id"

  const ariaLabel =
    language === "id"
      ? messages.common.language_switcher.aria_to_en
      : messages.common.language_switcher.aria_to_id

  const tooltipText =
    language === "id"
      ? messages.common.language_switcher.tooltip_id
      : messages.common.language_switcher.tooltip_en

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={isCompact ? "icon" : "default"}
            onClick={() => setLanguage(nextLang)}
            className={cn(
              "relative overflow-hidden rounded-full hover:bg-accent",
              isCompact ? "size-8" : "h-9 min-w-[2.25rem] px-3",
              className
            )}
            aria-label={ariaLabel}
            aria-pressed={language === "en"}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                y: language === "id" ? 0 : -30,
                opacity: language === "id" ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 overflow-hidden rounded-sm ring-1 ring-border/40">
                  <img
                    src="https://flagcdn.com/id.svg"
                    alt={messages.common.language_switcher.flag_id_alt}
                    className="h-full w-full object-cover"
                  />
                </span>
                {!isCompact && (
                  <span className="text-sm font-medium text-foreground/90">
                    ID
                  </span>
                )}
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                y: language === "en" ? 0 : 30,
                opacity: language === "en" ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 overflow-hidden rounded-sm ring-1 ring-border/40">
                  <img
                    src="https://flagcdn.com/gb.svg"
                    alt={messages.common.language_switcher.flag_en_alt}
                    className="h-full w-full object-cover"
                  />
                </span>
                {!isCompact && (
                  <span className="text-sm font-medium text-foreground/90">
                    EN
                  </span>
                )}
              </div>
            </motion.div>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="top">
          <p className="text-xs font-medium text-foreground">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
