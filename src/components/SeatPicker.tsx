"use client"
import styles from "./SeatPicker.module.scss"

interface SeatPickerProps {
  totalSeats: number
  takenSeats: number[]
  selectedSeats: number[]
  onToggleSeat: (seat: number) => void
  vipSeats?: Set<number>
}

export default function SeatPicker({ totalSeats, takenSeats, selectedSeats, onToggleSeat, vipSeats = new Set() }: SeatPickerProps) {
  const seatsPerRow = 10
  const aisleAfter = 5
  const rows: number[][] = []
  const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1)
  for (let i = 0; i < allSeats.length; i += seatsPerRow) {
    rows.push(allSeats.slice(i, i + seatsPerRow))
  }

  function renderSeat(seat: number, rowIndex: number) {
    const isTaken = takenSeats.includes(seat)
    const isSelected = selectedSeats.includes(seat)
    const isVip = vipSeats.has(seat)

    return (
      <button
        key={seat}
        disabled={isTaken}
        onClick={() => onToggleSeat(seat)}
        className={[
          styles.seat,
          isVip ? styles.vip : "",
          isSelected ? styles.selected : "",
          isTaken ? styles.taken : "",
        ].join(" ")}
        title={isTaken ? "Taken" : `${isVip ? "VIP · " : ""}Row ${rowIndex + 1} Seat ${seat}`}
      />
    )
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.screenWrap}>
        <div className={styles.screen}>SCREEN</div>
      </div>

      <div className={styles.grid}>
        {rows.map((row, rowIndex) => {
          const left = row.slice(0, aisleAfter)
          const right = row.slice(aisleAfter)
          const leftPadded = [...left, ...Array(aisleAfter - left.length).fill(null)]
          const rightPadded = [...right, ...Array(aisleAfter - right.length).fill(null)]
          const isShortRow = row.length <= aisleAfter

          return (
            <div key={rowIndex}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Row {rowIndex + 1}</span>

                {isShortRow ? (
                  <div className={styles.seatGroupFull}>
                    {row.map((seat) => renderSeat(seat, rowIndex))}
                  </div>
                ) : (
                  <>
                    <div className={styles.seatGroup}>
                      {leftPadded.map((seat, i) =>
                        seat === null
                          ? <div key={`lpad-${i}`} className={styles.seatPlaceholder} />
                          : renderSeat(seat, rowIndex)
                      )}
                    </div>

                    <div className={styles.aisle} />

                    <div className={styles.seatGroup}>
                      {rightPadded.map((seat, i) =>
                        seat === null
                          ? <div key={`rpad-${i}`} className={styles.seatPlaceholder} />
                          : renderSeat(seat, rowIndex)
                      )}
                    </div>
                  </>
                )}

                <div className={styles.rowSpacer} />
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendSeat} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.legendSelected}`} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.legendVip}`} />
          <span>VIP</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.legendTaken}`} />
          <span>Taken</span>
        </div>
      </div>
    </div>
  )
}