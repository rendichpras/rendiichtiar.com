"use client"

import { memo, useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/page-transition"
import { BookOpen, GraduationCap, User2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n, type Messages } from "@/lib/i18n"

/**
 * AboutContent (refactored)
 * Goals:
 * - Stronger typing for section config & active state
 * - Reusable SectionNavCard component
 * - next/image for logos & a11y polish (decorative icons -> aria-hidden)
 * - Tailwind consistency (spacing, borders, transitions)
 */

type SectionId = "intro" | "career" | "education"

interface SectionContent {
  id: SectionId
  icon: React.ComponentType<{ className?: string }>
  titleKey: keyof Messages["about"]["sections"]
  content: (props: { messages: Messages }) => React.ReactNode
}

const SectionNavCard = memo(function SectionNavCard({
  icon: Icon,
  label,
  active,
  onClick,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
  delay?: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
        className={cn(
          "group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 outline-none",
          "border-border/30 hover:border-border/50 focus:ring-2 focus:ring-primary/40",
          active && "bg-primary/10 text-primary border-primary/50 hover:border-primary/50"
        )}
        aria-pressed={active}
      >
        <div className="flex items-center gap-3 text-sm font-medium">
          <Icon className="size-5 transition-transform group-hover:scale-110" aria-hidden />
          <span>{label}</span>
        </div>
      </Card>
    </motion.div>
  )
})

const sections: readonly SectionContent[] = [
  {
    id: "intro",
    icon: User2,
    titleKey: "intro",
    content: ({ messages }) => (
      <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <div className="space-y-4">
          {[messages.about.intro.greeting, messages.about.intro.bio1, messages.about.intro.bio2, messages.about.intro.bio3, messages.about.intro.bio4, messages.about.intro.bio5].map((t, i) => (
            <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/90">
              {t}
            </p>
          ))}
          <p className="text-sm text-muted-foreground">{messages.about.intro.closing}</p>
        </div>
      </Card>
    ),
  },
  {
    id: "career",
    icon: BookOpen,
    titleKey: "career",
    content: ({ messages }) => (
      <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            {messages.about.career.empty}
          </p>
        </div>
      </Card>
    ),
  },
  {
    id: "education",
    icon: GraduationCap,
    titleKey: "education",
    content: ({ messages }) => (
      <Card className="p-6 space-y-4 border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
        {/* UPB */}
        <Card className="p-4 border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:bg-card/50">
          <div className="flex items-start sm:items-center gap-4">
            <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border border-border/30 relative">
              <Image
                src="/upb.png"
                alt={messages.about.education.upb.name}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                priority={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {messages.about.education.upb.name}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80">{messages.about.education.upb.major}</p>
              <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap items-center gap-1.5">
                <span>{messages.about.education.upb.period}</span>
                <span aria-hidden>•</span>
                <span>{messages.about.education.upb.location}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* SMK */}
        <Card className="p-4 border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:bg-card/50">
          <div className="flex items-start sm:items-center gap-4">
            <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border border-border/30 relative">
              <Image
                src="/smkhsagung.png"
                alt={messages.about.education.smk.name}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                priority={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {messages.about.education.smk.name}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80">{messages.about.education.smk.major}</p>
              <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap items-center gap-1.5">
                <span>{messages.about.education.smk.period}</span>
                <span aria-hidden>•</span>
                <span>{messages.about.education.smk.location}</span>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    ),
  },
] as const

export function AboutContent() {
  const { messages } = useI18n()
  const [activeSection, setActiveSection] = useState<SectionId>("intro")

  // Stable list for nav rendering
  const nav = useMemo(
    () =>
      sections.map((s, i) => ({
        id: s.id,
        label: messages.about.sections[s.titleKey],
        icon: s.icon,
        delay: i * 0.1,
      })),
    [messages]
  )

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          {/* Header */}
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {messages.about.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">{messages.about.subtitle}</p>
          </div>

          <Separator className="my-6 bg-border/40" />

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
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

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {sections.find((s) => s.id === activeSection)?.content({ messages })}
          </motion.div>
        </section>
      </main>
    </PageTransition>
  )
}
