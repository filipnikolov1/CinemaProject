import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { redirect } from "next/navigation"
import BookingCard from "@/components/BookingCard"

export default async function MyBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { projection: { include: { movie: true, hall: true } } },
    orderBy: { createdAt: "desc" },
  })

  const upcoming = bookings.filter((b) => new Date(b.projection.startTime) >= new Date())
  const past     = bookings.filter((b) => new Date(b.projection.startTime) < new Date())

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fff", fontFamily: "Arial, sans-serif", padding: "30px", maxWidth: "100vw", margin: "0 auto" }}>

      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>🎟️ Моите резервации</h1>

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", padding: "10px 0" }}>
          <p>Немате резервации.</p>
          <a href="/movies" style={{ color: "#f5c518" }}>Разгледај филмови →</a>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#555", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "2px", borderBottom: "1px solid #1a1a1a", paddingBottom: "3px" }}>Претстојни</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {upcoming.map((b) => (
                  <BookingCard key={b.id} id={b.id} movieTitle={b.projection.movie.title} posterUrl={b.projection.movie.posterUrl} hallName={b.projection.hall.name} startTime={b.projection.startTime.toISOString()} seatNumber={b.seatNumber} price={b.projection.price} ticketCode={b.ticketCode} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <p style={{ fontSize: "14px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "3px", borderBottom: "1px solid #1a1a1a", paddingBottom: "4px" }}>Историја</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {past.map((b) => (
                  <BookingCard key={b.id} id={b.id} movieTitle={b.projection.movie.title} posterUrl={b.projection.movie.posterUrl} hallName={b.projection.hall.name} startTime={b.projection.startTime.toISOString()} seatNumber={b.seatNumber} price={b.projection.price} ticketCode={b.ticketCode} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}