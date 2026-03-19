export function isVipSeat(seatNumber: number, totalSeats: number): boolean {
  const totalRows = Math.ceil(totalSeats / 10)
  const vipStartRow = Math.floor(totalRows / 2) - 1
  const vipSeats = new Set<number>()
  Array.from({ length: 4 }, (_, i) => vipStartRow + i).forEach((rowIndex) => {
    const start = rowIndex * 10 + 1
    const end = Math.min(start + 9, totalSeats)
    for (let s = start; s <= end; s++) vipSeats.add(s)
  })
  return vipSeats.has(seatNumber)
}

export function getDisplayPrice(price: number, seatNumber: number, totalSeats: number): number {
  return isVipSeat(seatNumber, totalSeats)
    ? parseFloat((price * 1.5).toFixed(2))
    : price
}

export function getVipSeats(totalSeats: number): Set<number> {
  const totalRows = Math.ceil(totalSeats / 10)
  const vipStartRow = Math.floor(totalRows / 2) - 1
  const vipSeats = new Set<number>()
  Array.from({ length: 4 }, (_, i) => vipStartRow + i).forEach((rowIndex) => {
    const start = rowIndex * 10 + 1
    const end = Math.min(start + 9, totalSeats)
    for (let s = start; s <= end; s++) vipSeats.add(s)
  })
  return vipSeats
}