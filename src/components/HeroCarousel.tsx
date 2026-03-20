"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./HeroCarousel.module.scss"

type Movie = {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  backdropUrl: string | null
  genre: string | null
  releaseDate: string | null
  duration: number
}

type HeroCarouselProps = { movies: Movie[] }

function getBackdrop(movie: Movie) {
  // Prefer the proper TMDB backdrop (landscape), fall back to upscaled poster
  if (movie.backdropUrl) return movie.backdropUrl
  if (movie.posterUrl) return movie.posterUrl.replace("/w500/", "/original/")
  return null
}

function formatDate(iso: string | null) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  } catch { return null }
}

// How many extra movies to pad on each side for the loop illusion
const PAD = 7

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const didMount = useRef(false)

  // Build padded display array: [...last PAD] + [...all] + [...first PAD]
  const display = movies.length > 0 ? [...movies.slice(-PAD), ...movies, ...movies.slice(0, PAD)] : []

  // The scroll-index of the active poster in the display array
  const scrollIndex = current + PAD

  function startAutoplay() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % movies.length)
        setFading(false)
      }, 500)
    }, 7000)
  }

  useEffect(() => {
    if (!movies.length) return
    startAutoplay()
    const t = setTimeout(() => setFirstLoad(false), 1200)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      clearTimeout(t)
    }
  }, [movies.length])

  // Scroll to center the active poster
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !display.length) return
    const child = el.children[scrollIndex] as HTMLElement
    if (!child) return
    const offset = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2
    // Instant scroll on first mount, smooth after
    el.scrollTo({ left: offset, behavior: didMount.current ? "smooth" : "instant" })
    didMount.current = true
  }, [current, scrollIndex, display.length])

  function goTo(realIndex: number) {
    if (realIndex === current || fading) return
    setFading(true)
    setTimeout(() => {
      setCurrent(realIndex)
      setFading(false)
    }, 500)
    startAutoplay()
  }

  function goPrev() {
    const prev = current === 0 ? movies.length - 1 : current - 1
    goTo(prev)
  }

  function goNext() {
    const next = (current + 1) % movies.length
    goTo(next)
  }

  function handlePosterClick(displayIndex: number) {
    const realIndex = ((displayIndex - PAD) % movies.length + movies.length) % movies.length
    goTo(realIndex)
  }

  if (!movies.length) {
    return (
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.heroBottom}>
          <div className={styles.content}>
            <h1 className={styles.title}>No movies yet</h1>
            <p className={styles.description}>Add movies through the admin panel to see them here.</p>
          </div>
        </div>
      </section>
    )
  }

  const movie = movies[current]
  const backdrop = getBackdrop(movie)
  const releaseFormatted = formatDate(movie.releaseDate)

  return (
    <section id="popular" className={styles.hero}>
      <div
        className={`${styles.backdrop} ${fading ? styles.backdropHidden : styles.backdropVisible}`}
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
      />
      <div className={styles.overlay} />
      <div className={styles.vignette} />

      <div className={styles.heroBottom}>
        <div className={`${styles.content} ${firstLoad ? styles.contentEnter : ""} ${fading ? styles.contentHidden : styles.contentVisible}`}>
          {movie.genre && <span className={styles.genre}>{movie.genre}</span>}
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.description}>{movie.description || "No description available."}</p>
          {releaseFormatted && <p className={styles.releaseDate}>{releaseFormatted}</p>}
        </div>

        <div className={styles.stripWrap}>
          <button className={styles.arrowBtn} style={{ left: 12 }} onClick={goPrev}>&#8249;</button>

          <div className={styles.strip} ref={scrollRef}>
            {display.map((m, i) => {
              const realIdx = ((i - PAD) % movies.length + movies.length) % movies.length
              const active = realIdx === current && Math.abs(i - scrollIndex) < movies.length
              return (
                <button
                  key={`${m.id}-${i}`}
                  onClick={() => handlePosterClick(i)}
                  style={{
                    flex: "0 0 auto",
                    width: active ? 200 : 150,
                    height: active ? 290 : 210,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: active ? "3px solid #f5c518" : "2px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "width 0.4s, height 0.4s, opacity 0.4s, filter 0.4s, border-color 0.3s, box-shadow 0.3s",
                    background: "#1a1a1a",
                    padding: 0,
                    opacity: active ? 1 : 0.5,
                    filter: active ? "none" : "blur(1.5px) brightness(0.6)",
                    boxShadow: active ? "0 8px 40px rgba(245,197,24,0.3)" : "none",
                  }}
                >
                  {m.posterUrl && (
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      loading={i < PAD + 5 ? "eager" : "lazy"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0" }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <button className={styles.arrowBtn} style={{ right: 12 }} onClick={goNext}>&#8250;</button>
        </div>
      </div>
    </section>
  )
}
