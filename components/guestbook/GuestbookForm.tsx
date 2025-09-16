"use client"

import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { addGuestbookEntry } from "@/app/actions/guestbook"
import { useRouter } from "next/navigation"
import {
  containsForbiddenWords,
  getForbiddenWords,
} from "@/lib/constants/forbidden-words"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useI18n } from "@/lib/i18n"

const MAX_LEN = 280

export function GuestbookForm() {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([])
  const router = useRouter()
  const { messages } = useI18n()

  // PENTING: panggil useMemo SELALU (sebelum early return) agar urutan hooks stabil
  const remainingChars = useMemo(() => Math.max(0, MAX_LEN - message.length), [message])

  // Jika parent sudah mengondisikan <GuestbookForm /> hanya saat session ada,
  // blok ini sebenarnya tidak diperlukan. Namun kalau ingin tetap aman:
  if (!session) return null

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    if (containsForbiddenWords(newMessage)) {
      setForbiddenWords(getForbiddenWords(newMessage))
    } else {
      setForbiddenWords([])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim()) {
      toast.error(messages.guestbook.form.empty_error)
      return
    }
    if (!session.user?.email) {
      toast.error(messages.guestbook.form.session_error)
      return
    }

    setIsSubmitting(true)
    try {
      await addGuestbookEntry(message, session.user.email)
      setMessage("")
      setForbiddenWords([])
      toast.success(messages.guestbook.form.success)
      router.refresh()
    } catch {
      toast.error(messages.guestbook.form.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isBlocked = forbiddenWords.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={message}
          onChange={handleChange}
          placeholder={messages.guestbook.form.placeholder}
          className={`min-h-[35px] resize-none border-border/30 pr-12 transition-all duration-300 hover:border-border/50 focus-visible:ring-primary ${
            isBlocked ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          maxLength={MAX_LEN}
          aria-invalid={isBlocked || undefined}
          aria-describedby={isBlocked ? "forbidden-hint" : undefined}
        />
        <span
          className={`absolute bottom-2 right-2 text-xs ${
            remainingChars <= 20 ? "text-destructive" : "text-muted-foreground"
          }`}
          aria-live="polite"
        >
          {remainingChars}
        </span>
      </div>

      {isBlocked && (
        <Alert
          id="forbidden-hint"
          variant="destructive"
          className="border-destructive/30 bg-destructive/5 py-2"
        >
          <div className="flex items-center gap-2 text-sm">
            <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
            <AlertDescription>
              {messages.guestbook.form.forbidden_words}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isBlocked}
          className="relative bg-primary/10 text-primary hover:bg-primary/20"
        >
          {isSubmitting ? (
            <>
              <svg
                className="absolute left-3 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="pl-6">{messages.guestbook.form.sending}</span>
            </>
          ) : (
            messages.guestbook.form.send
          )}
        </Button>
      </div>
    </form>
  )
}
