"use client"

interface SeatPickerProps {
  totalSeats: number
  takenSeats: number[]
  selectedSeats: number[]
  onToggleSeat: (seat: number) => void
}

export default function SeatPicker({ totalSeats, takenSeats, selectedSeats, onToggleSeat }: SeatPickerProps) {
  const seatsPerRow = 10
  const rows: number[][] = []
  const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1)
  for (let i = 0; i < allSeats.length; i += seatsPerRow) {
    rows.push(allSeats.slice(i, i + seatsPerRow))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "15px" }}>

      <div style={{ width: "50%", textAlign: "center", borderTop: "2px solid #f5c518", paddingTop: "4px", fontSize: "14px", letterSpacing: "2px", color: "#888" }}>
        SCREEN
      </div>

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", alignItems: "center", gap: "6px" }}>

          <span style={{ width: "1rem", fontSize: "12px", color: "#666" }}>
            {String.fromCharCode(65 + rowIndex)}
          </span>

          {row.map((seat) => {
            const isTaken = takenSeats.includes(seat)
            const isSelected = selectedSeats.includes(seat)

            let bg = "#2a2a2a"
            if (isSelected) bg = "#f5c518"
            if (isTaken)    bg = "#1a1a1a"

            return (
              <button
                key={seat}
                disabled={isTaken}
                onClick={() => onToggleSeat(seat)}
                style={{
                  width: "28px",
                  height: "28px",
                  background: bg,
                  color: isSelected ? "#000" : "#555",
                  border: "1px solid #333",
                  borderRadius: "4px 4px 2px 2px",
                  fontSize: "12px",
                  cursor: isTaken ? "not-allowed" : "pointer",
                }}
              >
                {isTaken ? "×" : ""}
              </button>
            )
          })}

          <span style={{ width: "8px", fontSize: "10px", color: "#666" }}>
            {String.fromCharCode(65 + rowIndex)}
          </span>
        </div>
      ))}

      <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
        {[
          { color: "#2a2a2a", label: "Free" },
          { color: "#f5c518", label: "Selected" },
          { color: "#1a1a1a", label: "Taken" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#888" }}>
            <div style={{ width: "14px", height: "14px", background: color, border: "1px solid #333", borderRadius: "3px" }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}