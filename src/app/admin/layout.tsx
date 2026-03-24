import type { Metadata } from "next"
import styles from "./admin.module.scss"
import { Suspense } from "react"
import AdminLoadingSpinner from "./loading"
import AdminNavLinks from "@/components/admin/AdminNavLinks"

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Cinema administration — manage movies, halls, projections and bookings.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.navBrand}>
            <div className={styles.navIcon}>🎬</div>
            <span className={styles.navTitle}>Cinema Admin</span>
          </div>
          <AdminNavLinks />
        </div>
      </nav>
      <Suspense fallback={<AdminLoadingSpinner />}>
        <div className={styles.content}>
          {children}
        </div>
      </Suspense>
    </div>
  )
}