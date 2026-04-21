import { prisma } from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"
import ToastFromParams from "@/components/admin/ToastFromParams"
import styles from "../admin.module.scss"

export default async function ProjectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; hall?: string; sort?: string }>
}) {
  const { search, hall, sort } = await searchParams

  const halls = await prisma.hall.findMany({ orderBy: { name: "asc" } })

  const projections = await prisma.projection.findMany({
    where: {
      ...(search ? { movie: { title: { contains: search, mode: "insensitive" } } } : {}),
      ...(hall ? { hallId: Number(hall) } : {}),
    },
    include: { movie: true, hall: true, _count: { select: { bookings: true } } },
    orderBy: sort === "movie"
      ? { movie: { title: "asc" } }
      : sort === "hall"
      ? { hall: { name: "asc" } }
      : { startTime: "asc" },
  })

  const now = new Date()
  const upcoming = projections.filter(p => new Date(p.startTime) >= now)
  const past = projections.filter(p => new Date(p.startTime) < now)

  function renderTable(list: typeof projections) {
    if (list.length === 0) return (
      <div className={styles.emptyState}>No projections found.</div>
    )

    return (
      <table className={styles.table}>
        <thead>
          <tr>
            {["Movie", "Duration", "Hall", "Date & Time", "Price", "Sold", ""].map(h => (
              <th key={h} className={styles.tableTh}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map(p => {
            const duration = p.movie.duration > 0 ? p.movie.duration : 90
            const endTime = new Date(new Date(p.startTime).getTime() + duration * 60 * 1000)
            const soldOut = p._count.bookings >= p.hall.totalSeats

            return (
              <tr key={p.id}>
                <td className={`${styles.tableTd} ${styles.primary}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.movie.title}
                    {soldOut && <span className={styles.badgeSoldOut}>Sold out</span>}
                  </div>
                </td>
                <td className={styles.tableTd}>
                  {Math.floor(duration / 60)}h {duration % 60}m
                </td>
                <td className={styles.tableTd}>{p.hall.name}</td>
                <td className={styles.tableTd}>
                  {new Date(p.startTime).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                  {" → "}
                  {endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className={styles.tableTd}>€{p.price.toFixed(2)}</td>
                <td className={styles.tableTd}>{p._count.bookings} / {p.hall.totalSeats}</td>
                <td className={styles.tableTd}>
                  <Link href={`/admin/projections/${p.id}`} className={styles.editLink}>Edit</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <div className={styles.pageHeaderRow}>
        <div>
          <h1>Projections</h1>
          <p>{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <Link href="/admin/projections/new" className={styles.addButtonLarge}>+ Add Projection</Link>
      </div>

      <form className={styles.filterBar}>
        <input
          type="text"
          name="search"
          placeholder="Search by movie..."
          defaultValue={search || ""}
          className={styles.filterInput}
        />
        <select name="hall" defaultValue={hall || ""} className={styles.filterSelect}>
          <option value="">All halls</option>
          {halls.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort || ""} className={styles.filterSelect}>
          <option value="">Sort by date</option>
          <option value="movie">Sort by movie</option>
          <option value="hall">Sort by hall</option>
        </select>
        <button type="submit" className={styles.filterButton}>Apply</button>
        <Link href="/admin/projections" className={styles.filterClear}>Clear</Link>
      </form>

      {/* Upcoming */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <span className={styles.tableSectionTitle}>Upcoming</span>
          <span className={styles.tableSectionCount}>{upcoming.length}</span>
        </div>
        <div className={styles.tableCard}>
          {renderTable(upcoming)}
        </div>
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <span className={styles.tableSectionTitle}>Past</span>
            <span className={styles.tableSectionCount}>{past.length}</span>
          </div>
          <div className={`${styles.tableCard} ${styles.tableCardMuted}`}>
            {renderTable(past)}
          </div>
        </div>
      )}

      <Suspense>
        <ToastFromParams
          messages={{
            created: "Projection added!",
            updated: "Projection updated!",
          }}
        />
      </Suspense>
    </div>
  )
}