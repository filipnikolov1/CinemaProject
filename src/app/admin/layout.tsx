import Link from "next/link"
import styles from "./admin.module.scss"
import { Suspense } from "react"
import AdminLoadingSpinner from "./loading"
import AdminNavLinks from "@/components/admin/AdminNavLinks"

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
        <Link href="/" className={styles.backLink}>← Back to site</Link>
      </nav>
      <Suspense fallback={<AdminLoadingSpinner />}>
        <div className={styles.content}>
          {children}
        </div>
      </Suspense>
    </div>
  )
}