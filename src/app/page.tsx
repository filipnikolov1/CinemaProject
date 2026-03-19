import Navbar from "@/components/Navbar"
import HeroCarousel from "@/components/HeroCarousel"
import InCinemaSection from "@/components/InCinemaSection"
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

// Mock data for sections we'll upgrade later
const inCinemas: LandingMovie[] = [
  { id: 101, title: "Captain America: Brave New World", posterUrl: "https://image.tmdb.org/t/p/w500/pzIddUEMWhIHoJLc3kmxmPFpGeA.jpg", description: "Sam Wilson faces a global crisis as the new Captain America.", genre: "Action · Adventure", releaseDate: null, duration: 118, backdropUrl: null },
  { id: 102, title: "Mickey 17", posterUrl: "https://image.tmdb.org/t/p/w500/edKpV1gJSKMUBkliW24LjZgzOBs.jpg", description: "An expendable worker on an ice planet dies and regenerates for dangerous missions.", genre: "Sci-Fi", releaseDate: null, duration: 137, backdropUrl: null },
  { id: 103, title: "Sons of Dust", posterUrl: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg", description: "Three brothers in the wild west seek revenge for their father's murder.", genre: "Western · Drama", releaseDate: null, duration: 142, backdropUrl: null },
  { id: 104, title: "Electra", posterUrl: "https://image.tmdb.org/t/p/w500/kfL3Stsuv2wUKJUKDE1GF6DITB4.jpg", description: "A hacker discovers that her AI creation has developed a will of its own.", genre: "Thriller · Sci-Fi", releaseDate: null, duration: 115, backdropUrl: null },
  { id: 105, title: "Butterfly", posterUrl: "https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg", description: "A love story between two worlds that must never collide.", genre: "Romance · Drama", releaseDate: null, duration: 128, backdropUrl: null },
  { id: 106, title: "No Days Off", posterUrl: "https://image.tmdb.org/t/p/w500/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg", description: "Two detectives chase the same criminal without knowing about each other.", genre: "Comedy · Action", releaseDate: null, duration: 108, backdropUrl: null },
  { id: 107, title: "The White Lotus", posterUrl: "https://image.tmdb.org/t/p/w500/lKaoMjNjgEFBqhLy96GuyAiTip3.jpg", description: "A group of wealthy vacationers discover nothing is what it seems.", genre: "Drama · Mystery", releaseDate: null, duration: 135, backdropUrl: null },
  { id: 108, title: "Last Dance", posterUrl: "https://image.tmdb.org/t/p/w500/bxh5De1ccGQpE5PKKwQDkHFW2v8.jpg", description: "A former ballerina returns to the stage for one final performance.", genre: "Drama · Musical", releaseDate: null, duration: 120, backdropUrl: null },
]

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
      <InCinemaSection movies={inCinemas} />
      <UpcomingSection movies={upcoming} />
    </main>
  )
}
