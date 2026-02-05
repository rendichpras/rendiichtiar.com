"use client"

import {
  memo,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, User2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

type SectionId = "intro" | "career" | "education"

interface SectionContent {
  id: SectionId
  icon: ComponentType<{ className?: string }>
  titleKey: string
  content: (props: { t: (key: string) => string }) => ReactNode
}

const SectionNavCard = memo(function SectionNavCard({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <div>
      <Button
        type="button"
        onClick={onClick}
        variant="ghost"
        className={cn(
          "group w-full justify-start rounded-xl border text-left transition-colors duration-300",
          "border-border bg-card hover:border-primary hover:bg-accent",
          "focus-visible:ring-2 focus-visible:ring-primary",
          active &&
            "border-primary bg-secondary text-primary hover:border-primary hover:bg-secondary"
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
    </div>
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
    <Card className="rounded-xl border-border bg-card text-foreground transition-colors duration-300 hover:border-primary hover:bg-accent">
      <CardContent>
        <div className="flex items-start gap-4 sm:items-center">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-background p-2 sm:size-14">
            <Image
              src={src}
              alt={name}
              fill
              sizes={sizes}
              className="object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-tight text-foreground sm:text-lg">
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
    titleKey: "sections.intro",
    content: ({ t }) => (
      <Card className="rounded-xl border-border bg-card text-foreground transition-colors duration-300 hover:border-primary">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {t("sections.intro")}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {t("intro.headline")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
          {[
            t("intro.greeting"),
            t("intro.bio1"),
            t("intro.bio2"),
            t("intro.bio3"),
            t("intro.bio4"),
            t("intro.bio5"),
          ].map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <p className="text-sm text-muted-foreground">{t("intro.closing")}</p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "career",
    icon: BookOpen,
    titleKey: "sections.career",
    content: ({ t }) => (
      <Card className="rounded-xl border-border bg-card text-foreground transition-colors duration-300 hover:border-primary">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {t("sections.career")}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {t("career.headline")}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground sm:text-base">
          {t("career.empty")}
        </CardContent>
      </Card>
    ),
  },
  {
    id: "education",
    icon: GraduationCap,
    titleKey: "sections.education",
    content: ({ t }) => (
      <Card className="rounded-xl border-border bg-card text-foreground transition-colors duration-300 hover:border-primary">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            {t("sections.education")}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {t("education.headline")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <EducationItem
            src="/upb.png"
            name={t("education.upb.name")}
            major={t("education.upb.major")}
            period={t("education.upb.period")}
            location={t("education.upb.location")}
          />

          <EducationItem
            src="/smkhsagung.png"
            name={t("education.smk.name")}
            major={t("education.smk.major")}
            period={t("education.smk.period")}
            location={t("education.smk.location")}
          />
        </CardContent>
      </Card>
    ),
  },
] as const

export function AboutContent() {
  const t = useTranslations("pages.about")
  const [activeSection, setActiveSection] = useState<SectionId>("intro")

  const nav = sections.map((s) => ({
    id: s.id,
    label: t(s.titleKey),
    icon: s.icon,
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
    <>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
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
              className="max-w-2xl space-y-2"
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
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
            >
              {nav.map(({ id, label, icon }) => (
                <SectionNavCard
                  key={id}
                  icon={icon}
                  label={label}
                  active={activeSection === id}
                  onClick={() => setActiveSection(id)}
                />
              ))}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="mt-6"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {contentById[activeSection]({ t })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
