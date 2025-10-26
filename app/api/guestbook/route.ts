import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { guestbook as guestbookTable, users } from "@/db/schema/schema"
import { eq, desc } from "drizzle-orm"
import messages from "@/messages/id"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return new NextResponse(messages.api.guestbook.error.unauthorized, {
      status: 401,
    })
  }

  const json = await req.json()
  const message = json.message

  const uRows = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)

  const userRow = uRows[0]
  if (!userRow) {
    return new NextResponse(messages.api.guestbook.error.user_not_found, {
      status: 404,
    })
  }

  const inserted = await db
    .insert(guestbookTable)
    .values({
      id: randomUUID(),
      message,
      userId: userRow.id,
    })
    .returning({
      id: guestbookTable.id,
      message: guestbookTable.message,
      createdAt: guestbookTable.createdAt,
      userId: guestbookTable.userId,
    })

  return NextResponse.json(inserted[0])
}

export async function GET() {
  const rows = await db
    .select({
      id: guestbookTable.id,
      message: guestbookTable.message,
      createdAt: guestbookTable.createdAt,
      userId: guestbookTable.userId,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(guestbookTable)
    .leftJoin(users, eq(users.id, guestbookTable.userId))
    .orderBy(desc(guestbookTable.createdAt))

  const entries = rows.map((r) => ({
    id: r.id,
    message: r.message,
    createdAt: r.createdAt,
    userId: r.userId,
    user: {
      name: r.userName,
      email: r.userEmail,
      image: r.userImage,
    },
  }))

  return NextResponse.json(entries)
}