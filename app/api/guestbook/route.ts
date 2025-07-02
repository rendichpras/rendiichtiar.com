import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import messages from "@/messages/id" // Gunakan ID sebagai default

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return new NextResponse(messages.api.guestbook.error.unauthorized, { status: 401 })
  }

  const json = await req.json()
  const message = json.message

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return new NextResponse(messages.api.guestbook.error.user_not_found, { status: 404 })
  }

  const entry = await prisma.guestbook.create({
    data: {
      message,
      userId: user.id,
    },
  })

  return NextResponse.json(entry)
}

export async function GET() {
  const entries = await prisma.guestbook.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  })

  return NextResponse.json(entries)
} 