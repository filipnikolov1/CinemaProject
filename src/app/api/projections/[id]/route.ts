import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const projection = await prisma.projection.findUnique({
      where: { id: Number(id) },
      include: { movie: true, hall: true },
    })
    if (!projection) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(projection)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get projection" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const currentId = Number(id)
    const { movieId, hallId, startTime, price } = await req.json()

    const movie = await prisma.movie.findUnique({
      where: { id: Number(movieId) },
    })

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    const start = new Date(startTime)
    const duration = movie.duration > 0 ? movie.duration : 90
    const end = new Date(start.getTime() + duration * 60 * 1000)

    // Fetch all projections in this hall EXCEPT the one being edited
    const hallProjections = await prisma.projection.findMany({
      where: {
        hallId: Number(hallId),
        NOT: { id: currentId },
      },
      include: { movie: true },
    })

    const conflicting = hallProjections.find(p => {
      const existingStart = new Date(p.startTime)
      const existingDuration = p.movie.duration > 0 ? p.movie.duration : 90
      const existingEnd = new Date(existingStart.getTime() + existingDuration * 60 * 1000)
      return start < existingEnd && end > existingStart
    })

    if (conflicting) {
      const conflictStart = new Date(conflicting.startTime)
      const conflictDuration = conflicting.movie.duration > 0 ? conflicting.movie.duration : 90
      const conflictEnd = new Date(conflictStart.getTime() + conflictDuration * 60 * 1000)
      return NextResponse.json({
        error: `Hall is occupied by "${conflicting.movie.title}" from ${conflictStart.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} to ${conflictEnd.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} on ${conflictStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
      }, { status: 409 })
    }

    const projection = await prisma.projection.update({
      where: { id: currentId },
      data: {
        movieId: Number(movieId),
        hallId: Number(hallId),
        startTime: start,
        price: Number(price),
      },
      include: { movie: true, hall: true },
    })

    return NextResponse.json(projection)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update projection" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.projection.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete projection" }, { status: 500 })
  }
}