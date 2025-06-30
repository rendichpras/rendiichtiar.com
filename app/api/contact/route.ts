import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import nodemailer from "nodemailer"

// Schema validasi untuk form kontak
const contactSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    message: z.string().min(10, "Pesan minimal 10 karakter")
})

// Template email untuk admin
const adminEmailTemplate = (data: z.infer<typeof contactSchema>, messageId: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">Pesan Baru dari Website</h1>
        </div>
        
        <div style="padding: 20px 0;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #666;"><strong style="color: #333;">Nama:</strong> ${data.name}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #666;"><strong style="color: #333;">Email:</strong> ${data.email}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p style="margin: 0 0 10px 0; color: #333;"><strong>Pesan:</strong></p>
                <p style="margin: 0; color: #666; line-height: 1.6;">${data.message}</p>
            </div>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 2px solid #f0f0f0;">
            <p style="color: #999; font-size: 12px; margin: 0;">ID Pesan: ${messageId}</p>
        </div>
    </div>
</body>
</html>
`

// Template email untuk user
const userEmailTemplate = (data: z.infer<typeof contactSchema>) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">Terima Kasih ${data.name}!</h1>
        </div>
        
        <div style="padding: 20px 0;">
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Terima kasih telah menghubungi saya. Saya akan membalas pesan Anda segera.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #333;"><strong>Salinan Pesan Anda:</strong></p>
                <p style="margin: 0; color: #666; line-height: 1.6; font-style: italic;">${data.message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <div style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                    <a href="https://rendiichtiar.com" style="color: #ffffff; text-decoration: none;">Kunjungi Website</a>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 2px solid #f0f0f0;">
            <p style="color: #666; margin-bottom: 5px;">Salam hangat,</p>
            <p style="color: #333; font-weight: bold; margin: 0;">Rendi Ichtiar</p>
            <div style="margin-top: 15px;">
                <a href="https://linkedin.com/in/rendiichtiar" style="color: #007bff; text-decoration: none; margin: 0 10px;">LinkedIn</a>
                <a href="https://github.com/rendichpras" style="color: #333; text-decoration: none; margin: 0 10px;">GitHub</a>
                <a href="https://instagram.com/rendiichtiar" style="color: #e1306c; text-decoration: none; margin: 0 10px;">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>
`

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

// Handler GET untuk mengambil daftar kontak
export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({
            success: true,
            contacts
        })
    } catch (error) {
        console.error("Error fetching contacts:", error)
        return NextResponse.json({
            success: false,
            message: "Gagal mengambil data kontak"
        }, { status: 500 })
    }
}

// Handler POST untuk membuat kontak baru
export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validasi input
        const validatedData = contactSchema.parse(body)

        // Simpan ke database menggunakan Prisma
        const contact = await prisma.contact.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                message: validatedData.message,
                status: "UNREAD"
            }
        })

        // Kirim email notifikasi ke admin
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_TO,
            subject: `[Website] Pesan Baru dari ${validatedData.name}`,
            html: adminEmailTemplate(validatedData, contact.id)
        })

        // Kirim email konfirmasi ke pengirim
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: validatedData.email,
            subject: "Terima Kasih atas Pesan Anda",
            html: userEmailTemplate(validatedData)
        })

        return NextResponse.json({
            success: true,
            message: "Pesan berhasil dikirim"
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Validasi gagal",
                errors: error.errors
            }, { status: 400 })
        }

        console.error("Error in contact form:", error)
        return NextResponse.json({
            success: false,
            message: "Terjadi kesalahan, silakan coba lagi nanti"
        }, { status: 500 })
    }
} 