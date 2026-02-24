"use client"

import { memo } from "react"
import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import {
  FADE_IN_VARIANTS,
  FADE_UP_VARIANTS,
  SCALE_X_VARIANTS,
} from "@/lib/animations"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { MapPin, MonitorUp, MessageCircle } from "lucide-react"
import {
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiPostgresql,
  SiPrisma,
  SiNextdotjs,
  SiReact,
  SiJavascript,
  SiNginx,
  SiDocker,
  SiMongodb,
} from "react-icons/si"
import { VscCode } from "react-icons/vsc"
import type { IconType } from "react-icons"

interface TechItem {
  name: string
  icon: IconType
}

const TECH_STACK: readonly TechItem[] = [
  { name: "TypeScript", icon: SiTypescript },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "TailwindCSS", icon: SiTailwindcss },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Prisma", icon: SiPrisma },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Nginx", icon: SiNginx },
  { name: "Docker", icon: SiDocker },
  { name: "MongoDB", icon: SiMongodb },
  { name: "VS Code", icon: VscCode },
] as const

const TechPill = memo(function TechPill({ name, icon: Icon }: TechItem) {
  return (
    <Badge
      variant="outline"
      className="mx-1 flex items-center gap-2 border-border bg-background px-4 py-1.5 text-muted-foreground transition-colors duration-300 hover:border-foreground/20 hover:bg-accent hover:text-foreground"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-base font-medium leading-none">{name}</span>
    </Badge>
  )
})

interface MarqueeRowProps {
  reverse?: boolean
  durationSeconds: number
}

const MarqueeRow = memo(function MarqueeRow({
  reverse,
  durationSeconds,
}: MarqueeRowProps) {
  const items = TECH_STACK.map((t, idx) => (
    <TechPill key={`${t.name}-${idx}`} {...t} />
  ))

  return (
    <div className="relative">
      <Marquee
        duration={durationSeconds}
        reverse={reverse}
        pauseOnHover
        className="py-1"
      >
        {items}
      </Marquee>
    </div>
  )
})

export default function HomeContent() {
  const t = useTranslations("pages.home")

  return (
    <>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <motion.div
            variants={FADE_IN_VARIANTS}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            <motion.div
              variants={FADE_UP_VARIANTS}
              className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
            >
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 md:h-32 md:w-32">
                <div className="relative h-full w-full overflow-hidden border-2 border-primary/10 bg-card transition-all duration-300 hover:border-primary/30">
                  <Image
                    src="/avatar.jpg"
                    alt={t("profile_alt")}
                    priority
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                    {t("greeting")}
                  </h1>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4 sm:text-base">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="h-4 w-4 text-primary/70"
                        aria-hidden="true"
                      />
                      <span>{t("location")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MonitorUp
                        className="h-4 w-4 text-primary/70"
                        aria-hidden="true"
                      />
                      <span>{t("remote_worker")}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t("bio")}
                </p>
              </div>
            </motion.div>

            <motion.div variants={SCALE_X_VARIANTS}>
              <Separator className="bg-border/40" />
            </motion.div>

            <motion.div
              variants={FADE_UP_VARIANTS}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  {t("tech_stack")}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {t("tech_stack_desc")}
                </p>
              </div>

              <div className="space-y-2">
                <MarqueeRow durationSeconds={60} />
              </div>
            </motion.div>

            <motion.div variants={SCALE_X_VARIANTS}>
              <Separator className="bg-border/40" />
            </motion.div>

            <motion.div
              variants={FADE_UP_VARIANTS}
              className="space-y-8 sm:space-y-12"
            >
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  {t("work_title")}
                </h2>

                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                  {t("work_desc")}
                </p>
              </div>

              <Card className="border-border/30 bg-card text-foreground transition-colors duration-300 hover:border-border/50">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle
                      className="h-5 w-5 text-primary/70"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg font-semibold text-foreground sm:text-xl">
                      {t("lets_work")}
                    </CardTitle>
                  </div>

                  <CardDescription className="text-sm text-muted-foreground sm:text-base">
                    {t("work_cta")}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button
                    asChild
                    className="border border-border/30 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <a href="mailto:rendichpras@gmail.com">{t("contact_me")}</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
