import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const filter = searchParams.get("filter")
  const genre = searchParams.get("genre")
  const search = searchParams.get("search")

  const where: any = {}

  if (filter === "popular")     where.isPopular = true
  if (filter === "top_rated")   where.isTopRated = true
  if (filter === "now_playing") where.isNowPlaying = true
  if (filter === "upcoming")    where.isUpcoming = true

  if (genre)  where.genre = { contains: genre, mode: "insensitive" }
  if (search) where.title = { contains: search, mode: "insensitive" }

  const movies = await prisma.movie.findMany({
    where,
    orderBy: { releaseDate: "desc" },
    include: {
      _count: { select: { projections: true } },
    },
  })

  return NextResponse.json(movies)
}