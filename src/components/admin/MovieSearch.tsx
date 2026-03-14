"use client"
import { useState, useEffect } from "react"
import styles from "./MovieSearch.module.scss"
import type { Movie } from "@/types"

interface Props {
  onSelect: (movie: Movie | null) => void
  selected: Movie | null
}

export default function MovieSearch({ onSelect, selected }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timeout = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/movies?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.slice(0, 8))
      setLoading(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  if (selected) {
    return (
      <div className={styles.selected}>
        {selected.posterUrl && (
          <img src={selected.posterUrl} alt="" className={styles.selectedPoster} />
        )}
        <div className={styles.selectedInfo}>
        <div className={styles.selectedTitle}>{selected.title}</div>
        <div className={styles.selectedMeta}>
            {selected.releaseDate && (
                <span>{new Date(selected.releaseDate).getFullYear()}</span>
            )}
            {selected.duration > 0 && (
            <>
                <span className={styles.dot}>·</span>
                <span>{Math.floor(selected.duration / 60)}h {selected.duration % 60}m</span>
            </>
            )}
        </div>
        </div>
        <button onClick={() => { onSelect(null); setQuery("") }} className={styles.changeButton}>
          Change
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className={styles.input}
      />
      {(results.length > 0 || loading) && (
        <div className={styles.dropdown}>
  {loading && <div className={styles.loadingText}>Searching...</div>}
  {results.map(movie => (
    <div
      key={movie.id}
      onClick={() => { onSelect(movie); setQuery(""); setResults([]) }}
      className={styles.resultItem}
    >
      {movie.posterUrl && (
        <img src={movie.posterUrl} alt="" className={styles.poster} />
      )}
      <div>
        <div className={styles.movieTitle}>{movie.title}</div>
        <div className={styles.movieMeta}>
          {movie.releaseDate && (
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          )}
          {movie.duration > 0 && (
            <>
              <span className={styles.dot}>·</span>
              <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            </>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  )
}