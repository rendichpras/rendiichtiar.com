"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "../components/page-transition"
import { BookOpen, GraduationCap, User2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"

const sections = [
    {
        id: "intro",
        icon: User2,
        title: "Intro",
        content: (
            <Card className="p-6">
                <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed">
                        Halo! Terima kasih telah mengunjungi website personal saya.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Saya seorang Software Engineer yang berfokus pada pengembangan Frontend dengan pengalaman lebih dari 2 tahun.
                        Saya memiliki keahlian dalam ekosistem JavaScript modern seperti React, Next.js, dan TypeScript untuk
                        membangun aplikasi web yang responsif dan berkinerja tinggi. Dengan perhatian terhadap detail dan pemahaman
                        mendalam tentang pengalaman pengguna, saya berkomitmen untuk menghadirkan solusi digital yang tidak hanya
                        fungsional, tetapi juga intuitif dan menyenangkan untuk digunakan.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Perjalanan saya di dunia pengembangan web dimulai dari ketertarikan saya pada teknologi dan desain.
                        Saya selalu percaya bahwa teknologi harus membuat hidup lebih mudah, bukan sebaliknya. Prinsip ini
                        yang selalu saya terapkan dalam setiap proyek yang saya kerjakan. Saya senang mengeksplorasi
                        teknologi-teknologi baru dan selalu berusaha untuk tetap up-to-date dengan perkembangan terbaru
                        di dunia web development.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Dalam setiap proyek, saya tidak hanya fokus pada kode, tetapi juga pada aspek bisnis dan pengalaman
                        pengguna. Saya percaya bahwa aplikasi yang baik adalah yang dapat memecahkan masalah nyata dengan
                        cara yang elegan dan efisien. Saya selalu berusaha untuk memahami kebutuhan pengguna dan bisnis
                        secara mendalam sebelum mulai mengembangkan solusi.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Di luar coding, saya sangat tertarik dengan UI/UX design dan arsitektur software. Saya percaya bahwa
                        pemahaman yang baik tentang desain dan arsitektur adalah kunci untuk membangun aplikasi yang tidak
                        hanya berfungsi dengan baik tetapi juga mudah dimaintain dan dikembangkan di masa depan. Saya juga
                        aktif berkontribusi pada komunitas open source dan senang berbagi pengetahuan dengan sesama developer.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed">
                        Saya selalu terbuka untuk kolaborasi dan kesempatan baru. Jika Anda memiliki proyek menarik atau
                        ingin berdiskusi tentang teknologi, jangan ragu untuk menghubungi saya. Mari kita ciptakan sesuatu
                        yang luar biasa bersama!
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Salam hangat,
                    </p>
                </div>
            </Card>
        )
    },
    {
        id: "career",
        icon: BookOpen,
        title: "Karir",
        content: (
            <Card className="p-6 space-y-4">
                <div className="space-y-4">
                    <Card className="p-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border">
                                <img
                                    src="/saranatechnology.png"
                                    alt="Sarana Technology"
                                    className="size-full object-contain"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold truncate">Frontend Engineer</h3>
                                <div className="flex flex-wrap gap-x-2 text-xs sm:text-sm text-muted-foreground">
                                    <span>Sarana Technology</span>
                                    <span>•</span>
                                    <span>Bali, Indonesia</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1.5">
                                    <span>April 2025 - Sekarang</span>
                                    <span> • </span>
                                    <span>Remote</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        )
    },
    {
        id: "education",
        icon: GraduationCap,
        title: "Pendidikan",
        content: (
            <Card className="p-6">
                <Card className="p-4">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border">
                            <img
                                src="/upb.png"
                                alt="Universitas Pelita Bangsa"
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold">Universitas Pelita Bangsa</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Teknik Informatika</p>
                            <div className="text-xs text-muted-foreground mt-1.5">
                                <span>2025 - Sekarang</span>
                                <span> • </span>
                                <span>Bekasi, Indonesia</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 mt-4">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="size-12 sm:size-14 rounded-lg flex items-center justify-center shrink-0 bg-background/50 p-2 border">
                            <img
                                src="/smkhsagung.png"
                                alt="SMK HS AGUNG"
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold">SMK HS AGUNG</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Teknik Komputer dan Jaringan</p>
                            <div className="text-xs text-muted-foreground mt-1.5">
                                <span>2022 - 2025</span>
                                <span> • </span>
                                <span>Bekasi, Indonesia</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </Card>
        )
    }
]

export default function AboutPage() {
    const [activeSection, setActiveSection] = useState("intro")

    return (
        <PageTransition>
            <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                    {/* Header */}
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tentang</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Sekilas tentang siapa saya – karena setiap detail menambah kedalaman dalam kanvas kehidupan.
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/60" />

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
                                            "group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200",
                                            "hover:bg-primary/5 active:bg-primary/10",
                                            isActive && "bg-primary/10 text-primary border-primary"
                                        )}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <div className="flex items-center gap-3 text-sm font-medium">
                                            <Icon className="size-5 transition-transform group-hover:scale-110" />
                                            <span>{section.title}</span>
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
                        {sections.find(section => section.id === activeSection)?.content}
                    </motion.div>
                </section>
            </main>
        </PageTransition>
    )
} 