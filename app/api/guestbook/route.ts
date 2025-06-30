import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const json = await req.json()
  const message = json.message

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return new NextResponse("User not found", { status: 404 })
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