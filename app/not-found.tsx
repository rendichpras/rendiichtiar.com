import { NotFoundContent } from "@/components/error/NotFoundContent"
import { Metadata } from "next"
import messages from "@/messages/id" // Gunakan ID sebagai default

export const metadata: Metadata = {
  title: messages.error.not_found.title,
  description: messages.error.not_found.message,
  openGraph: {
    title: messages.error.not_found.title,
    description: messages.error.not_found.message,
  },
  twitter: {
    title: messages.error.not_found.title,
    description: messages.error.not_found.message,
  }
}

export default function NotFoundPage() {
  return <NotFoundContent />
}