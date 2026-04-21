"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./Navbar.module.scss"

type NavbarProps = {
  user: { id: number; name: string; email: string; role: string } | null
}

const NAV_ITEMS = [
  { label: "Latest",    id: "popular",  type: "scroll" },
  { label: "In Cinema", id: "incinema", type: "scroll" },
  { label: "Upcoming",  id: "upcoming", type: "scroll" },
  { label: "Movies",    id: "movies",   type: "link",   href: "/movies" },
]

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null
  const [active, setActive] = useState("popular")
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })
  const innerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLElement | null)[]>([])
  const observersRef = useRef<IntersectionObserver[]>([])

  function setupObservers() {
    const sections = ["popular", "incinema", "upcoming"]
    observersRef.current = sections.map(id => {
      const el = document.getElementById(id)
      if (!el) return null as any
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
  }

  function teardownObservers() {
    observersRef.current.forEach(o => o?.disconnect())
    observersRef.current = []
  }

  useEffect(() => {
    if (pathname === "/movies") {
      setActive("movies")
      return
    }
    if (pathname !== "/") {
      setActive("")
      setPillStyle({ left: 0, width: 0 })
      return
    }
    setActive("popular")
    setupObservers()
    return () => teardownObservers()
  }, [pathname])

  useEffect(() => {
    const index = NAV_ITEMS.findIndex(item => item.id === active)
    const btn = buttonRefs.current[index]
    const container = innerRef.current
    if (!btn || !container) return

    const btnRect = btn.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    setPillStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    })
  }, [active])

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scrollTo(id: string) {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }

    teardownObservers()
    setActive(id)

    if (pathname !== "/") {
      router.push(`/#${id}`)
      return
    }

    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })

    scrollTimeoutRef.current = setTimeout(() => {
      setupObservers()
      scrollTimeoutRef.current = null
    }, 1200)
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <nav className={styles.nav}>

      {/* Logo */}
      <Link href="/" className={styles.logo}>CINEMA</Link>

      {/* Center pill nav */}
      <div className={styles.pillNav}>
        <div className={styles.pillInner} ref={innerRef}>

          <div
            className={styles.slidingPill}
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: active ? 1 : 0,
            }}
          />

          {NAV_ITEMS.map((item, i) =>
            item.type === "scroll" ? (
              <button
                key={item.id}
                ref={el => { buttonRefs.current[i] = el }}
                onClick={() => scrollTo(item.id)}
                className={`${styles.link} ${active === item.id ? styles.linkActive : ""}`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={item.href!}
                ref={el => { buttonRefs.current[i] = el }}
                onClick={() => setActive(item.id)}
                className={`${styles.link} ${active === item.id ? styles.linkActive : ""}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Right side */}
      <div className={styles.auth}>
        {user ? (
          <>
            <Link
              href="/my-bookings"
              className={`${styles.usernameBtn} ${pathname === "/my-bookings" ? styles.usernameBtnActive : ""}`}
            >
              {user.name}
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" className={styles.adminBtn}>
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginLink}>Login</Link>
            <Link href="/register" className={styles.signupBtn}>Sign up</Link>
          </>
        )}
      </div>

    </nav>
  )
}