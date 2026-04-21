import { prisma } from "@/lib/db"
import NowInCinemasCarousel from "./NowInCinemasCarousel"

export type CinemaMovie = {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  backdropUrl: string | null
  genre: string | null
  duration: number
  rating: number | null
  projection: {
    id: number
    startTime: string
    price: number
    hallName: string
  }
}

export default async function NowInCinemas() {
  let movies: CinemaMovie[] = []

  try {
    const dbMovies = await prisma.movie.findMany({
      where: {
        projections: {
          some: {
            startTime: { gt: new Date() },
          },
        },
        posterUrl: { not: null },
      },
      include: {
        projections: {
          where: { startTime: { gt: new Date() } },
          orderBy: { startTime: "asc" },
          take: 1,
          include: { hall: true },
        },
      },
    })

    movies = dbMovies
      .filter(m => m.projections.length > 0)
      .map(m => {
        const p = m.projections[0]
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          posterUrl: m.posterUrl,
          backdropUrl: m.backdropUrl ?? null,
          genre: m.genre,
          duration: m.duration,
          rating: m.rating,
          projection: {
            id: p.id,
            startTime: p.startTime.toISOString(),
            price: p.price,
            hallName: p.hall.name,
          },
        }
      })
  } catch {}

  if (!movies.length) return null

  return (
    <section id="incinema">
      <NowInCinemasCarousel movies={movies} />
    </section>
  )
}
