"use client"

import { useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { addGuestbookEntry } from "@/lib/actions/guestbook"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const MAX_LEN = 280

export function GuestbookForm() {
  const { isSignedIn } = useUser()
  const t = useTranslations("pages.guestbook")

  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const remainingChars = useMemo(
    () => Math.max(0, MAX_LEN - message.length),
    [message]
  )

  if (!isSignedIn) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim()) {
      toast.error(t("form.empty_error"))
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addGuestbookEntry(message)

      if (!result.success) {
        if (result.error === "forbidden_words") {
          toast.error(t("form.forbidden_words"))
        } else if (result.error === "message_too_long") {
          toast.error(t("form.too_long"))
        } else if (result.error === "rate_limit_exceeded") {
          toast.error(t("form.rate_limit"))
        } else {
          toast.error(t("form.error"))
        }
        return
      }

      setMessage("")
      toast.success(t("form.success"))

      window.dispatchEvent(new CustomEvent("guestbook:refresh"))
    } catch {
      toast.error(t("form.error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      noValidate
      aria-busy={isSubmitting}
    >
      <div className="relative space-y-1">
        <Label htmlFor="guestbook-message" className="sr-only">
          {t("form.placeholder")}
        </Label>

        <Textarea
          id="guestbook-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("form.placeholder")}
          maxLength={MAX_LEN}
          disabled={isSubmitting}
          className={cn(
            "min-h-[44px] resize-none pr-12 rounded-xl border-border/30 bg-card transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary"
          )}
        />

        <span
          className={cn(
            "absolute bottom-2 right-3 text-xs tabular-nums",
            remainingChars <= 20 ? "text-destructive" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {remainingChars}
        </span>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "relative rounded-xl bg-primary/10 text-primary hover:bg-primary/20",
            isSubmitting && "cursor-wait opacity-80"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{t("form.sending")}</span>
            </span>
          ) : (
            t("form.send")
          )}
        </Button>
      </div>
    </form>
  )
}
