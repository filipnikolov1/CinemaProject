import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const halls = await prisma.hall.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(halls)
}

export async function POST(req: Request) {
  try {
    const { name, totalSeats } = await req.json()
    if (!name || !totalSeats) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }
    const hall = await prisma.hall.create({
      data: { name, totalSeats: Number(totalSeats) },
    })
    return NextResponse.json(hall, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create hall" }, { status: 500 })
  }
}