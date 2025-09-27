"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Github, Instagram, Linkedin, Mail, Facebook, Video } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { z } from "zod"
import { useI18n, type Messages } from "@/lib/i18n"

type SocialKey = keyof Messages["contact"]["social"]

type SocialLink = {
  icon: LucideIcon
  labelKey: SocialKey
  href: string
  color: string
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { icon: Mail, labelKey: "email", href: "mailto:rendichpras@gmail.com", color: "bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20" },
  { icon: Linkedin, labelKey: "linkedin", href: "https://linkedin.com/in/rendiichtiar", color: "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20" },
  { icon: Facebook, labelKey: "facebook", href: "https://facebook.com/rendiichtiar", color: "bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20" },
  { icon: Instagram, labelKey: "instagram", href: "https://instagram.com/rendiichtiar", color: "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20" },
  {
    icon: Github,
    labelKey: "github",
    href: "https://github.com/rendichpras",
    color: "bg-[#181717]/10 text-[#181717] hover:bg-[#181717]/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
  },
] as const

type FormData = { name: string; email: string; message: string }
type FormErrors = Partial<Record<keyof FormData, string>>

function makeContactSchema(messages: Messages) {
  return z.object({
    name: z.string().min(2, messages.contact.form.validation.name),
    email: z.string().email(messages.contact.form.validation.email),
    message: z.string().min(10, messages.contact.form.validation.message),
  })
}

function SocialLinkCard({
  icon: Icon,
  label,
  href,
  color,
  delay,
}: {
  icon: LucideIcon
  label: string
  href: string
  color: string
  delay: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="block" aria-label={label} title={label}>
        <Card className={cn("group cursor-pointer bg-card/50 backdrop-blur-sm p-3", "flex items-center gap-3", "border-border/30 transition-all duration-300 hover:border-border/50")}>
          <div className="flex flex-row items-center gap-2">
            <div className={cn("size-8 shrink-0 rounded-lg flex items-center justify-center transition-colors duration-300", color)}>
              <Icon className="size-4" aria-hidden />
            </div>
            <span className="text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary">{label}</span>
          </div>
        </Card>
      </a>
    </motion.div>
  )
}

function InfoRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/70" aria-hidden />
      <span>{text}</span>
    </div>
  )
}

export function ContactContent() {
  const { messages } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const contactSchema = useMemo(() => makeContactSchema(messages), [messages])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!res.ok) throw new Error(data?.message || messages.contact.form.error.general)
      setFormData({ name: "", email: "", message: "" })
      toast.success(messages.contact.form.success)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        for (const issue of err.errors) {
          const field = issue.path[0] as keyof FormData
          if (!fieldErrors[field]) fieldErrors[field] = issue.message
          toast.error(issue.message)
        }
        setErrors(fieldErrors)
      } else {
        toast.error(messages.contact.form.error.general)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {messages.contact.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">{messages.contact.subtitle}</p>
          </div>

          <Separator className="my-6 bg-border/40" />

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{messages.contact.social.title}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {SOCIAL_LINKS.map((s, i) => (
                <SocialLinkCard
                  key={s.labelKey}
                  icon={s.icon}
                  label={messages.contact.social[s.labelKey]}
                  href={s.href}
                  color={s.color}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{messages.contact.call.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{messages.contact.call.subtitle}</p>
                  <div className="flex flex-wrap gap-4">
                    <InfoRow icon={Video} text={messages.contact.call.platform} />
                    <InfoRow icon={Calendar} text={messages.contact.call.duration} />
                  </div>
                </div>
                <Button asChild size="lg" className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                  <a href="https://cal.com/rendiichtiar" target="_blank" rel="noopener noreferrer">
                    {messages.contact.call.button}
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">{messages.contact.form.title}</h2>
            <Card className="border-border/30 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
              <form className="space-y-4" onSubmit={handleSubmit} aria-busy={isLoading} noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground/90">
                      {messages.contact.form.name.label}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={messages.contact.form.name.placeholder}
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.name || undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-destructive">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground/90">
                      {messages.contact.form.email.label}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={messages.contact.form.email.placeholder}
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.email || undefined}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground/90">
                    {messages.contact.form.message.label}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={messages.contact.form.message.placeholder}
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    aria-invalid={!!errors.message || undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{messages.contact.form.response_time}</p>
                  <Button type="submit" size="lg" className="ml-auto bg-primary/10 text-primary hover:bg-primary/20" disabled={isLoading}>
                    {isLoading ? messages.contact.form.sending : messages.contact.form.send}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
