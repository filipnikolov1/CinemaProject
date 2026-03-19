"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import SeatPicker from "@/components/SeatPicker"
import styles from "./seats.module.scss"
import { getVipSeats, getDisplayPrice } from "@/lib/vip"

interface ProjectionInfo {
  id: number
  startTime: string
  price: number
  movie: {
    title: string
    posterUrl: string | null
    duration: number
    genre: string | null
    releaseDate: string | null
  }
  hall: { name: string; totalSeats: number }
}

export default function SeatSelectionPage() {
  const { projectionId } = useParams<{ projectionId: string }>()
  const router = useRouter()

  const [projection, setProjection] = useState<ProjectionInfo | null>(null)
  const [takenSeats, setTakenSeats] = useState<number[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [projRes, seatsRes] = await Promise.all([
          fetch(`/api/projections/${projectionId}`),
          fetch(`/api/seats/${projectionId}`),
        ])
        if (!projRes.ok) throw new Error("Projection not found.")
        setProjection(await projRes.json())
        setTakenSeats((await seatsRes.json()).takenSeats)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectionId])

  function handleToggleSeat(seat: number) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  async function handleConfirm() {
    if (selectedSeats.length === 0) return
    setBooking(true)
    setError(null)
    try {
      const bookingIds: number[] = []
      for (const seatNumber of selectedSeats) {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectionId: Number(projectionId), seatNumber }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error)
          setBooking(false)
          return
        }
        const data = await res.json()
        bookingIds.push(data.id)
      }
      router.push(`/bookings/${projectionId}/confirm?bookingId=${bookingIds[0]}&allIds=${bookingIds.join(",")}&success=booked`)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setBooking(false)
    }
  }

  const totalSeats = projection?.hall.totalSeats || 0
  const vipSeats = getVipSeats(totalSeats)
  const regularPrice = projection?.price || 0
  const vipPrice = parseFloat((regularPrice * 1.5).toFixed(2))

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + getDisplayPrice(regularPrice, seat, totalSeats)
  }, 0)

  const date = projection ? new Date(projection.startTime) : null
  const formattedDate = date?.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short" })
  const formattedTime = date?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const releaseYear = projection?.movie.releaseDate
    ? new Date(projection.movie.releaseDate).getFullYear()
    : null

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <div className={styles.banner}>
          {projection?.movie.posterUrl && (
            <img
              src={projection.movie.posterUrl}
              alt={projection.movie.title}
              className={styles.poster}
            />
          )}
          <div className={styles.bannerDetails}>
            <div className={styles.bannerMeta}>
              {projection?.movie.genre && (
                <span className={styles.badge}>{projection.movie.genre.split(",")[0]}</span>
              )}
              {releaseYear && (
                <span className={styles.badge}>{releaseYear}</span>
              )}
              <span className={styles.badge}>{projection?.movie.duration} min</span>
            </div>
            <h1 className={styles.movieTitle}>{projection?.movie.title}</h1>
            <div className={styles.bannerInfo}>
              <div className={styles.bannerInfoItem}>
                <span className={styles.bannerInfoLabel}>Date</span>
                <span className={styles.bannerInfoValue}>{formattedDate}</span>
              </div>
              <div className={styles.bannerDivider} />
              <div className={styles.bannerInfoItem}>
                <span className={styles.bannerInfoLabel}>Time</span>
                <span className={styles.bannerInfoValue}>{formattedTime}</span>
              </div>
              <div className={styles.bannerDivider} />
              <div className={styles.bannerInfoItem}>
                <span className={styles.bannerInfoLabel}>Hall</span>
                <span className={styles.bannerInfoValue}>{projection?.hall.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.pickerCard}>
            <SeatPicker
              totalSeats={totalSeats}
              takenSeats={takenSeats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
              vipSeats={vipSeats}
            />
          </div>

          <div className={styles.summary}>
            <p className={styles.summaryTitle}>Booking Summary</p>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Selected seats</span>
                <strong>{selectedSeats.length}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Regular price</span>
                <strong>€{regularPrice.toFixed(2)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>VIP price</span>
                <strong className={styles.vipPrice}>€{vipPrice.toFixed(2)}</strong>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className={styles.selectedList}>
                {selectedSeats.map((seat) => (
                  <div key={seat} className={styles.selectedItem}>
                    <span>Seat {seat}</span>
                    {vipSeats.has(seat) && <span className={styles.vipTag}>VIP</span>}
                    <span className={styles.selectedPrice}>
                      €{getDisplayPrice(regularPrice, seat, totalSeats).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <strong>€{totalPrice.toFixed(2)}</strong>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0 || booking}
              className={`${styles.confirmButton} ${selectedSeats.length === 0 ? styles.confirmDisabled : ""}`}
            >
              {booking ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}