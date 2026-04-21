import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, totalSeats } = await req.json()
    const hall = await prisma.hall.update({
      where: { id: Number(id) },
      data: { name, totalSeats: Number(totalSeats) },
    })
    return NextResponse.json(hall)
  } catch {
    return NextResponse.json({ error: "Failed to update hall" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.hall.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete hall" }, { status: 500 })
  }
}