"use client"

import { useRef } from "react"
import Link from "next/link"
import styles from "./InCinemaSection.module.scss"

type Movie = {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  genre: string | null
}

type Props = { movies: Movie[] }

export default function InCinemaSection({ movies }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth"
    })
  }

  return (
    <section id="incinema" className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Now Showing</span>
          <h2 className={styles.title}>In Cinema This Week</h2>
        </div>
        <div className={styles.arrows}>
          <button onClick={() => scroll("left")} className={styles.arrow} aria-label="Left">&#8249;</button>
          <button onClick={() => scroll("right")} className={styles.arrow} aria-label="Right">&#8250;</button>
        </div>
      </div>

      <div className={styles.scrollArea} ref={scrollRef}>
        {movies.map(movie => (
          <div key={movie.id} className={styles.card}>
            <div className={styles.posterWrap}>
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={styles.poster}
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0" }}
                />
              )}
              <div className={styles.posterOverlay}>
                <Link href="/movies" className={styles.bookBtn}>
                  Book Tickets
                </Link>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{movie.title}</h3>
              <p className={styles.cardGenre}>{movie.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
