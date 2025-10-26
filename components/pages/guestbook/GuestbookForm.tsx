"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

import { addGuestbookEntry } from "@/app/guestbook/guestbook";
import {
  containsForbiddenWords,
  getForbiddenWords,
} from "@/lib/constants/forbidden-words";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MAX_LEN = 280;

export function GuestbookForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { messages } = useI18n();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);

  const remainingChars = useMemo(
    () => Math.max(0, MAX_LEN - message.length),
    [message]
  );

  if (!session) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setMessage(v);
    setForbiddenWords(containsForbiddenWords(v) ? getForbiddenWords(v) : []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error(messages.pages.guestbook.form.empty_error);
      return;
    }
    if (!session.user?.email) {
      toast.error(messages.pages.guestbook.form.session_error);
      return;
    }

    setIsSubmitting(true);

    try {
      await addGuestbookEntry(message, session.user.email);
      setMessage("");
      setForbiddenWords([]);
      toast.success(messages.pages.guestbook.form.success);
      router.refresh();
    } catch {
      toast.error(messages.pages.guestbook.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBlocked = forbiddenWords.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      noValidate
      aria-busy={isSubmitting}
    >
      <div className="relative space-y-1">
        <Label htmlFor="guestbook-message" className="sr-only">
          {messages.pages.guestbook.form.placeholder}
        </Label>

        <Textarea
          id="guestbook-message"
          value={message}
          onChange={handleChange}
          placeholder={messages.pages.guestbook.form.placeholder}
          maxLength={MAX_LEN}
          disabled={isSubmitting}
          className={cn(
            "min-h-[44px] resize-none pr-12 rounded-xl border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary",
            isBlocked && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={isBlocked || undefined}
          aria-describedby={isBlocked ? "forbidden-hint" : undefined}
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

      {isBlocked && (
        <Alert
          id="forbidden-hint"
          variant="destructive"
          className="rounded-xl border-destructive/30 bg-destructive/5 p-3 text-destructive"
        >
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-sm leading-relaxed text-destructive">
            {messages.pages.guestbook.form.forbidden_words}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isBlocked}
          className={cn(
            "relative rounded-xl bg-primary/10 text-primary hover:bg-primary/20",
            isSubmitting && "cursor-wait opacity-80"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{messages.pages.guestbook.form.sending}</span>
            </span>
          ) : (
            messages.pages.guestbook.form.send
          )}
        </Button>
      </div>
    </form>
  );
}