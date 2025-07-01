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

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            href="https://github.com/rendichpras" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-background/80 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>rendichpras</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            href="https://linkedin.com/in/rendiichtiar" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-background/80 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                            </svg>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>rendiichtiar</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            href="mailto:rendichpras@gmail.com"
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-background/80 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>rendichpras@gmail.com</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            href="https://instagram.com/rendiichtiar" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-background/80 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>rendiichtiar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
