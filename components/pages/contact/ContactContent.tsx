"use client"

import { useMemo, useState } from "react"
import { PageTransition } from "@/components/animations/page-transition"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Video } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { useI18n, type Messages } from "@/lib/i18n"

type ContactFormData = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>

function makeContactSchema(messages: Messages) {
  return z.object({
    name: z.string().min(2, messages.pages.contact.form.validation.name),
    email: z.string().email(messages.pages.contact.form.validation.email),
    message: z.string().min(10, messages.pages.contact.form.validation.message),
  })
}

function InfoRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/70" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export function ContactContent() {
  const { messages } = useI18n()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const contactSchema = useMemo(() => makeContactSchema(messages), [messages])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validated = contactSchema.parse(formData)

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          data?.message || messages.pages.contact.form.error.general
        )
      }

      setFormData({ name: "", email: "", message: "" })
      toast.success(messages.pages.contact.form.success)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}

        for (const issue of err.issues) {
          const field = issue.path[0] as keyof ContactFormData
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message
          }
          toast.error(issue.message)
        }

        setErrors(fieldErrors)
      } else {
        toast.error(messages.pages.contact.form.error.general)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pl-64 lg:pt-0">
        <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 xl:px-24">
          {/* Page heading */}
          <header className="max-w-3xl space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {messages.pages.contact.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.pages.contact.subtitle}
            </p>
          </header>

          <Separator className="my-6 bg-border/40" />

          {/* Call / meeting card */}
          <Card className="border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {messages.pages.contact.call.title}
                  </CardTitle>

                  <CardDescription className="text-sm text-muted-foreground">
                    {messages.pages.contact.call.subtitle}
                  </CardDescription>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <InfoRow
                      icon={Video}
                      text={messages.pages.contact.call.platform}
                    />
                    <InfoRow
                      icon={Calendar}
                      text={messages.pages.contact.call.duration}
                    />
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="shrink-0 self-start rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <a
                    href="https://cal.com/rendiichtiar"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {messages.pages.contact.call.button}
                  </a>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Message form card */}
          <Card className="mt-8 border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                {messages.pages.contact.form.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {messages.pages.contact.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handleSubmit}
                aria-busy={isLoading}
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground/90"
                    >
                      {messages.pages.contact.form.name.label}
                    </Label>

                    <Input
                      id="name"
                      name="name"
                      placeholder={messages.pages.contact.form.name.placeholder}
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.name || undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="rounded-xl border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary"
                    />

                    {errors.name ? (
                      <p id="name-error" className="text-xs text-destructive">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground/90"
                    >
                      {messages.pages.contact.form.email.label}
                    </Label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={
                        messages.pages.contact.form.email.placeholder
                      }
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.email || undefined}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className="rounded-xl border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary"
                    />

                    {errors.email ? (
                      <p id="email-error" className="text-xs text-destructive">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground/90"
                  >
                    {messages.pages.contact.form.message.label}
                  </Label>

                  <Textarea
                    id="message"
                    name="message"
                    placeholder={
                      messages.pages.contact.form.message.placeholder
                    }
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    aria-invalid={!!errors.message || undefined}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className="rounded-xl border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary"
                  />

                  {errors.message ? (
                    <p id="message-error" className="text-xs text-destructive">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {/* Submit */}
                <div className="flex items-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="ml-auto rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {isLoading
                      ? messages.pages.contact.form.sending
                      : messages.pages.contact.form.send}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </PageTransition>
  )
}
