import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Ticket from "@/components/Ticket"
import Link from "next/link"
import styles from "./confirm.module.scss"
import { getDisplayPrice } from "@/lib/vip"
import { Suspense } from "react"
import ToastFromParams from "@/components/admin/ToastFromParams"

interface ConfirmPageProps {
  searchParams: Promise<{ bookingId?: string; allIds?: string }>
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { bookingId, allIds } = await searchParams
  if (!bookingId) notFound()

  const bookingIds = allIds ? allIds.split(",").map(Number) : [Number(bookingId)]

  const bookings = await prisma.booking.findMany({
    where: { id: { in: bookingIds } },
    include: {
      projection: {
        include: { movie: true, hall: true },
      },
    },
  })

  if (bookings.length === 0) notFound()

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Suspense>
          <ToastFromParams messages={{ booked: "Booking confirmed!" }} />
        </Suspense>

        <div className={styles.header}>
          <div className={styles.checkmark}>✓</div>
          <h1 className={styles.title}>Booking confirmed</h1>
          <p className={styles.subtitle}>
            {bookings.length === 1
              ? "Your ticket is ready. Show the code at the entrance."
              : `${bookings.length} tickets ready. Show the codes at the entrance.`}
          </p>
        </div>

        <div className={styles.tickets}>
          {bookings.map((booking) => (
            <Ticket
              key={booking.id}
              movieTitle={booking.projection.movie.title}
              hallName={booking.projection.hall.name}
              startTime={booking.projection.startTime.toISOString()}
              seatNumber={booking.seatNumber}
              price={getDisplayPrice(
                booking.projection.price,
                booking.seatNumber,
                booking.projection.hall.totalSeats
              )}
              ticketCode={booking.ticketCode}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/my-bookings" className={styles.primaryButton}>
            My Bookings
          </Link>
          <Link href="/movies" className={styles.secondaryButton}>
            Back to Movies
          </Link>
        </div>

      </div>
    </div>
  )
}