"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./BookingCard.module.scss"
import Toast from "./admin/Toast"
import { getDisplayPrice } from "@/lib/vip"

interface BookingCardProps {
  id: number
  movieTitle: string
  posterUrl: string | null
  hallName: string
  hallTotalSeats: number
  startTime: string
  seatNumber: number
  price: number
  ticketCode: string
}

export default function BookingCard({ id, movieTitle, posterUrl, hallName, hallTotalSeats, startTime, seatNumber, price, ticketCode }: BookingCardProps) {
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [confirmPending, setConfirmPending] = useState(false)

  const date = new Date(startTime)
  const isPast = date < new Date()
  const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  const formattedTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const displayPrice = getDisplayPrice(price, seatNumber, hallTotalSeats)

  async function handleCancel() {
  if (!confirmPending) {
    setConfirmPending(true)
    setToast({ message: "Click cancel again to confirm", type: "error" })
    setTimeout(() => setConfirmPending(false), 3000)
    return
  }

  setConfirmPending(false)
  setCancelling(true)
  try {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) {
      setToast({ message: data.error || "Failed to cancel.", type: "error" })
      return
    }
    setToast({ message: "Booking cancelled.", type: "success" })
    setTimeout(() => router.refresh(), 1750)
  } catch {
    setToast({ message: "Network error.", type: "error" })
  } finally {
    setCancelling(false)
  }
}

  return (
    <div className={`${styles.card} ${isPast ? styles.past : ""}`}>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Front */}
      <div className={`${styles.face} ${showTicket ? styles.fadeOut : styles.fadeIn}`}>
        {posterUrl && (
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${posterUrl})` }}
          />
        )}
        <div className={styles.bgOverlay} />

        <div className={styles.content}>
          <div className={styles.top}>
            <span className={`${styles.badge} ${isPast ? styles.badgePast : styles.badgeActive}`}>
              {isPast ? "Past" : "Active"}
            </span>
          </div>

          <div className={styles.middle} />

          <div className={styles.bottom}>
            <h3 className={styles.movieTitle}>{movieTitle}</h3>
            <p className={styles.dateTime}>{formattedDate} · {formattedTime}</p>

            <div className={styles.actions}>
              <button onClick={() => setShowTicket(true)} className={styles.ticketButton}>
                Show ticket
              </button>
              {!isPast && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className={`${styles.cancelButton} ${confirmPending ? styles.cancelPending : ""}`}
                >
                  {cancelling ? "..." : confirmPending ? "Confirm?" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket face */}
      <div className={`${styles.face} ${styles.ticketFace} ${showTicket ? styles.fadeIn : styles.fadeOut}`}>
        <div className={styles.ticketTop}>
          <p className={styles.ticketBrand}>CINEMA</p>
          <h3 className={styles.ticketTitle}>{movieTitle}</h3>

          <div className={styles.ticketDetails}>
            {[
              { label: "Date", value: formattedDate },
              { label: "Time", value: formattedTime },
              { label: "Hall", value: hallName },
              { label: "Price", value: `€${displayPrice.toFixed(2)}` },
              { label: "Code", value: ticketCode.slice(0, 8).toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className={styles.ticketDetailItem}>
                <span className={styles.ticketDetailLabel}>{label}</span>
                <span className={`${styles.ticketDetailValue} ${label === "Code" ? styles.mono : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tearOff}>
          <div className={styles.notchLeft} />
          <div className={styles.tearLine} />
          <div className={styles.notchRight} />
        </div>

        <div className={styles.stub}>
          <p className={styles.stubLabel}>SEAT</p>
          <p className={styles.stubNumber}>{seatNumber}</p>
          <button onClick={() => setShowTicket(false)} className={styles.backButton}>
            ← Back
          </button>
        </div>
      </div>

    </div>
  )
}