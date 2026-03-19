import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"
import BookingCard from "@/components/BookingCard"
import styles from "./my-bookings.module.scss"

export default async function MyBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { projection: { include: { movie: true, hall: true } } },
    orderBy: { createdAt: "desc" },
  })

  const upcoming = bookings.filter((b) => new Date(b.projection.startTime) >= new Date())
  const past = bookings.filter((b) => new Date(b.projection.startTime) < new Date())

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <div className={styles.header}>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>{bookings.length} total · {upcoming.length} upcoming</p>
        </div>

        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>You have no bookings yet.</p>
            <a href="/movies" className={styles.emptyLink}>Browse movies →</a>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Upcoming</span>
                  <span className={styles.sectionCount}>{upcoming.length}</span>
                </div>
                <div className={styles.cards}>
                  {upcoming.map((b) => (
                    <BookingCard
                      key={b.id}
                      id={b.id}
                      movieTitle={b.projection.movie.title}
                      posterUrl={b.projection.movie.posterUrl}
                      hallName={b.projection.hall.name}
                      hallTotalSeats={b.projection.hall.totalSeats}
                      startTime={b.projection.startTime.toISOString()}
                      seatNumber={b.seatNumber}
                      price={b.projection.price}
                      ticketCode={b.ticketCode}
                    />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>History</span>
                  <span className={styles.sectionCount}>{past.length}</span>
                </div>
                <div className={styles.cards}>
                  {past.map((b) => (
                    <BookingCard
                      key={b.id}
                      id={b.id}
                      movieTitle={b.projection.movie.title}
                      posterUrl={b.projection.movie.posterUrl}
                      hallName={b.projection.hall.name}
                      hallTotalSeats={b.projection.hall.totalSeats}
                      startTime={b.projection.startTime.toISOString()}
                      seatNumber={b.seatNumber}
                      price={b.projection.price}
                      ticketCode={b.ticketCode}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}