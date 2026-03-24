import HeroCarousel from "@/components/HeroCarousel"
import NowInCinemas from "@/components/NowInCinemas"
import UpcomingSection from "@/components/UpcomingSection"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { prisma } from "@/lib/db"

export type LandingMovie = {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  backdropUrl: string | null
  genre: string | null
  releaseDate: string | null
  duration: number
  rating: number | null
  ageRating: string | null
}

export default async function Home() {
  let user = null
  try { user = await getCurrentUser() } catch {}

  // Fetch latest movies for hero — now playing OR popular, with backdrop, by release date
  // -- Old query (commented out) --
  // let latestMovies: LandingMovie[] = []
  // try {
  //   const dbMovies = await prisma.movie.findMany({
  //     where: {
  //       isPopular: true,
  //       posterUrl: { not: null },
  //     },
  //     orderBy: { releaseDate: "desc" },
  //     take: 15,
  //   })
  //   latestMovies = dbMovies
  //     .filter(m => m.posterUrl)
  //     .map(m => ({
  //       id: m.id,
  //       title: m.title,
  //       description: m.description,
  //       posterUrl: m.posterUrl,
  //       backdropUrl: m.backdropUrl ?? null,
  //       genre: m.genre,
  //       releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
  //       duration: m.duration,
  //     }))
  // } catch {}

  let latestMovies: LandingMovie[] = []
  try {
    const dbMovies = await prisma.movie.findMany({
      where: {
        // -- Previous: isPopular AND isTopRated (too restrictive)
        // -- Previous: OR: [{ isNowPlaying: true }, { isPopular: true }]
        OR: [
          { isPopular: true, isTopRated: true },
          { isNowPlaying: true },
        ],
        posterUrl: { not: null },
        backdropUrl: { not: null },
        releaseDate: {
          lte: new Date(),
          gte: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // within last 2 years
        },
      },
      orderBy: { releaseDate: "desc" },
      take: 15,
    })
    latestMovies = dbMovies
      .filter(m => m.posterUrl && m.backdropUrl)
      .map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        posterUrl: m.posterUrl,
        backdropUrl: m.backdropUrl ?? null,
        genre: m.genre,
        releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
        duration: m.duration,
        rating: m.rating,
        ageRating: m.ageRating,
      }))
  } catch {}

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", overflowX: "hidden" }}>
      {/* <Navbar user={user} /> */}
      <HeroCarousel movies={latestMovies} />
      <NowInCinemas />
      <UpcomingSection />
    </main>
  )
}
