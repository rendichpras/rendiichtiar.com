"use client"

import { useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
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
import { useTranslations } from "next-intl"

type ContactFormData = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>

function makeContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("form.validation.name")),
    email: z.string().email(t("form.validation.email")),
    message: z.string().min(10, t("form.validation.message")),
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
  const t = useTranslations("pages.contact")
  const tGuestbook = useTranslations("pages.guestbook")

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const contactSchema = useMemo(() => makeContactSchema(t), [t])

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
        const errorCode = data?.error
        let errorMessage = t("form.error.general")

        if (errorCode === "forbidden_words") {
          errorMessage = tGuestbook("form.forbidden_words")
        } else if (errorCode === "rate_limit_exceeded") {
          errorMessage = t("form.error.rate_limit")
        } else if (typeof errorCode === "string") {
          errorMessage = errorCode
        }

        throw new Error(errorMessage)
      }

      setFormData({ name: "", email: "", message: "" })
      toast.success(t("form.success"))
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
      } else if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error(t("form.error.general"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 py-0 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.header
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="max-w-3xl space-y-2"
            >
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t("subtitle")}
              </p>
            </motion.header>

            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: { opacity: 1, scaleX: 1 },
              }}
            >
              <Separator className="bg-border" />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Card className="border-border bg-card text-foreground transition-colors duration-300 hover:border-primary">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {t("call.title")}
                      </CardTitle>

                      <CardDescription className="text-sm text-muted-foreground">
                        {t("call.subtitle")}
                      </CardDescription>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <InfoRow icon={Video} text={t("call.platform")} />
                        <InfoRow icon={Calendar} text={t("call.duration")} />
                      </div>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="shrink-0 self-start rounded-xl bg-secondary text-primary hover:bg-secondary/80"
                    >
                      <a
                        href="https://cal.com/rendiichtiar"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("call.button")}
                      </a>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Card className="border-border bg-card text-foreground transition-colors duration-300 hover:border-primary">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("form.title")}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {t("subtitle")}
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
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground/90"
                        >
                          {t("form.name.label")}
                        </Label>

                        <Input
                          id="name"
                          name="name"
                          placeholder={t("form.name.placeholder")}
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading}
                          aria-invalid={!!errors.name || undefined}
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          className="rounded-xl border-border bg-card transition-colors duration-300 hover:border-primary focus-visible:ring-primary"
                        />

                        {errors.name ? (
                          <p
                            id="name-error"
                            className="text-xs text-destructive"
                          >
                            {errors.name}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground/90"
                        >
                          {t("form.email.label")}
                        </Label>

                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t("form.email.placeholder")}
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          aria-invalid={!!errors.email || undefined}
                          aria-describedby={
                            errors.email ? "email-error" : undefined
                          }
                          className="rounded-xl border-border bg-card transition-colors duration-300 hover:border-primary focus-visible:ring-primary"
                        />

                        {errors.email ? (
                          <p
                            id="email-error"
                            className="text-xs text-destructive"
                          >
                            {errors.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground/90"
                      >
                        {t("form.message.label")}
                      </Label>

                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t("form.message.placeholder")}
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.message || undefined}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        className="rounded-xl border-border/30 bg-card transition-colors duration-300 hover:border-border/50 focus-visible:ring-primary"
                      />

                      {errors.message ? (
                        <p
                          id="message-error"
                          className="text-xs text-destructive"
                        >
                          {errors.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="ml-auto rounded-xl bg-secondary text-primary hover:bg-secondary/80"
                      >
                        {isLoading ? t("form.sending") : t("form.send")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
