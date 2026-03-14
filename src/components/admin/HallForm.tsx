"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Toast from "./Toast"
import styles from "./HallForm.module.scss"

interface Props {
  hall?: { id: number; name: string; totalSeats: number }
}

export default function HallForm({ hall }: Props) {
  const router = useRouter()
  const isEdit = !!hall

  const [name, setName] = useState(hall?.name || "")
  const [totalSeats, setTotalSeats] = useState(hall?.totalSeats?.toString() || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) { setError("Please enter a hall name"); return }
    if (!totalSeats) { setError("Please enter the number of seats"); return }

    setLoading(true)
    setError("")

    const res = await fetch(
      isEdit ? `/api/halls/${hall!.id}` : "/api/halls",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, totalSeats: Number(totalSeats) }),
      }
    )

    if (res.ok) {
      router.push("/admin/halls?success=" + (isEdit ? "updated" : "created"))
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
          <label className={styles.label}>Hall name</label>
          <input
            type="text"
            placeholder="e.g. Hall 1"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Total seats</label>
          <div className={styles.inputWithPrefix}>
            <span className={styles.inputPrefix}>seats</span>
            <input
              type="number"
              min="1"
              placeholder="e.g. 120"
              value={totalSeats}
              onChange={e => setTotalSeats(e.target.value)}
              className={styles.inputInner}
            />
          </div>
          <span className={styles.hint}>Determines how many seats appear in the seat picker</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Create hall"}
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