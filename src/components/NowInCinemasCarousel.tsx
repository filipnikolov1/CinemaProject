"use client"

import { useState, useEffect } from "react"
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
  projection: {
    id: number
    startTime: string
    price: number
    hallName: string
  }
}

type Props = { movies: CinemaMovie[] }

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function formatPrice(price: number) {
  return `€${price.toFixed(2)}`
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function NowInCinemasCarousel({ movies }: Props) {
  const [selected, setSelected] = useState<CinemaMovie | null>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!selected) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [selected])

  const scrollable = movies.length > 5
  const maxOffset = Math.max(0, movies.length - 5)

  function goPrev() {
    setOffset(prev => prev === 0 ? maxOffset : prev - 1)
  }

  function goNext() {
    setOffset(prev => prev >= maxOffset ? 0 : prev + 1)
  }

  return (
    <div className={styles.section}>
      <div className={styles.hallWrap}>
        <div className={styles.hallBg} style={{ backgroundImage: "url(/cinema-hall.png)" }} />
        <div className={styles.fadeTop} />
        <div className={styles.fadeBottom} />

        <h2 className={styles.title}>Now Playing</h2>

        <div className={styles.posterArea}>
          {scrollable && (
            <button className={`${styles.arrowBtn} ${styles.arrowLeft}`} onClick={goPrev}>&#8249;</button>
          )}

          <div className={styles.posterClip}>
            <div
              className={`${styles.posterRow} ${!scrollable ? styles.posterRowCentered : ""}`}
              style={{ transform: `translateX(-${offset * (220 + 28)}px)` }}
            >
            {movies.map(m => {
              const release = m.projection.startTime
                ? new Date(m.projection.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : null
              return (
                <button key={m.id} className={styles.card} onClick={() => setSelected(m)}>
                  <div className={styles.cardPoster}>
                    {m.posterUrl && (
                      <img src={m.posterUrl} alt={m.title} className={styles.cardImg} loading="lazy" />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{m.title}</h3>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardMetaItem}>
                        <span className={styles.cardMetaIcon}>⏱</span>
                        {formatDuration(m.duration)}
                      </span>
                      {release && (
                        <span className={styles.cardMetaItem}>
                          <span className={styles.cardMetaIcon}>📅</span>
                          {release}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
            </div>
          </div>

          {scrollable && (
            <button className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={goNext}>&#8250;</button>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div
              className={styles.modalBg}
              style={selected.backdropUrl ? { backgroundImage: `url(${selected.backdropUrl})` } : undefined}
            />
            <div className={styles.modalGradient} />
            <button className={styles.modalClose} onClick={() => setSelected(null)}>×</button>

            <div className={styles.modalContent}>
              <div className={styles.modalPoster}>
                {selected.posterUrl ? (
                  <img src={selected.posterUrl} alt={selected.title} className={styles.modalPosterImg} />
                ) : (
                  <div className={styles.modalPosterPlaceholder} />
                )}
              </div>

              <div className={styles.modalInfo}>
                {selected.genre && (
                  <div className={styles.modalGenres}>
                    {selected.genre.split(",").map(g => g.trim()).filter(Boolean).map(g => (
                      <span key={g} className={styles.modalGenreBadge}>{g}</span>
                    ))}
                  </div>
                )}

                <h3 className={styles.modalTitle}>{selected.title}</h3>
                <p className={styles.modalDesc}>{selected.description || "No description available."}</p>

                <div className={styles.modalStats}>
                  {[
                    { icon: "⏱", value: formatDuration(selected.duration) },
                    { icon: "🕐", value: formatTime(selected.projection.startTime) },
                    { icon: "🏛", value: selected.projection.hallName },
                    { icon: "🎟", value: formatPrice(selected.projection.price) },
                  ].map(s => (
                    <div key={s.icon} className={styles.modalStat}>
                      <span className={styles.modalStatIcon}>{s.icon}</span>
                      <span className={styles.modalStatValue}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.modalActions}>
                  <Link href={`/bookings/${selected.projection.id}/seats`} className={styles.modalBookBtn}>
                    Book Now
                  </Link>
                  <Link href={`/movies/${selected.id}`} className={styles.modalMoreBtn}>
                    More info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
