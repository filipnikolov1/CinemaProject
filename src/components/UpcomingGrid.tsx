"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./UpcomingSection.module.scss"

export type UpcomingMovie = {
  id: number
  title: string
  posterUrl: string | null
  genre: string | null
  duration: number
  releaseDate: string | null
  rating: number | null
  ageRating: string | null
}

type FavEntry = { id: number; movieId: number }

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatReleaseDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export default function UpcomingGrid({ movies }: { movies: UpcomingMovie[] }) {
  const router = useRouter()
  const [favs, setFavs] = useState<Map<number, number>>(new Map()) // movieId → favoriteId
  const [loading, setLoading] = useState<Set<number>>(new Set()) // movieIds currently toggling

  useEffect(() => {
    fetch("/api/favorites")
      .then(res => {
        if (!res.ok) return [] // not logged in
        return res.json()
      })
      .then((data: FavEntry[]) => {
        const map = new Map<number, number>()
        data.forEach(f => map.set(f.movieId, f.id))
        setFavs(map)
      })
      .catch(() => {})
  }, [])

  async function toggleFavorite(e: React.MouseEvent, movieId: number) {
    e.preventDefault()
    e.stopPropagation()

    if (loading.has(movieId)) return

    setLoading(prev => new Set(prev).add(movieId))

    const favId = favs.get(movieId)

    if (favId) {
      // Remove favorite
      const res = await fetch(`/api/favorites/${favId}`, { method: "DELETE" })
      if (res.ok) {
        setFavs(prev => {
          const next = new Map(prev)
          next.delete(movieId)
          return next
        })
      }
    } else {
      // Add favorite
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      })
      if (res.status === 401) {
        router.push("/login")
        return
      }
      if (res.ok) {
        const data = await res.json()
        setFavs(prev => new Map(prev).set(movieId, data.id))
      }
    }

    setLoading(prev => {
      const next = new Set(prev)
      next.delete(movieId)
      return next
    })
  }

  return (
    <div className={styles.grid}>
      {movies.map(movie => (
        <Link
          key={movie.id}
          href={`/movies/${movie.id}`}
          className={styles.card}
        >
          <div className={styles.posterWrap}>
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className={styles.poster}
                loading="lazy"
              />
            ) : (
              <div className={styles.posterFallback} />
            )}
            <div className={styles.posterOverlay} />

            {movie.releaseDate && (
              <span className={styles.dateBadge}>
                {formatReleaseDate(movie.releaseDate)}
              </span>
            )}

            <button
              className={`${styles.heartBtn} ${favs.has(movie.id) ? styles.heartActive : ""}`}
              aria-label={favs.has(movie.id) ? "Remove from favorites" : "Add to favorites"}
              onClick={e => toggleFavorite(e, movie.id)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={favs.has(movie.id) ? "#e50914" : "none"}
                stroke={favs.has(movie.id) ? "#e50914" : "currentColor"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <h3 className={styles.cardTitle}>{movie.title}</h3>
          </div>

          <div className={styles.info}>
            {movie.genre && (
              <p className={styles.genreLine}>
                {movie.genre.split(",").map((g, i) => (
                  <span key={i}>
                    {i > 0 && <span className={styles.genreSep}>&bull;</span>}
                    {g.trim()}
                  </span>
                ))}
              </p>
            )}

            <div className={styles.badges}>
              {movie.ageRating && (
                <span className={styles.ageBadge}>{movie.ageRating}</span>
              )}
              <span className={styles.durBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {formatDuration(movie.duration)}
              </span>
              {movie.rating != null && movie.rating > 0 && (
                <span className={styles.ratingBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {movie.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
