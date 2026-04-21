import { prisma } from "@/lib/db"
import styles from "./UpcomingSection.module.scss"
import UpcomingGrid from "./UpcomingGrid"
import type { UpcomingMovie } from "./UpcomingGrid"

export default async function UpcomingSection() {
  let movies: UpcomingMovie[] = []

  try {
    const dbMovies = await prisma.movie.findMany({
      where: {
        releaseDate: { gt: new Date() },
        posterUrl: { not: null },
      },
      orderBy: { releaseDate: "asc" },
      take: 12,
    })

    movies = dbMovies
      .filter(m => m.posterUrl)
      .map(m => ({
        id: m.id,
        title: m.title,
        posterUrl: m.posterUrl,
        genre: m.genre,
        duration: m.duration,
        releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
        rating: m.rating,
        ageRating: m.ageRating,
      }))
  } catch {}

  if (!movies.length) return null

  return (
    <section id="upcoming" className={styles.section}>
      <div className={styles.fadeTop} />
      <span className={styles.sideLabel}>Coming Soon</span>

      <div className={styles.header}>
        <span className={styles.eyebrow}>Upcoming</span>
        <h2 className={styles.heading}>Coming Soon</h2>
      </div>

      <UpcomingGrid movies={movies} />
    </section>
  )
}
