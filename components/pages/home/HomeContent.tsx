"use client";

import { memo, type CSSProperties } from "react";
import Image from "next/image";
import { PageTransition } from "@/components/animations/page-transition";
import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { MapPin, MonitorUp, MessageCircle } from "lucide-react";
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
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import type { IconType } from "react-icons";

interface TechItem {
  name: string;
  icon: IconType;
  colorClass: string;
}

const TECH_STACK: readonly TechItem[] = [
  { name: "TypeScript", icon: SiTypescript, colorClass: "text-primary" },
  { name: "Node.js", icon: SiNodedotjs, colorClass: "text-[#339933]/90" },
  { name: "TailwindCSS", icon: SiTailwindcss, colorClass: "text-[#06B6D4]/90" },
  { name: "PostgreSQL", icon: SiPostgresql, colorClass: "text-primary/90" },
  { name: "Prisma", icon: SiPrisma, colorClass: "text-foreground/90" },
  { name: "Next.js", icon: SiNextdotjs, colorClass: "text-foreground/90" },
  { name: "React", icon: SiReact, colorClass: "text-[#61DAFB]/90" },
  { name: "JavaScript", icon: SiJavascript, colorClass: "text-[#F7DF1E]/90" },
  { name: "Nginx", icon: SiNginx, colorClass: "text-[#009639]/90" },
  { name: "Docker", icon: SiDocker, colorClass: "text-primary/90" },
  { name: "MongoDB", icon: SiMongodb, colorClass: "text-[#47A248]/90" },
  { name: "VS Code", icon: VscCode, colorClass: "text-primary/90" },
] as const;

interface LocalMarqueeProps {
  children: React.ReactNode;
  durationSeconds?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

function LocalMarquee({
  children,
  durationSeconds = 30,
  reverse,
  pauseOnHover,
  className = "",
}: LocalMarqueeProps) {
  type MarqueeStyle = CSSProperties & { ["--marquee-duration"]?: string };
  const style: MarqueeStyle = { ["--marquee-duration"]: `${durationSeconds}s` };

  return (
    <div
      className={`marquee relative overflow-hidden ${className}`}
      data-dir={reverse ? "reverse" : "normal"}
      data-pause={pauseOnHover ? "hover" : "none"}
      style={style}
    >
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
      </div>

      <style jsx>{`
        .marquee {
          --marquee-duration: 30s;
        }
        .marquee__track {
          display: flex;
          width: max-content;
          animation: marquee var(--marquee-duration) linear infinite;
          will-change: transform;
        }
        .marquee[data-dir="reverse"] .marquee__track {
          animation-direction: reverse;
        }
        .marquee[data-pause="hover"]:hover .marquee__track {
          animation-play-state: paused;
        }
        .marquee__group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

const EdgeFades = memo(function EdgeFades() {
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
    </>
  );
});

const TechPill = memo(function TechPill({
  name,
  icon: Icon,
  colorClass,
}: TechItem) {
  return (
    <Badge
      variant="outline"
      className="mx-1 flex items-center gap-2 rounded-full border-border/30 bg-background/50 px-4 py-1.5 text-foreground/90 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 hover:bg-background/80"
    >
      <Icon className={`h-5 w-5 ${colorClass}`} aria-hidden="true" />
      <span className="text-base font-medium leading-none">{name}</span>
    </Badge>
  );
});

interface MarqueeRowProps {
  reverse?: boolean;
  durationSeconds: number;
}

const MarqueeRow = memo(function MarqueeRow({
  reverse,
  durationSeconds,
}: MarqueeRowProps) {
  const items = [...TECH_STACK, ...TECH_STACK].map((t, idx) => (
    <TechPill key={`${t.name}-${idx}`} {...t} />
  ));

  return (
    <div className="relative">
      <EdgeFades />
      <LocalMarquee
        durationSeconds={durationSeconds}
        reverse={reverse}
        pauseOnHover
        className="py-1"
      >
        {items}
      </LocalMarquee>
    </div>
  );
});

export default function HomeContent() {
  const { messages } = useI18n();

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pt-0 lg:pl-64">
        <section className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="space-y-6 sm:space-y-8">
              {/* Hero */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 md:h-32 md:w-32">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-primary/10 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30">
                    <Image
                      src="/avatar.jpg"
                      alt="Rendi Ichtiar Prasetyo"
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
                      {messages.pages.home.greeting}
                    </h1>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4 sm:text-base">
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="h-4 w-4 text-primary/70"
                          aria-hidden="true"
                        />
                        <span>{messages.pages.home.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MonitorUp
                          className="h-4 w-4 text-primary/70"
                          aria-hidden="true"
                        />
                        <span>{messages.pages.home.remote_worker}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {messages.pages.home.bio}
                  </p>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Tech stack */}
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {messages.pages.home.tech_stack}
                  </h2>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {messages.pages.home.tech_stack_desc}
                  </p>
                </div>

                <div className="space-y-2">
                  <MarqueeRow durationSeconds={40} reverse />
                  <MarqueeRow durationSeconds={35} />
                  <MarqueeRow durationSeconds={30} reverse />
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* CTA section */}
              <div className="space-y-8 sm:space-y-12">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {messages.pages.home.work_title}
                  </h2>

                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                    {messages.pages.home.work_desc}
                  </p>
                </div>

                <Card className="rounded-xl border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle
                        className="h-5 w-5 text-primary/70"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-lg font-semibold text-foreground sm:text-xl">
                        {messages.pages.home.lets_work}
                      </CardTitle>
                    </div>

                    <CardDescription className="text-sm text-muted-foreground sm:text-base">
                      {messages.pages.home.work_cta}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      asChild
                      className="rounded-xl border border-border/30 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <a href="mailto:rendichpras@gmail.com">
                        {messages.pages.home.contact_me}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
