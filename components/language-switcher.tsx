"use client"

import Image from "next/image"
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
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 overflow-hidden rounded-sm ring-1 ring-border/40">
                  <Image
                    src={
                      language === "id"
                        ? "https://flagcdn.com/id.svg"
                        : "https://flagcdn.com/gb.svg"
                    }
                    alt={
                      language === "id"
                        ? messages.common.language_switcher.flag_id_alt
                        : messages.common.language_switcher.flag_en_alt
                    }
                    className="h-full w-full object-cover"
                    width={16}
                    height={16}
                    unoptimized
                  />
                </span>
                {!isCompact && (
                  <span className="text-sm font-medium text-foreground/90">
                    {language === "id" ? "ID" : "EN"}
                  </span>
                )}
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
