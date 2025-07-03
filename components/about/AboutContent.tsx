"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/page-transition"
import { BookOpen, GraduationCap, User2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useI18n, Messages } from "@/lib/i18n"

type SectionContent = {
    id: string
    icon: React.ComponentType<{ className?: string }>
    titleKey: keyof Messages['about']['sections']
    content: (props: { messages: Messages }) => React.ReactNode
}

const sections: SectionContent[] = [
    {
        id: "intro",
        icon: User2,
        titleKey: "intro",
        content: ({ messages }) => (
            <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
                <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.greeting}
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.bio1}
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.bio2}
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.bio3}
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.bio4}
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                        {messages.about.intro.bio5}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {messages.about.intro.closing}
                    </p>
                </div>
            </Card>
        )
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
        )
    },
    {
        id: "education",
        icon: GraduationCap,
        titleKey: "education",
        content: ({ messages }) => (
            <Card className="p-6 space-y-4 border-border/30 bg-card/50 backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
                <Card className="p-4 border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:bg-card/50">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border border-border/30">
                            <img
                                src="/upb.png"
                                alt={messages.about.education.upb.name}
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.about.education.upb.name}</h3>
                            <p className="text-xs sm:text-sm text-foreground/80">{messages.about.education.upb.major}</p>
                            <div className="text-xs text-muted-foreground mt-1.5">
                                <span>{messages.about.education.upb.period}</span>
                                <span className="mx-1.5">•</span>
                                <span>{messages.about.education.upb.location}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:bg-card/50">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border border-border/30">
                            <img
                                src="/smkhsagung.png"
                                alt={messages.about.education.smk.name}
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.about.education.smk.name}</h3>
                            <p className="text-xs sm:text-sm text-foreground/80">{messages.about.education.smk.major}</p>
                            <div className="text-xs text-muted-foreground mt-1.5">
                                <span>{messages.about.education.smk.period}</span>
                                <span className="mx-1.5">•</span>
                                <span>{messages.about.education.smk.location}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </Card>
        )
    }
]

export function AboutContent() {
    const [activeSection, setActiveSection] = useState("intro")
    const { messages } = useI18n()

    return (
        <PageTransition>
            <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                    {/* Header */}
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{messages.about.title}</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {messages.about.subtitle}
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/40" />

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                        {sections.map((section, index) => {
                            const Icon = section.icon
                            const isActive = activeSection === section.id
                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        className={cn(
                                            "group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300",
                                            "border-border/30 hover:border-border/50",
                                            isActive && "bg-primary/10 text-primary border-primary/50 hover:border-primary/50"
                                        )}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <div className="flex items-center gap-3 text-sm font-medium">
                                            <Icon className="size-5 transition-transform group-hover:scale-110" />
                                            <span>{messages.about.sections[section.titleKey]}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Content */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                    >
                        {sections.find(section => section.id === activeSection)?.content({ messages })}
                    </motion.div>
                </section>
            </main>
        </PageTransition>
    )
} 