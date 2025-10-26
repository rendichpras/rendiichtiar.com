"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import { LoginDialog } from "@/components/auth/LoginDialog"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { useI18n } from "@/lib/i18n"

type CommentVM = {
  id: string
  createdAt: string | Date
  message: string
  user: { name: string | null }
  parentId?: string | null
  rootId?: string | null
}

function toDate(input: string | Date | null | undefined) {
  if (!input) return null
  return input instanceof Date ? input : new Date(input)
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase()
  }
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function PostComments({
  comments,
  onSubmit,
}: {
  comments: CommentVM[]
  onSubmit: (fd: FormData) => Promise<void>
}) {
  const { data: session } = useSession()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { messages } = useI18n()

  const isAuthed = Boolean(session?.user)
  const displayName = session?.user?.name ?? "Anon"

  return (
    <section aria-labelledby="comments-heading" className="space-y-4">
      <Card
        className={cn(
          "rounded-xl border border-border/30 bg-background text-foreground shadow-sm",
          "transition-colors duration-300 hover:border-border/50"
        )}
      >
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2
                id="comments-heading"
                className="text-base font-semibold text-foreground sm:text-lg"
              >
                {messages.components.postComments.heading}
              </h2>

              {isAuthed ? (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {messages.components.postComments.logged_in_as}{" "}
                  <span className="font-medium text-foreground">
                    {displayName}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {messages.components.postComments.must_login}
                </p>
              )}
            </div>

            {isAuthed ? <SignOutButton /> : null}
          </div>

          {isAuthed ? (
            <form
              action={onSubmit}
              className="space-y-3"
              aria-label="new-comment"
            >
              <div className="space-y-2">
                <Label htmlFor="message" className="sr-only">
                  {messages.components.postComments.placeholder}
                </Label>

                <Textarea
                  id="message"
                  name="message"
                  required
                  maxLength={280}
                  placeholder={messages.components.postComments.placeholder}
                  className={cn(
                    "min-h-[90px] resize-none rounded-xl border-border/30 bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground"
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="rounded-xl border-border/30 text-xs font-medium hover:border-border/50 sm:text-sm"
              >
                {messages.components.postComments.send}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="w-fit rounded-xl border-border/30 text-xs font-medium hover:border-border/50 sm:text-sm"
                onClick={() => setShowLoginDialog(true)}
                aria-label={messages.components.postComments.login_btn}
              >
                {messages.components.postComments.login_btn}
              </Button>

              <p className="text-[11px] text-muted-foreground sm:text-xs">
                {messages.components.postComments.login_safe}
              </p>
            </div>
          )}

          <Separator className="bg-border/30" />

          <ScrollArea className="max-h-[360px] pr-2" aria-label="comments-list">
            <ul role="list" className="space-y-4">
              {comments.map((c) => {
                const created = toDate(c.createdAt)
                const name = c.user?.name ?? "Anon"
                const isChild = c.parentId && c.parentId !== c.rootId

                return (
                  <li
                    key={c.id}
                    className={cn(
                      "flex gap-3 rounded-xl border border-border/30 bg-background/50 p-3",
                      "transition-colors duration-300 hover:border-border/50",
                      isChild
                        ? "ml-6 border-l-2 border-l-border/40 pl-4"
                        : "ml-0"
                    )}
                  >
                    <Avatar className="mt-1 size-8 shrink-0 border border-border/30">
                      <AvatarImage src="" alt={name} />
                      <AvatarFallback className="text-[10px] font-medium">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="text-sm font-medium text-foreground">
                          {name}
                        </span>

                        {created ? (
                          <time
                            dateTime={created.toISOString()}
                            className="text-[10px] text-muted-foreground sm:text-xs"
                          >
                            {created.toLocaleString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        ) : null}
                      </div>

                      <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                        {c.message}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </section>
  )
}
