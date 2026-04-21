import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Cinema account to book tickets and save favorites.",
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
