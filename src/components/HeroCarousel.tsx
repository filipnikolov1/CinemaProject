"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
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
  rating: number | null
  ageRating: string | null
}

type HeroCarouselProps = { movies: Movie[] }

function getBackdrop(movie: Movie) {
  if (movie.backdropUrl) return movie.backdropUrl
  if (movie.posterUrl) return movie.posterUrl.replace("/w500/", "/original/")
  return null
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatYear(iso: string | null) {
  if (!iso) return null
  try { return new Date(iso).getFullYear().toString() } catch { return null }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const titleListRef = useRef<HTMLElement>(null)

  // -- Old poster strip refs (commented out) --
  // const scrollRef = useRef<HTMLDivElement>(null)
  // const didMount = useRef(false)
  // const PAD = 7
  // const display = movies.length > 0 ? [...movies.slice(-PAD), ...movies, ...movies.slice(0, PAD)] : []
  // const scrollIndex = current + PAD

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

  // Scroll active title into view (within the list only, not the page)
  useEffect(() => {
    const list = titleListRef.current
    if (!list) return
    const active = list.children[current] as HTMLElement
    if (!active) return
    const listTop = list.scrollTop
    const listHeight = list.clientHeight
    const itemTop = active.offsetTop - list.offsetTop
    const itemBottom = itemTop + active.offsetHeight

    if (itemTop < listTop) {
      list.scrollTo({ top: itemTop, behavior: "smooth" })
    } else if (itemBottom > listTop + listHeight) {
      list.scrollTo({ top: itemBottom - listHeight, behavior: "smooth" })
    }
  }, [current])

  // -- Old scroll-to-center effect (commented out) --
  // useEffect(() => {
  //   const el = scrollRef.current
  //   if (!el || !display.length) return
  //   const child = el.children[scrollIndex] as HTMLElement
  //   if (!child) return
  //   const offset = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2
  //   el.scrollTo({ left: offset, behavior: didMount.current ? "smooth" : "instant" })
  //   didMount.current = true
  // }, [current, scrollIndex, display.length])

  function goTo(realIndex: number) {
    if (realIndex === current || fading) return
    setFading(true)
    setTimeout(() => {
      setCurrent(realIndex)
      setFading(false)
    }, 500)
    startAutoplay()
  }

  // -- Old nav helpers (commented out, kept for reference) --
  // function goPrev() {
  //   const prev = current === 0 ? movies.length - 1 : current - 1
  //   goTo(prev)
  // }
  // function goNext() {
  //   const next = (current + 1) % movies.length
  //   goTo(next)
  // }
  // function handlePosterClick(displayIndex: number) {
  //   const realIndex = ((displayIndex - PAD) % movies.length + movies.length) % movies.length
  //   goTo(realIndex)
  // }

  if (!movies.length) {
    return (
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.heroInner}>
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
  const year = formatYear(movie.releaseDate)
  const genre = movie.genre?.split(",")[0].trim()

  // Build meta string: "Action · 2026 · 2h 15m"
  const metaParts = [genre, year, formatDuration(movie.duration)].filter(Boolean)

  return (
    <section id="popular" className={styles.hero}>
      <div
        className={`${styles.backdrop} ${fading ? styles.backdropHidden : styles.backdropVisible}`}
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
      />
      <div className={styles.overlay} />
      <div className={styles.vignette} />

      {/* Vertical side label */}
      <span className={styles.sideLabel}>Latest</span>

      <div className={styles.heroInner}>
        {/* Left: movie info */}
        <div className={`${styles.content} ${firstLoad ? styles.contentEnter : ""} ${fading ? styles.contentHidden : styles.contentVisible}`}>
          <span className={styles.counter}>{pad(current + 1)} / {pad(movies.length)}</span>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.meta}>
            {metaParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.metaSep}>·</span>}
                {part}
              </span>
            ))}
            {movie.rating != null && movie.rating > 0 && (
              <span>
                <span className={styles.metaSep}>·</span>
                <span className={styles.ratingInline}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0a500" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {movie.rating.toFixed(1)}
                </span>
              </span>
            )}
            {movie.ageRating && (
              <span>
                <span className={styles.metaSep}>·</span>
                <span className={styles.ageBadge}>{movie.ageRating}</span>
              </span>
            )}
          </p>
          <p className={styles.description}>{movie.description || "No description available."}</p>
          <Link href={`/movies/${movie.id}`} className={styles.btnDetails}>
            View Details
          </Link>
        </div>

        {/* -- Old content (commented out) --
        <div className={`${styles.content} ${firstLoad ? styles.contentEnter : ""} ${fading ? styles.contentHidden : styles.contentVisible}`}>
          {movie.genre && <span className={styles.genre}>{movie.genre}</span>}
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.description}>{movie.description || "No description available."}</p>
          {releaseFormatted && <p className={styles.releaseDate}>{releaseFormatted}</p>}
        </div>
        */}

        {/* Right: editorial title list */}
        <nav className={styles.titleList} ref={titleListRef}>
          {movies.map((m, i) => (
            <button
              key={m.id}
              className={`${styles.titleItem} ${i === current ? styles.titleItemActive : ""}`}
              onClick={() => goTo(i)}
            >
              <span className={styles.titleNum}>{pad(i + 1)}</span>
              <span className={styles.titleText}>{m.title}</span>
            </button>
          ))}
        </nav>

        {/* -- Old poster strip (commented out) --
        <div className={styles.stripWrap}>
          <button className={styles.arrowBtn} style={{ left: 12 }} onClick={goPrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
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
                    border: active ? "3px solid #e50914" : "2px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "width 0.4s, height 0.4s, opacity 0.4s, filter 0.4s, border-color 0.3s, box-shadow 0.3s",
                    background: "#1a1a1a",
                    padding: 0,
                    opacity: active ? 1 : 0.5,
                    filter: active ? "none" : "blur(1.5px) brightness(0.6)",
                    boxShadow: active ? "0 8px 40px rgba(229,9,20,0.3)" : "none",
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
          <button className={styles.arrowBtn} style={{ right: 12 }} onClick={goNext}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        */}
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollText}>Scroll</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  )
}
