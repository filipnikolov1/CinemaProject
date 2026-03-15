const SECRET = process.env.JWT_SECRET || "changeme_secret"

export interface JWTPayload {
  id: number
  email: string
  role: string
  name: string
}

// Only used in API routes (Node.js runtime)
export function signToken(payload: JWTPayload): string {
  const jwt = require("jsonwebtoken")
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

// Edge-compatible verify for middleware
export function verifyToken(token: string): JWTPayload | null {
  try {
    const jwt = require("jsonwebtoken")
    return jwt.verify(token, SECRET) as JWTPayload
  } catch {
    return null
  }
}