import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const favorite = await prisma.favorite.findUnique({
    where: { id: Number(id) },
  })

  if (!favorite) {
    return NextResponse.json({ error: "Favorite not found." }, { status: 404 })
  }

  if (favorite.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  await prisma.favorite.delete({ where: { id: Number(id) } })

  return NextResponse.json({ message: "Favorite removed." })
}
