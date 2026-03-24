import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"
import BookingCard from "@/components/BookingCard"
import FavoriteCard from "@/components/FavoriteCard"
import MyBookingsTabs from "@/components/MyBookingsTabs"
import styles from "./my-bookings.module.scss"

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your cinema bookings and favorite movies.",
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { projection: { include: { movie: true, hall: true } } },
    orderBy: { createdAt: "desc" },
  })

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  })

  const upcoming = bookings.filter((b) => new Date(b.projection.startTime) >= new Date())
  const past = bookings.filter((b) => new Date(b.projection.startTime) < new Date())

  const bookingsContent = (
    <>
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
    </>
  )

  const favoritesContent = (
    <>
      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No favorites yet.</p>
          <a href="/movies" className={styles.emptyLink}>Browse movies →</a>
        </div>
      ) : (
        <div className={styles.cards}>
          {favorites.map((f) => (
            <FavoriteCard
              key={f.id}
              favoriteId={f.id}
              movieId={f.movie.id}
              title={f.movie.title}
              posterUrl={f.movie.posterUrl}
              genre={f.movie.genre}
              rating={f.movie.rating}
              ageRating={f.movie.ageRating}
              duration={f.movie.duration}
            />
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.subtitle}>{bookings.length} bookings · {favorites.length} favorites</p>
        </div>

        <MyBookingsTabs
          bookingsCount={bookings.length}
          favoritesCount={favorites.length}
          bookingsContent={bookingsContent}
          favoritesContent={favoritesContent}
        />
      </div>
    </div>
  )
}
