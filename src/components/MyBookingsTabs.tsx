"use client"

import { useState } from "react"
import styles from "./MyBookingsTabs.module.scss"

type Tab = "bookings" | "favorites"

interface MyBookingsTabsProps {
  bookingsCount: number
  favoritesCount: number
  bookingsContent: React.ReactNode
  favoritesContent: React.ReactNode
}

export default function MyBookingsTabs({
  bookingsCount,
  favoritesCount,
  bookingsContent,
  favoritesContent,
}: MyBookingsTabsProps) {
  const [active, setActive] = useState<Tab>("bookings")

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${active === "bookings" ? styles.tabActive : ""}`}
          onClick={() => setActive("bookings")}
        >
          My Bookings
          <span className={styles.tabCount}>{bookingsCount}</span>
        </button>
        <button
          className={`${styles.tab} ${active === "favorites" ? styles.tabActive : ""}`}
          onClick={() => setActive("favorites")}
        >
          My Favorites
          <span className={styles.tabCount}>{favoritesCount}</span>
        </button>
      </div>

      <div className={styles.content}>
        {active === "bookings" ? bookingsContent : favoritesContent}
      </div>
    </>
  )
}
