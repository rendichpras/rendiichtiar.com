"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"
import { useI18n } from "@/lib/i18n"
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
  SiMongodb
} from "react-icons/si"
import { VscCode } from "react-icons/vsc"
import { PageTransition } from "@/components/animations/page-transition"

const techStack = [
  { name: "TypeScript", icon: SiTypescript, color: "text-primary" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-[#339933]/90" },
  { name: "TailwindCSS", icon: SiTailwindcss, color: "text-[#06B6D4]/90" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-primary/90" },
  { name: "Prisma", icon: SiPrisma, color: "text-foreground/90" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground/90" },
  { name: "React", icon: SiReact, color: "text-[#61DAFB]/90" },
  { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]/90" },
  { name: "Nginx", icon: SiNginx, color: "text-[#009639]/90" },
  { name: "Docker", icon: SiDocker, color: "text-primary/90" },
  { name: "MongoDB", icon: SiMongodb, color: "text-[#47A248]/90" },
  { name: "VS Code", icon: VscCode, color: "text-primary/90" }
]

export default function Home() {
  const { messages } = useI18n()

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
        {/* Hero Section */}
        <section className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="space-y-6 sm:space-y-8">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 sm:mx-0">
                  <div className="w-full h-full relative overflow-hidden rounded-2xl border-2 border-primary/10 bg-card transition-all duration-300 hover:border-primary/30">
                    <Image
                      src="/avatar.jpg"
                      alt="Rendi"
                      priority
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Intro */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                      {messages.home.greeting}
                    </h1>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary/70">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{messages.home.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary/70">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        <span>{messages.home.remote_worker}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {messages.home.bio}
                  </p>
                </div>
              </div>
              {/* Tech Stack */}
              <div className="pt-6 sm:pt-8 border-t border-border/40">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.home.tech_stack}</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {messages.home.tech_stack_desc}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                      <Marquee className="py-1 [--duration:110s]" pauseOnHover>
                        <>
                        {techStack.map((tech) => (
                          <div
                            key={tech.name}
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/30 px-4 py-1.5 transition-colors duration-300 hover:border-border/50"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium text-foreground/90">{tech.name}</span>
                          </div>
                        ))}
                        </>
                      </Marquee>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                      <Marquee className="py-1 [--duration:100s]" reverse pauseOnHover>
                        <>
                        {techStack.map((tech) => (
                          <div
                            key={tech.name}
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/30 px-4 py-1.5 transition-colors duration-300 hover:border-border/50"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium text-foreground/90">{tech.name}</span>
                          </div>
                        ))}
                        </>
                      </Marquee>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                      <Marquee className="py-1 [--duration:90s]" pauseOnHover>
                        <>
                        {techStack.map((tech) => (
                          <div
                            key={tech.name}
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/30 px-4 py-1.5 transition-colors duration-300 hover:border-border/50"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium text-foreground/90">{tech.name}</span>
                          </div>
                        ))}
                        </>
                      </Marquee>
                    </div>
                  </div>
                </div>
              </div>

              {/* What I've Been Working On */}
              <div className="pt-8 sm:pt-12 border-t border-border/40">
                <div className="space-y-8 sm:space-y-12">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.home.work_title}</h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                      {messages.home.work_desc}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/30 p-4 sm:p-6 space-y-3 sm:space-y-4 transition-colors duration-300 hover:border-border/50">
                    <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary/70">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.home.lets_work}</span>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {messages.home.work_cta}
                    </p>
                    <div>
                      <Button
                        asChild
                        variant="secondary"
                        className="rounded-lg font-medium text-sm sm:text-base bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300"
                      >
                        <a href="mailto:rendichpras@gmail.com">
                          {messages.home.contact_me}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
