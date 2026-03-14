"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/app/admin/admin.module.scss"

export default function AdminNavLinks() {
  const pathname = usePathname()

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
    </div>
  )
}