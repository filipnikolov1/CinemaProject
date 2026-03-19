import styles from "./UpcomingSection.module.scss"

type Movie = {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  releaseDate?: string | null
  genre: string | null
}

type Props = { movies: Movie[] }

export default function UpcomingSection({ movies }: Props) {
  return (
    <section id="upcoming" className={styles.section}>
      <span className={styles.eyebrow}>Coming Soon</span>
      <h2 className={styles.title}>Upcoming Movies</h2>

      <div className={styles.grid}>
        {movies.map(movie => (
          <div key={movie.id} className={styles.card}>
            <div className={styles.posterWrap}>
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={styles.poster}
                  loading="lazy"
                />
              )}
            </div>
            <div className={styles.info}>
              {movie.releaseDate && <span className={styles.releaseDate}>{movie.releaseDate}</span>}
              <h3 className={styles.cardTitle}>{movie.title}</h3>
              <p className={styles.cardDesc}>{movie.description || "No description available."}</p>
              {movie.genre && <span className={styles.genreTag}>{movie.genre}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
