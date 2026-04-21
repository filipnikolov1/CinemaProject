"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MovieSearch from "./MovieSearch"
import DateTimePicker from "./DateTimePicker"
import Toast from "./Toast"
import styles from "./ProjectionForm.module.scss"
import type { Movie, Hall } from "@/types"

interface Props {
  projection?: {
    id: number
    movieId: number
    hallId: number
    startTime: string
    price: number
    movie: Movie
  }
}

function splitDateTime(isoString: string) {
  if (!isoString) return { date: "", time: "" }
  const d = new Date(isoString)
  const date = d.toISOString().slice(0, 10)
  const time = d.toTimeString().slice(0, 5)
  return { date, time }
}

export default function ProjectionForm({ projection }: Props) {
  const router = useRouter()
  const isEdit = !!projection
  const initial = projection ? splitDateTime(projection.startTime) : { date: "", time: "" }

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(projection?.movie || null)
  const [halls, setHalls] = useState<Hall[]>([])
  const [hallId, setHallId] = useState(projection?.hallId?.toString() || "")
  const [date, setDate] = useState(initial.date)
  const [time, setTime] = useState(initial.time)
  const [price, setPrice] = useState(projection?.price?.toString() || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    fetch("/api/halls").then(r => r.json()).then(setHalls)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMovie) { setError("Please select a movie"); return }
    if (!hallId) { setError("Please select a hall"); return }
    if (!date) { setError("Please select a date"); return }
    if (!time) { setError("Please select a time"); return }
    if (!price) { setError("Please enter a price"); return }

    setLoading(true)
    setError("")

    const startTime = `${date}T${time}:00`

    const res = await fetch(
      isEdit ? `/api/projections/${projection!.id}` : "/api/projections",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          hallId: Number(hallId),
          startTime,
          price: Number(price),
        }),
      }
    )

    if (res.ok) {
      router.push("/admin/projections?success=" + (isEdit ? "updated" : "created"))
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setToast({ message: data.error || "Something went wrong", type: "error" })
    }
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <span className={styles.label}>Movie</span>
          <MovieSearch onSelect={setSelectedMovie} selected={selectedMovie} />
          {selectedMovie?.duration === 0 && (
            <span className={styles.warning}>
              ⚠ Runtime unknown — defaulting to 90 min for scheduling
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Hall</label>
          <select
            value={hallId}
            onChange={e => setHallId(e.target.value)}
            className={styles.input}
          >
            <option value="">Select a hall...</option>
            {halls.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.totalSeats} seats
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Date & time</label>
          <DateTimePicker
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Price</label>
          <div className={styles.inputWithPrefix}>
            <span className={styles.inputPrefix}>€</span>
            <input
              type="number"
              min="0"
              step="0.50"
              placeholder="0.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={styles.inputInner}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Add projection"}
          </button>
          <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  )
}