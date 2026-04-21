"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from "./DeleteProjectionButton.module.scss"

export default function DeleteProjectionButton({ id }: { id: number }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/projections/${id}`, { method: "DELETE" })
    router.push("/admin/projections")
  }

  if (confirm) {
    return (
      <div className={styles.confirmRow}>
        <button onClick={handleDelete} disabled={loading} className={styles.confirmButton}>
          {loading ? "Deleting..." : "Confirm Delete"}
        </button>
        <button onClick={() => setConfirm(false)} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirm(true)} className={styles.deleteButton}>
      Delete
    </button>
  )
}