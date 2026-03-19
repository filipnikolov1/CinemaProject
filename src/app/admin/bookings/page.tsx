import { prisma } from "@/lib/db"
import styles from "@/app/admin/admin.module.scss"
import { Suspense } from "react"
import ToastFromParams from "@/components/admin/ToastFromParams"
import { getDisplayPrice, isVipSeat } from "@/lib/vip"

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const bookings = await prisma.booking.findMany({
    where: search ? {
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { projection: { movie: { title: { contains: search, mode: "insensitive" } } } },
      ]
    } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      projection: {
        include: { movie: true, hall: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className={styles.pageHeaderRow}>
        <div>
          <h1>Bookings</h1>
          <p>{bookings.length} total bookings</p>
        </div>
      </div>

      <form className={styles.filterBar}>
        <input
          type="text"
          name="search"
          placeholder="Search by user or movie..."
          defaultValue={search || ""}
          className={styles.filterInput}
        />
        <button type="submit" className={styles.filterButton}>Search</button>
        <a href="/admin/bookings" className={styles.filterClear}>Clear</a>
      </form>

      <div className={styles.tableCard}>
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>No bookings found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {["User", "Movie", "Hall", "Date & Time", "Seat", "Price", "Ticket Code"].map(h => (
                  <th key={h} className={styles.tableTh}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => {
                const isPast = new Date(b.projection.startTime) < new Date()
                return (
                  <tr key={b.id}>
                    <td className={styles.tableTd}>
                      <p style={{ margin: 0, color: "#e6edf3", fontWeight: 500 }}>{b.user.name}</p>
                      <p style={{ margin: 0, fontSize: 11 }}>{b.user.email}</p>
                    </td>
                    <td className={`${styles.tableTd} ${styles.primary}`}>{b.projection.movie.title}</td>
                    <td className={styles.tableTd}>{b.projection.hall.name}</td>
                    <td className={styles.tableTd}>
                      {new Date(b.projection.startTime).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className={styles.tableTd}>{b.seatNumber}</td>
                    <td className={styles.tableTd}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        €{getDisplayPrice(b.projection.price, b.seatNumber, b.projection.hall.totalSeats).toFixed(2)}
                        {isVipSeat(b.seatNumber, b.projection.hall.totalSeats) && (
                          <span className={styles.badgeVip}>VIP</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.tableTd}>
                      <span className={`${styles.ticketCode} ${isPast ? styles.ticketCodePast : ""}`}>
                        {b.ticketCode.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <Suspense>
        <ToastFromParams messages={{}} />
      </Suspense>
    </div>
  )
}