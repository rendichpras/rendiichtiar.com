"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LanguageSwitcherProps {
  variant?: "default" | "compact"
  className?: string
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations("common.language_switcher")
  const router = useRouter()
  const pathname = usePathname()

  const isCompact = variant === "compact"
  const nextLang = locale === "id" ? "en" : "id"

  const ariaLabel = locale === "id" ? t("aria_to_en") : t("aria_to_id")

  const tooltipText = locale === "id" ? t("tooltip_id") : t("tooltip_en")

  const toggleLanguage = () => {
    router.push(pathname, { locale: nextLang as "id" | "en" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={isCompact ? "icon" : "default"}
            onClick={toggleLanguage}
            className={cn(
              "relative overflow-hidden hover:bg-accent",
              isCompact ? "size-8" : "h-9 min-w-[2.25rem] px-3",
              className
            )}
            aria-label={ariaLabel}
            aria-pressed={locale === "en"}
          >
            <div className="flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={locale}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  <span className="flex h-4 w-4 overflow-hidden ring-1 ring-border/40">
                    <Image
                      src={
                        locale === "id"
                          ? "https://flagcdn.com/id.svg"
                          : "https://flagcdn.com/gb.svg"
                      }
                      alt={
                        locale === "id" ? t("flag_id_alt") : t("flag_en_alt")
                      }
                      className="h-full w-full object-cover"
                      width={16}
                      height={16}
                      unoptimized
                    />
                  </span>
                  {!isCompact && (
                    <span className="text-sm font-medium text-foreground/90">
                      {locale === "id" ? "ID" : "EN"}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
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
