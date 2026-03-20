"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type NavbarProps = {
  user: { id: number; name: string; email: string; role: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px",
      height: 68,
      background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      transition: "background 0.35s, border-color 0.35s, backdrop-filter 0.35s",
    }}>
      {/* Logo */}
      <Link href="/" style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 2.5,
        textDecoration: "none",
      }}>
        CINEMA
      </Link>

      {/* Center pill nav */}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: 100,
        padding: "4px 6px",
      }}>
        {[
          { label: "Latest", id: "popular" },
          { label: "In Cinema", id: "incinema" },
          { label: "Upcoming", id: "upcoming" },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            style={{
              color: "#aaa",
              fontSize: 14,
              fontWeight: 500,
              background: "none",
              border: "none",
              padding: "8px 20px",
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.background = "none" }}
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/movies"
          style={{
            color: "#aaa",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            padding: "8px 20px",
            borderRadius: 100,
            transition: "color 0.2s, background 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.background = "none" }}
        >
          Movies
        </Link>
      </div>

      {/* Right auth */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {user ? (
          <>
            <span style={{ color: "#ccc", fontSize: 14, fontWeight: 500 }}>{user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                color: "#888",
                fontSize: 14,
                background: "none",
                border: "1px solid #333",
                borderRadius: 100,
                padding: "7px 18px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "#555" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333" }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#ccc", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Login
            </Link>
            <Link href="/register" style={{
              background: "#f5c518",
              color: "#000",
              padding: "9px 24px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
