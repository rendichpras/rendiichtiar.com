"use client"

import {
  memo,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/page-transition"
import { BookOpen, GraduationCap, User2 } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n, type Messages } from "@/lib/i18n"

type SectionId = "intro" | "career" | "education"

interface SectionContent {
  id: SectionId
  icon: ComponentType<{ className?: string }>
  titleKey: keyof Messages["pages"]["about"]["sections"]
  content: (props: { messages: Messages }) => ReactNode
}

const SectionNavCard = memo(function SectionNavCard({
  icon: Icon,
  label,
  active,
  onClick,
  delay = 0,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Button
        type="button"
        onClick={onClick}
        variant="ghost"
        className={cn(
          "group w-full justify-start rounded-xl border text-left transition-colors duration-300",
          "border-border/30 bg-card/30 hover:border-border/50 hover:bg-card/50",
          "focus-visible:ring-2 focus-visible:ring-primary/40",
          active &&
            "border-primary/50 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/10"
        )}
      >
        <div className="flex items-center gap-3 text-sm font-medium">
          <Icon
            className={cn(
              "size-5 text-foreground/80 transition-transform group-hover:scale-110",
              active && "text-primary"
            )}
            aria-hidden="true"
          />
          <span className="truncate">{label}</span>
        </div>
      </Button>
    </motion.div>
  )
})

function EducationItem({
  src,
  name,
  major,
  period,
  location,
  sizes = "(max-width: 640px) 48px, 56px",
}: {
  src: string
  name: string
  major: string
  period: string
  location: string
  sizes?: string
}) {
  return (
    <Card className="rounded-xl border-border/30 bg-card/30 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50 hover:bg-card/50">
      <CardContent>
        <div className="flex items-start gap-4 sm:items-center">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/30 bg-background/50 p-2 sm:size-14">
            <Image
              src={src}
              alt={name}
              fill
              sizes={sizes}
              className="object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-base font-semibold leading-tight text-transparent sm:text-lg">
              {name}
            </h3>

            <p className="text-xs text-foreground/80 sm:text-sm">{major}</p>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>{period}</span>
              <span aria-hidden="true">•</span>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const sections: readonly SectionContent[] = [
  {
    id: "intro",
    icon: User2,
    titleKey: "intro",
    content: ({ messages }) => (
      <Card className="rounded-xl border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {messages.pages.about.sections.intro}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {messages.pages.about.intro.headline}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
          {[
            messages.pages.about.intro.greeting,
            messages.pages.about.intro.bio1,
            messages.pages.about.intro.bio2,
            messages.pages.about.intro.bio3,
            messages.pages.about.intro.bio4,
            messages.pages.about.intro.bio5,
          ].map((t, i) => (
            <p key={i}>{t}</p>
          ))}

          <p className="text-sm text-muted-foreground">
            {messages.pages.about.intro.closing}
          </p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "career",
    icon: BookOpen,
    titleKey: "career",
    content: ({ messages }) => (
      <Card className="rounded-xl border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {messages.pages.about.sections.career}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {messages.pages.about.career.headline}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 text-center text-sm text-muted-foreground sm:text-base">
          {messages.pages.about.career.empty}
        </CardContent>
      </Card>
    ),
  },
  {
    id: "education",
    icon: GraduationCap,
    titleKey: "education",
    content: ({ messages }) => (
      <Card className="rounded-xl border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {messages.pages.about.sections.education}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {messages.pages.about.education.headline}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <EducationItem
            src="/upb.png"
            name={messages.pages.about.education.upb.name}
            major={messages.pages.about.education.upb.major}
            period={messages.pages.about.education.upb.period}
            location={messages.pages.about.education.upb.location}
          />

          <EducationItem
            src="/smkhsagung.png"
            name={messages.pages.about.education.smk.name}
            major={messages.pages.about.education.smk.major}
            period={messages.pages.about.education.smk.period}
            location={messages.pages.about.education.smk.location}
          />
        </CardContent>
      </Card>
    ),
  },
] as const

export function AboutContent() {
  const { messages } = useI18n()
  const [activeSection, setActiveSection] = useState<SectionId>("intro")

  const nav = sections.map((s, i) => ({
    id: s.id,
    label: messages.pages.about.sections[s.titleKey],
    icon: s.icon,
    delay: i * 0.1,
  }))

  const contentById = useMemo(
    () =>
      Object.fromEntries(sections.map((s) => [s.id, s.content])) as Record<
        SectionId,
        SectionContent["content"]
      >,
    []
  )

  return (
    <PageTransition>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <header className="max-w-2xl space-y-2">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              {messages.pages.about.title}
            </h1>

            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.pages.about.subtitle}
            </p>
          </header>

          <Separator className="my-6 bg-border/40" />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {nav.map(({ id, label, icon, delay }) => (
              <SectionNavCard
                key={id}
                icon={icon}
                label={label}
                active={activeSection === id}
                onClick={() => setActiveSection(id)}
                delay={delay}
              />
            ))}
          </div>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {contentById[activeSection]({ messages })}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
