"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface BookingCardProps {
  id: number
  movieTitle: string
  posterUrl: string | null
  hallName: string
  startTime: string
  seatNumber: number
  price: number
  ticketCode: string
}

export default function BookingCard({ id, movieTitle, posterUrl, hallName, startTime, seatNumber, price, ticketCode }: BookingCardProps) {
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const date = new Date(startTime)
  const isPast = date < new Date()
  const formattedDate = date.toLocaleDateString("mk-MK", { day: "2-digit", month: "short", year: "numeric" })
  const formattedTime = date.toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" })

  async function handleCancel() {
    if (!confirm("Дали сте сигурни?")) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.refresh()
    } catch {
      setError("Мрежна грешка.")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "20px", opacity: isPast ? 0.6 : 1 }}>

      <img src={posterUrl || "/no-image.jpg"} alt={movieTitle} style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: "bold", color: "#fff", margin: "0 0 4px 0" }}>{movieTitle}</p>
        <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px 0" }}>📅 {formattedDate} во {formattedTime}</p>
        <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px 0" }}>🏛️ {hallName} · 💺 Место {seatNumber} · 💰 {price} ден</p>
        <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>Код: <span style={{ color: "#f5c518", fontFamily: "monospace" }}>{ticketCode.slice(0, 8).toUpperCase()}</span></p>
        {error && <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0 0" }}>{error}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
        <span style={{ fontSize: "12px", fontWeight: "bold", padding: "4px 6px", borderRadius: "20px", background: isPast ? "#2a2a2a" : "#1a3a2a", color: isPast ? "#666" : "#4ade80" }}>
          {isPast ? "Изминато" : "Активно"}
        </span>
        {!isPast && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            style={{ fontSize: "14px", padding: "5px 8px", background: "transparent", color: "#f87171", border: "1px solid #f87171", borderRadius: "6px", cursor: "pointer" }}
          >
            {cancelling ? "..." : "Откажи"}
          </button>
        )}
      </div>
    </div>
  )
}