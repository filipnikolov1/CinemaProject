import Navbar from "@/components/Navbar"
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
}

// Mock data for upcoming section — will upgrade later
const upcoming: LandingMovie[] = [
  { id: 201, title: "Super Mario Galaxy", posterUrl: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", description: "Mario travels across the galaxy to save the princess from a new cosmic threat.", genre: "Animated · Adventure", releaseDate: "April 20, 2026", duration: 95, backdropUrl: null },
  { id: 202, title: "Mission Impossible: Final Act", posterUrl: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg", description: "Ethan Hunt faces the greatest threat of his career — himself.", genre: "Action · Thriller", releaseDate: "May 15, 2026", duration: 148, backdropUrl: null },
  { id: 203, title: "Fantastic Four", posterUrl: "https://image.tmdb.org/t/p/w500/yg95MBnFGDMJgm0MBSbw3AlLeMO.jpg", description: "Four scientists gain supernatural powers and must protect the world.", genre: "Action · Adventure", releaseDate: "June 10, 2026", duration: 132, backdropUrl: null },
  { id: 204, title: "Avatar: Ashes of Idril", posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", description: "A new conflict on Pandora forces the tribes to unite against an unseen enemy.", genre: "Sci-Fi · Adventure", releaseDate: "July 22, 2026", duration: 165, backdropUrl: null },
  { id: 205, title: "Jurassic World: New Chapter", posterUrl: "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg", description: "Dinosaurs now live among humans, but a new genetic experiment goes terribly wrong.", genre: "Adventure · Sci-Fi", releaseDate: "August 5, 2026", duration: 140, backdropUrl: null },
  { id: 206, title: "Batman 2: Court of Owls", posterUrl: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMSF6.jpg", description: "A secret society controls Gotham from the shadows, and Batman must expose them.", genre: "Action · Mystery", releaseDate: "September 18, 2026", duration: 155, backdropUrl: null },
]

export default async function Home() {
  let user = null
  try { user = await getCurrentUser() } catch {}

  // Fetch popular movies from the database
  let latestMovies: LandingMovie[] = []
  try {
    const dbMovies = await prisma.movie.findMany({
      where: {
        isPopular: true,
        posterUrl: { not: null },
      },
      orderBy: { releaseDate: "desc" },
      take: 15,
    })
    latestMovies = dbMovies
      .filter(m => m.posterUrl)
      .map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        posterUrl: m.posterUrl,
        backdropUrl: m.backdropUrl ?? null,
        genre: m.genre,
        releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
        duration: m.duration,
      }))
  } catch {}

  return (
    <main style={{ background: "#0d0d0d", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar user={user} />
      <HeroCarousel movies={latestMovies} />
      <NowInCinemas />
      <UpcomingSection movies={upcoming} />
    </main>
  )
}
