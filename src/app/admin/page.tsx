import { prisma } from "@/lib/db"
import Link from "next/link"
import styles from "./admin.module.scss"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default async function AdminDashboard() {
  const [movieCount, projectionCount, bookingCount] = await Promise.all([
    prisma.movie.count(),
    prisma.projection.count(),
    prisma.booking.count(),
  ])

  const upcoming = await prisma.projection.findMany({
    where: { startTime: { gte: new Date() } },
    include: { movie: true, hall: true, _count: { select: { bookings: true } } },
    orderBy: { startTime: "asc" },
    take: 5,
  })

  return (
    <div>
      {/* Hero banner */}
      <div className={styles.hero}>
        <div className={styles.heroBubble1} />
        <div className={styles.heroBubble2} />
        <div className={styles.heroBubble3} />
        <p className={styles.heroEyebrow}>Cinema Admin</p>
        <h1 className={styles.heroTitle}>{getGreeting()}</h1>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <p className={styles.heroStatValue} style={{ color: "#58a6ff" }}>{movieCount}</p>
            <p className={styles.heroStatLabel}>Movies</p>
          </div>
          <div className={styles.heroStat}>
            <p className={styles.heroStatValue} style={{ color: "#3fb950" }}>{projectionCount}</p>
            <p className={styles.heroStatLabel}>Projections</p>
          </div>
          <div className={styles.heroStat}>
            <p className={styles.heroStatValue} style={{ color: "#f78166" }}>{bookingCount}</p>
            <p className={styles.heroStatLabel}>Tickets sold</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <Link href="/movies" className={styles.statCard}>
          <div className={styles.statGlow} style={{ background: "#58a6ff22" }} />
          <p className={styles.statLabel} style={{ color: "#58a6ff" }}>Movies</p>
          <p className={styles.statValue}>{movieCount}</p>
        </Link>
        <Link href="/admin/projections" className={styles.statCard}>
          <div className={styles.statGlow} style={{ background: "#3fb95022" }} />
          <p className={styles.statLabel} style={{ color: "#3fb950" }}>Projections</p>
          <p className={styles.statValue}>{projectionCount}</p>
        </Link>
        <Link href="/admin/projections" className={styles.statCard}>
          <div className={styles.statGlow} style={{ background: "#f7816622" }} />
          <p className={styles.statLabel} style={{ color: "#f78166" }}>Tickets sold</p>
          <p className={styles.statValue}>{bookingCount}</p>
        </Link>
      </div>

      {/* Upcoming projections table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Upcoming projections</h2>
          <Link href="/admin/projections/new" className={styles.addButton}>+ Add new</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className={styles.emptyState}>
            No upcoming projections. <Link href="/admin/projections/new">Add one</Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {["Movie", "Hall", "Date & time", "Sold", ""].map(h => (
                  <th key={h} className={styles.tableTh}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(p => {
                  const duration = p.movie.duration > 0 ? p.movie.duration : 90
                  const endTime = new Date(new Date(p.startTime).getTime() + duration * 60 * 1000)

                  return (
                    <tr key={p.id}>
                      <td className={`${styles.tableTd} ${styles.primary}`}>{p.movie.title}</td>
                      <td className={styles.tableTd}>{p.hall.name}</td>
                      <td className={styles.tableTd}>
                      {new Date(p.startTime).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                      {" → "}
                      {endTime.toLocaleTimeString("en-GB", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                      </td>
                      <td className={styles.tableTd}>{p._count.bookings} / {p.hall.totalSeats}</td>
                      <td className={styles.tableTd} style={{ textAlign: "right" }}>
                        <Link href={`/admin/projections/${p.id}`} className={styles.editLink}>Edit</Link>
                      </td>
                    </tr>
                )
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}