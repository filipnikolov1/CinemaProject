import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Select Seats",
  description: "Choose your seats and complete your cinema booking.",
}

export default function SeatsLayout({ children }: { children: React.ReactNode }) {
  return children
}
