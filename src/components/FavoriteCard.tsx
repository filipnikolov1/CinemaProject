"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./FavoriteCard.module.scss"

interface FavoriteCardProps {
  favoriteId: number
  movieId: number
  title: string
  posterUrl: string | null
  genre: string | null
  rating: number | null
  ageRating: string | null
  duration: number
}

export default function FavoriteCard({
  favoriteId,
  movieId,
  title,
  posterUrl,
  genre,
  rating,
  ageRating,
  duration,
}: FavoriteCardProps) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  const h = Math.floor(duration / 60)
  const m = duration % 60
  const dur = h > 0 ? `${h}h ${m}m` : `${m}m`

  async function handleUnfavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (removing) return
    setRemoving(true)

    const res = await fetch(`/api/favorites/${favoriteId}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    }
    setRemoving(false)
  }

  return (
    <Link href={`/movies/${movieId}`} className={styles.card}>
      {posterUrl && (
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}
      <div className={styles.bgOverlay} />

      <div className={styles.content}>
        <div className={styles.top}>
          <button
            className={styles.heartBtn}
            onClick={handleUnfavorite}
            aria-label="Remove from favorites"
            disabled={removing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50914" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className={styles.middle} />

        <div className={styles.bottom}>
          <h3 className={styles.movieTitle}>{title}</h3>
          {genre && (
            <p className={styles.genre}>
              {genre.split(",").map((g, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  {g.trim()}
                </span>
              ))}
            </p>
          )}
          <div className={styles.badges}>
            {ageRating && <span className={styles.ageBadge}>{ageRating}</span>}
            <span className={styles.durBadge}>{dur}</span>
            {rating != null && rating > 0 && (
              <span className={styles.ratingBadge}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#f0a500" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
