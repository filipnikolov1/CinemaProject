"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import styles from "@/app/admin/admin.module.scss"

export default function AdminNavLinks() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
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
        href="/admin/halls"
        className={`${styles.navLink} ${pathname.startsWith("/admin/halls") ? styles.navLinkActive : ""}`}
      >
        Halls
      </Link>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  )
}