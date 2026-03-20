"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import styles from "@/app/admin/admin.module.scss"
import Toast from "@/components/admin/Toast"

export default function AdminNavLinks() {
  const pathname = usePathname()
  const router = useRouter()
  const [fetching, setFetching] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  async function handleFetchMovies() {
    setFetching(true)
    try {
      const res = await fetch("/api/movies/fetch", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setToast({ message: data.message, type: "success" })
      } else {
        setToast({ message: data.error || "Fetch failed", type: "error" })
      }
    } catch {
      setToast({ message: "Network error", type: "error" })
    } finally {
      setFetching(false)
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
      <div className={styles.navLinks}>
        <Link
          href="/admin"
          className={`${styles.navLink} ${pathname === "/admin" ? styles.navLinkActive : ""}`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/projections"
          className={`${styles.navLink} ${pathname.startsWith("/admin/projections") ? styles.navLinkActive : ""}`}
        >
          Projections
        </Link>
        <Link
          href="/admin/bookings"
          className={`${styles.navLink} ${pathname.startsWith("/admin/bookings") ? styles.navLinkActive : ""}`}
        >
          Bookings
        </Link>
        <Link
          href="/admin/halls"
          className={`${styles.navLink} ${pathname.startsWith("/admin/halls") ? styles.navLinkActive : ""}`}
        >
          Halls
        </Link>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
        <button
          onClick={handleFetchMovies}
          disabled={fetching}
          className={styles.fetchButton}
        >
          {fetching ? "Fetching..." : "Fetch Movies"}
        </button>
      </div>
    </>
  )
}