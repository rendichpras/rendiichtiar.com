"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/page-transition"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Github, Instagram, Linkedin, Mail, Facebook, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    message: z.string().min(10, "Pesan minimal 10 karakter")
})

const socialLinks = [
    {
        icon: Mail,
        label: "Email",
        href: "mailto:rendichpras@gmail.com",
        color: "bg-[#EA4335]/10 text-[#EA4335]"
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        href: "https://linkedin.com/in/rendiichtiar",
        color: "bg-[#0A66C2]/10 text-[#0A66C2]"
    },
    {
        icon: Facebook,
        label: "Facebook",
        href: "https://facebook.com/rendiichtiar",
        color: "bg-[#1DA1F2]/10 text-[#1DA1F2]"
    },
    {
        icon: Instagram,
        label: "Instagram",
        href: "https://instagram.com/rendiichtiar",
        color: "bg-[#E4405F]/10 text-[#E4405F]"
    },
    {
        icon: Github,
        label: "Github",
        href: "https://github.com/rendichpras",
        color: "bg-[#181717]/10 text-[#181717] dark:bg-[#fff]/10 dark:text-[#fff]"
    }
]

export function ContactContent() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validasi form
            const validatedData = contactSchema.parse(formData)

            // Kirim ke API
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(validatedData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Terjadi kesalahan")
            }

            // Reset form
            setFormData({
                name: "",
                email: "",
                message: ""
            })

            // Tampilkan notifikasi sukses
            toast.success("Pesan berhasil dikirim! Terima kasih telah menghubungi saya.")

        } catch (error) {
            console.error("Error submitting form:", error)
            
            if (error instanceof z.ZodError) {
                // Tampilkan error validasi
                error.errors.forEach((err) => {
                    toast.error(err.message)
                })
            } else {
                // Tampilkan error umum
                toast.error("Terjadi kesalahan. Silakan coba lagi nanti.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <PageTransition>
            <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                    {/* Header */}
                    <div className="space-y-2 max-w-3xl">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kontak</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Mari terhubung dan diskusikan bagaimana kita bisa berkolaborasi bersama.
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/60" />

                    {/* Social Links */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Temukan saya di media sosial</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon
                                return (
                                    <motion.div
                                        key={social.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <a
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Card className={cn(
                                                "flex items-center gap-3 p-3 transition-colors hover:border-primary/40",
                                                "group cursor-pointer"
                                            )}>
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className={cn(
                                                        "size-8 rounded-lg flex items-center justify-center shrink-0",
                                                        social.color
                                                    )}>
                                                        <Icon className="size-4" />
                                                    </div>
                                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                                        {social.label}
                                                    </span>
                                                </div>
                                            </Card>
                                        </a>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Book a Call */}
                    <div className="mb-8">
                        <Card className="p-6 border-2 border-dashed">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold mb-2">Sesi Obrolan 1 on 1</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Mari luangkan waktu untuk berdiskusi tentang apa saja</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Video className="size-4" />
                                            <span>Google Meet</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>30 Menit</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="shrink-0"
                                    onClick={() => window.open("https://cal.com/rendiichtiar", "_blank")}
                                >
                                    Jadwalkan Sekarang
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Atau kirim pesan</h2>
                        <Card className="p-6">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Nama*
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Nama lengkap"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email*
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@kamu.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Pesan*
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tulis pesan Anda di sini..."
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        Rata-rata respon: 1-2 Jam (Jam Kerja, GMT+7)
                                    </p>
                                    <Button 
                                        type="submit" 
                                        size="lg" 
                                        className="ml-auto"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Mengirim..." : "Kirim Pesan"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </section>
            </main>
        </PageTransition>
    )
} 