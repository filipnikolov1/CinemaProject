import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) return NextResponse.json(null)

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json(null)

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(null)
  }
}