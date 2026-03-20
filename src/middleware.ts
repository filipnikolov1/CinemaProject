import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getTokenPayload(token: string) {
  try {
    const base64Payload = token.split(".")[1]
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8")
    )
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

function redirectToLogin(req: NextRequest, pathname: string) {
  const url = new URL("/login", req.url)
  url.searchParams.set("redirect", pathname)
  url.searchParams.set("reason", "auth")
  return NextResponse.redirect(url)
}

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl
  const httpMethod = req.method

  if (pathname.startsWith("/admin")) {
    if (!token) return redirectToLogin(req, pathname)
    const payload = getTokenPayload(token)
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname.startsWith("/my-bookings")) {
    if (!token) return redirectToLogin(req, pathname)
    const payload = getTokenPayload(token)
    if (!payload) return redirectToLogin(req, pathname)
  }

  if (pathname.startsWith("/bookings")) {
    if (!token) return redirectToLogin(req, pathname)
    const payload = getTokenPayload(token)
    if (!payload) return redirectToLogin(req, pathname)
  }

  if (pathname.startsWith("/api/bookings")) {
    if (!token) return unauthorized()
    const payload = getTokenPayload(token)
    if (!payload) return unauthorized()
  }

  if (pathname.startsWith("/api/halls") && httpMethod !== "GET") {
    if (!token) return unauthorized()
    const payload = getTokenPayload(token)
    if (!payload) return unauthorized()
    if (payload.role !== "ADMIN") return forbidden("Admin access required")
  }

  if (pathname.startsWith("/api/projections") && httpMethod !== "GET") {
    if (!token) return unauthorized()
    const payload = getTokenPayload(token)
    if (!payload) return unauthorized()
    if (payload.role !== "ADMIN") return forbidden("Admin access required")
  }

  if (pathname === "/api/movies/fetch") {
    if (!token) return unauthorized()
    const payload = getTokenPayload(token)
    if (!payload) return unauthorized()
    if (payload.role !== "ADMIN") return forbidden("Admin access required")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-bookings/:path*",
    "/bookings/:path*",
    "/api/bookings/:path*",
    "/api/halls/:path*",
    "/api/projections/:path*",
    "/api/movies/fetch",
  ],
}