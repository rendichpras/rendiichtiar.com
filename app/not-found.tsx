import { NotFoundContent } from "@/components/error/NotFoundContent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 Not Found | Rendi Ichtiar Prasetyo",
  description: "Halaman yang Anda cari tidak ditemukan.",
  openGraph: {
    title: "404 Not Found | Rendi Ichtiar Prasetyo",
    description: "Halaman yang Anda cari tidak ditemukan.",
  },
  twitter: {
    title: "404 Not Found | Rendi Ichtiar Prasetyo",
    description: "Halaman yang Anda cari tidak ditemukan.",
  }
}

export default function NotFoundPage() {
  return <NotFoundContent />
}