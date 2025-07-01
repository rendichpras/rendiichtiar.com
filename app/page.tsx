import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Marquee } from "@/components/ui/marquee"
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
import Link from "next/link"

const techStack = [
  { name: "TypeScript", icon: SiTypescript, color: "text-[#3178C6]" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-[#339933]" },
  { name: "TailwindCSS", icon: SiTailwindcss, color: "text-[#06B6D4]" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-[#4169E1]" },
  { name: "Prisma", icon: SiPrisma, color: "text-[#2D3748]" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
  { name: "React", icon: SiReact, color: "text-[#61DAFB]" },
  { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]" },
  { name: "Nginx", icon: SiNginx, color: "text-[#009639]" },
  { name: "Docker", icon: SiDocker, color: "text-[#2496ED]" },
  { name: "MongoDB", icon: SiMongodb, color: "text-[#47A248]" },
  { name: "VS Code", icon: VscCode, color: "text-[#007ACC]" }
]

export default function Home() {
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
                  <div className="w-full h-full relative overflow-hidden rounded-2xl border-2 border-primary/20 transition-all duration-300 hover:border-primary/40">
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                      Hai, saya Rendi 👋
                    </h1>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Bekasi, Indonesia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        <span>Remote Worker</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Seorang Software Engineer yang berfokus pada pengembangan Frontend dengan pengalaman lebih dari 2 tahun. Saya memiliki keahlian dalam ekosistem JavaScript modern seperti React, Next.js, dan TypeScript untuk membangun aplikasi web yang responsif dan berkinerja tinggi. Dengan perhatian terhadap detail dan pemahaman mendalam tentang pengalaman pengguna, saya berkomitmen untuk menghadirkan solusi digital yang tidak hanya fungsional, tetapi juga intuitif dan menyenangkan untuk digunakan.
                  </p>
                </div>
              </div>
              {/* Tech Stack */}
              <div className="pt-6 sm:pt-8 border-t">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold">Teknologi yang Saya Gunakan</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Teknologi yang saya gunakan untuk membangun aplikasi modern dan scalable
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
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/40 bg-secondary/80 px-4 py-1.5"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium">{tech.name}</span>
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
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/40 bg-secondary/80 px-4 py-1.5"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium">{tech.name}</span>
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
                            className="mx-1 flex items-center gap-2 rounded-full border border-border/40 bg-secondary/80 px-4 py-1.5"
                          >
                            <tech.icon className={`h-5 w-5 ${tech.color}`} />
                            <span className="text-base font-medium">{tech.name}</span>
                          </div>
                        ))}
                        </>
                      </Marquee>
                    </div>
                  </div>
                </div>
              </div>

              {/* What I've Been Working On */}
              <div className="pt-8 sm:pt-12 border-t">
                <div className="space-y-8 sm:space-y-12">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold">Yang Telah Saya Kerjakan</h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                      Saya membantu brand, perusahaan, institusi, dan startup dalam menciptakan pengalaman digital yang luar biasa untuk bisnis mereka melalui layanan pengembangan yang strategis.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-muted/30 p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      <span>Mari Bekerja Sama!</span>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Saya terbuka untuk proyek freelance, silakan hubungi saya melalui email untuk melihat bagaimana kita bisa berkolaborasi.
                    </p>
                    <div>
                      <Button
                        asChild
                        variant="secondary"
                        className="rounded-lg font-medium text-sm sm:text-base"
                      >
                        <a href="mailto:rendichpras@gmail.com">
                          Hubungi saya
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
