import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const projections = await prisma.projection.findMany({
    include: {
      movie: true,
      hall: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { startTime: "asc" },
  })
  return NextResponse.json(projections)
}

export async function POST(req: Request) {
  try {
    const { movieId, hallId, startTime, price } = await req.json()

    if (!movieId || !hallId || !startTime || !price) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    const movie = await prisma.movie.findUnique({
      where: { id: Number(movieId) },
    })

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    const start = new Date(startTime)
    const duration = movie.duration > 0 ? movie.duration : 90
    const end = new Date(start.getTime() + duration * 60 * 1000)

    // Check for overlapping projections in the same hall
    const overlap = await prisma.projection.findFirst({
      where: {
        hallId: Number(hallId),
        AND: [
          // Existing projection starts before our new one ends
          { startTime: { lt: end } },
          // Existing projection ends after our new one starts
          // We calculate end time by joining with movie duration
          {
            movie: {
              // existing start + existing duration > new start
              // We can't do this math in Prisma directly so we fetch
              // candidates and filter in JS below
            }
          }
        ]
      },
      include: { movie: true },
    })

    // Fetch all projections in this hall and check overlap in JS
    const hallProjections = await prisma.projection.findMany({
      where: { hallId: Number(hallId) },
      include: { movie: true },
    })

    const conflicting = hallProjections.find(p => {
      const existingStart = new Date(p.startTime)
      const existingEnd = new Date(existingStart.getTime() + p.movie.duration * 60 * 1000)
      // Check if time ranges overlap
      return start < existingEnd && end > existingStart
    })

    if (conflicting) {
      const conflictStart = new Date(conflicting.startTime)
      const conflictEnd = new Date(conflictStart.getTime() + conflicting.movie.duration * 60 * 1000)
      return NextResponse.json({
        error: `Hall is occupied by "${conflicting.movie.title}" from ${conflictStart.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} to ${conflictEnd.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} on ${conflictStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
      }, { status: 409 })
    }

    const projection = await prisma.projection.create({
      data: {
        movieId: Number(movieId),
        hallId: Number(hallId),
        startTime: start,
        price: Number(price),
      },
      include: { movie: true, hall: true },
    })

    return NextResponse.json(projection, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create projection" }, { status: 500 })
  }
}