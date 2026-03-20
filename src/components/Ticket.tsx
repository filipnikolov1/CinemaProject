import styles from "./Ticket.module.scss"

interface TicketProps {
  movieTitle: string
  hallName: string
  startTime: string
  seatNumber: number
  price: number
  ticketCode: string
}

export default function Ticket({ movieTitle, hallName, startTime, seatNumber, price, ticketCode }: TicketProps) {
  const date = new Date(startTime)
  const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  const formattedTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={styles.ticket}>
      <div className={styles.accent} />

      <div className={styles.main}>
        <p className={styles.brand}>CINEMA</p>
        <h2 className={styles.title}>{movieTitle}</h2>
        <p className={styles.meta}>
          {formattedDate} · {formattedTime} · {hallName} · €{price.toFixed(2)}
        </p>
      </div>

      <div className={styles.divider}>
        <div className={styles.notchTop} />
        <div className={styles.notchBottom} />
      </div>

      <div className={styles.stub}>
        <p className={styles.stubLabel}>SEAT</p>
        <p className={styles.stubSeat}>{seatNumber}</p>
        <p className={styles.stubCode}>{ticketCode.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  )
}