"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import styles from "./NowInCinemasCarousel.module.scss"

type CinemaMovie = {
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

type Props = { movies: CinemaMovie[] }

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return ""
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

const INTERVAL = 6000
const FADE_MS = 700

export default function NowInCinemasCarousel({ movies }: Props) {
  // Layer A and B alternate: one fades in while the other holds
  const [layerA, setLayerA] = useState(0)       // movie index on layer A
  const [layerB, setLayerB] = useState(0)       // movie index on layer B
  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A") // which layer is on top (visible)
  const [visible, setVisible] = useState(true)

  const activeLayerRef = useRef<"A" | "B">("A")
  activeLayerRef.current = activeLayer
  const currentRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = activeLayer === "A" ? layerA : layerB
  currentRef.current = current
  const total = movies.length

  function stopAll() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }

  function switchTo(next: number) {
    if (next === currentRef.current) return

    // Hide content
    setVisible(false)

    // Load new image onto the inactive layer, then crossfade
    setTimeout(() => {
      const layer = activeLayerRef.current
      if (layer === "A") {
        setLayerB(next)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setActiveLayer("B"))
        })
      } else {
        setLayerA(next)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setActiveLayer("A"))
        })
      }
      // Show content after backdrop starts fading
      setTimeout(() => setVisible(true), 100)
    }, 60)

    // Restart auto-advance
    stopAll()
    timerRef.current = setTimeout(() => {
      const c = currentRef.current
      switchTo((c + 1) % movies.length)
    }, INTERVAL)
  }

  // Auto-start
  useEffect(() => {
    if (!movies.length) return
    timerRef.current = setTimeout(() => {
      switchTo((currentRef.current + 1) % movies.length)
    }, INTERVAL)
    return stopAll
  }, [movies.length])

  if (!movies.length) return null

  const movie = movies[current]

  const bgStyle = (m: CinemaMovie): React.CSSProperties =>
    m.backdropUrl
      ? { backgroundImage: `url(${m.backdropUrl})` }
      : { background: "linear-gradient(135deg, #0d1117, #161b22)" }

  return (
    <div className={styles.section}>
      {/* Layer A */}
      <div
        className={`${styles.backdrop} ${activeLayer === "A" ? styles.backdropVisible : styles.backdropHidden}`}
        style={bgStyle(movies[layerA])}
      />
      {/* Layer B */}
      <div
        className={`${styles.backdrop} ${activeLayer === "B" ? styles.backdropVisible : styles.backdropHidden}`}
        style={bgStyle(movies[layerB])}
      />
      <div className={styles.overlay} />
      <div className={styles.fadeTop} />
      <div className={styles.vignette} />

      {/* Top-left label */}
      <span className={styles.sectionLabel}>Now Showing</span>

      {/* Side arrow buttons */}
      <button className={styles.arrowLeft} onClick={() => switchTo(current === 0 ? total - 1 : current - 1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className={styles.arrowRight} onClick={() => switchTo((current + 1) % total)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Center layout: poster with glass card beneath */}
      <div className={styles.centerWrap}>
        <div className={`${styles.showcase} ${visible ? styles.showcaseVisible : ""}`}>
          <div className={styles.posterWrap}>
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className={styles.poster}
              />
            ) : (
              <div className={styles.posterFallback} />
            )}
          </div>

          <div className={styles.card}>
            {movie.genre && (
              <span className={styles.genre}>{movie.genre.split(",")[0].trim()}</span>
            )}
            <h2 className={styles.title}>{movie.title}</h2>
            <div className={styles.meta}>
              <span>{formatDate(movie.projection.startTime)}</span>
              <span className={styles.metaSep}>·</span>
              <span>{formatTime(movie.projection.startTime)}</span>
              <span className={styles.metaSep}>·</span>
              <span>{movie.projection.hallName}</span>
              <span className={styles.metaSep}>·</span>
              <span>{formatDuration(movie.duration)}</span>
              <span className={styles.metaSep}>·</span>
              <span className={styles.priceInline}>from ${movie.projection.price.toFixed(2)}</span>
              {movie.rating != null && movie.rating > 0 && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.ratingInline}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0a500" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {movie.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <div className={styles.actions}>
              <Link href={`/bookings/${movie.projection.id}/seats`} className={styles.btnPrimary}>
                Book Now
              </Link>
              <Link href={`/movies/${movie.id}`} className={styles.btnSecondary}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Centered dots + counter */}
      <div className={styles.bottomBar}>
        <div className={styles.dots}>
          {movies.map((m, i) => (
            <button
              key={m.id}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => switchTo(i)}
            >
              {i === current && <span className={styles.dotTitle}>{m.title}</span>}
            </button>
          ))}
        </div>
        <span className={styles.counter}>
          {pad(current + 1)} <span className={styles.counterSep}>/</span> {pad(total)}
        </span>
        <div className={styles.scrollHint}>
          <span className={styles.scrollText}>Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
    </div>
  )
}
