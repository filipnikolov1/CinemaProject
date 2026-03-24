import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Cinema account to book tickets and manage bookings.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
