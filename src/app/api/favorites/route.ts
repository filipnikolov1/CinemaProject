import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { id: true, movieId: true },
  })

  return NextResponse.json(favorites)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { movieId } = await req.json()

    if (!movieId) {
      return NextResponse.json({ error: "movieId is required." }, { status: 400 })
    }

    const movie = await prisma.movie.findUnique({ where: { id: Number(movieId) } })
    if (!movie) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_movieId: { userId: user.id, movieId: Number(movieId) } },
    })

    if (existing) {
      return NextResponse.json(existing)
    }

    const favorite = await prisma.favorite.create({
      data: { userId: user.id, movieId: Number(movieId) },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to add favorite." }, { status: 500 })
  }
}
