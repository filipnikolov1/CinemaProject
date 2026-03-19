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
  const formattedDate = date.toLocaleDateString("mk-MK", { day: "2-digit", month: "long", year: "numeric" })
  const formattedTime = date.toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" })

  return (
    <div style={{ marginTop:"5px",display: "flex", background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px", overflow: "hidden", maxWidth: "650px", width: "100%" }}>

      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ color: "#f5c518", fontSize: "20px", fontWeight: "bold", letterSpacing: "2px", margin: 0 }}>CINEMA</p>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff", margin: 0 }}>{movieTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
          {[
            { label: "Датум",  value: formattedDate },
            { label: "Термин", value: formattedTime },
            { label: "Сала",   value: hallName },
            { label: "Цена",   value: `${price} ден` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 6px 0", textTransform: "uppercase" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "#ccc", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "1px", background: "#333", margin: "2px 0" }} />

      <div style={{ width: "150px", background: "#f5c518", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <p style={{ fontSize: "12px", fontWeight: "bold", color: "#000", letterSpacing: "2px", margin: 0 }}>МЕСТО</p>
        <p style={{ fontSize: "36px", fontWeight: "900", color: "#000", margin: 0, lineHeight: 1 }}>{seatNumber}</p>
        <p style={{ fontSize: "15px", color: "#555", fontFamily: "monospace", margin: 0 }}>{ticketCode.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  )
}