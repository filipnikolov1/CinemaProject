import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import ToastFromParams from "@/components/admin/ToastFromParams"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getCurrentUser } from "@/lib/getCurrentUser"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Cinema — Book Movie Tickets Online",
    template: "%s — Cinema",
  },
  description: "Browse latest movies, check showtimes and book tickets online.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar user={user} />
        <Suspense>
          <ToastFromParams
            messages={{
              login: "Welcome back!",
            }}
          />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  )
}