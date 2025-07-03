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
import { useI18n } from "@/lib/i18n"

const socialLinks = [
    {
        icon: Mail,
        labelKey: "email",
        href: "mailto:rendichpras@gmail.com",
        color: "bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20"
    },
    {
        icon: Linkedin,
        labelKey: "linkedin",
        href: "https://linkedin.com/in/rendiichtiar",
        color: "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20"
    },
    {
        icon: Facebook,
        labelKey: "facebook",
        href: "https://facebook.com/rendiichtiar",
        color: "bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
    },
    {
        icon: Instagram,
        labelKey: "instagram",
        href: "https://instagram.com/rendiichtiar",
        color: "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20"
    },
    {
        icon: Github,
        labelKey: "github",
        href: "https://github.com/rendichpras",
        color: "bg-[#181717]/10 text-[#181717] hover:bg-[#181717]/20 dark:bg-[#fff]/10 dark:text-[#fff] dark:hover:bg-[#fff]/20"
    }
]

export function ContactContent() {
    const { messages } = useI18n()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const contactSchema = z.object({
        name: z.string().min(2, messages.contact.form.validation.name),
        email: z.string().email(messages.contact.form.validation.email),
        message: z.string().min(10, messages.contact.form.validation.message)
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
                throw new Error(data.message || messages.contact.form.error.general)
            }

            // Reset form
            setFormData({
                name: "",
                email: "",
                message: ""
            })

            // Tampilkan notifikasi sukses
            toast.success(messages.contact.form.success)

        } catch (error) {
            console.error("Error submitting form:", error)
            
            if (error instanceof z.ZodError) {
                // Tampilkan error validasi
                error.errors.forEach((err) => {
                    toast.error(err.message)
                })
            } else {
                // Tampilkan error umum
                toast.error(messages.contact.form.error.general)
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
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            {messages.contact.title}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {messages.contact.subtitle}
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/40" />

                    {/* Social Links */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-foreground">
                            {messages.contact.social.title}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon
                                return (
                                    <motion.div
                                        key={social.labelKey}
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
                                                "flex items-center gap-3 p-3 border-border/30 bg-card/50 backdrop-blur-sm",
                                                "transition-all duration-300 hover:border-border/50",
                                                "group cursor-pointer"
                                            )}>
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className={cn(
                                                        "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                                                        social.color
                                                    )}>
                                                        <Icon className="size-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                                                        {messages.contact.social[social.labelKey as keyof typeof messages.contact.social]}
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
                        <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        {messages.contact.call.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">{messages.contact.call.subtitle}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Video className="size-4 text-primary/70" />
                                            <span>{messages.contact.call.platform}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4 text-primary/70" />
                                            <span>{messages.contact.call.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="shrink-0 bg-primary/10 hover:bg-primary/20 text-primary"
                                    onClick={() => window.open("https://cal.com/rendiichtiar", "_blank")}
                                >
                                    {messages.contact.call.button}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-foreground">
                            {messages.contact.form.title}
                        </h2>
                        <Card className="p-6 border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground/90">
                                            {messages.contact.form.name.label}
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder={messages.contact.form.name.placeholder}
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground/90">
                                            {messages.contact.form.email.label}
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={messages.contact.form.email.placeholder}
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground/90">
                                        {messages.contact.form.message.label}
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder={messages.contact.form.message.placeholder}
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/50 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        {messages.contact.form.response_time}
                                    </p>
                                    <Button 
                                        type="submit" 
                                        size="lg" 
                                        className="ml-auto bg-primary/10 hover:bg-primary/20 text-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? messages.contact.form.sending : messages.contact.form.send}
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