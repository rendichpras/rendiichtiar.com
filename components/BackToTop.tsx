"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations("common")

  useEffect(() => {
    if (typeof window === "undefined") return

    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-label={t("back_to_top.aria_label")}
            className={cn(
              "fixed bottom-8 right-8 z-50 translate-y-16 border-border bg-background transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-background",
              "opacity-0",
              visible && "translate-y-0 opacity-100"
            )}
          >
            <ArrowUp className="h-5 w-5 text-foreground" aria-hidden="true" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="left" className="text-xs font-medium">
          {t("back_to_top.tooltip")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
