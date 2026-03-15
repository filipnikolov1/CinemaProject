import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getTokenPayload(token: string) {
  try {
    // JWT is base64url encoded — decode the payload (middle part)
    const base64Payload = token.split(".")[1]
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8")
    )
    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const payload = getTokenPayload(token)
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname.startsWith("/my-bookings")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const payload = getTokenPayload(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/my-bookings/:path*"],
}