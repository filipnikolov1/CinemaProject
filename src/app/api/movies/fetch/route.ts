import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import {
  fetchMovieList,
  fetchMovieDetails,
  getPosterUrl,
  MovieListType,
} from "@/lib/movieApi"

const PAGES_PER_LIST = 10

const LISTS: MovieListType[] = ["popular", "top_rated", "now_playing", "upcoming"]

const LIST_FLAGS = {
  popular:     { isPopular: true },
  top_rated:   { isTopRated: true },
  now_playing: { isNowPlaying: true },
  upcoming:    { isUpcoming: true },
} as const

export async function POST() {
  try {
    let totalSaved = 0
    let totalUpdated = 0

    for (const list of LISTS) {
      console.log(`\n📋 Fetching: ${list}`)

      const listFlag = LIST_FLAGS[list]

      for (let page = 1; page <= PAGES_PER_LIST; page++) {
        const { movies, totalPages } = await fetchMovieList(list, page)
        if (page > totalPages) break

        for (const movie of movies) {
          // Always fetch details so we have releaseDate even for existing movies
          const details = await fetchMovieDetails(movie.id)

          const releaseDate = details.release_date
            ? new Date(details.release_date)
            : null

          const existing = await prisma.movie.findUnique({
            where: { externalId: String(movie.id) },
          })

          if (existing) {
            await prisma.movie.update({
              where: { externalId: String(movie.id) },
              data: {
                ...listFlag,
                releaseDate,
              },
            })
            totalUpdated++
            continue
          }

          await prisma.movie.create({
            data: {
              externalId: String(details.id),
              title: details.title,
              description: details.overview,
              duration: details.runtime ?? 0,
              genre: details.genres.map((g) => g.name).join(", "),
              posterUrl: getPosterUrl(details.poster_path),
              releaseDate,
              ...listFlag,
            },
          })

          totalSaved++
        }

        console.log(
          `  ✓ ${list} page ${page}/${Math.min(PAGES_PER_LIST, totalPages)} — saved: ${totalSaved}, updated: ${totalUpdated}`
        )
      }
    }

    return NextResponse.json({
      message: `Done! ${totalSaved} new movies saved, ${totalUpdated} existing updated.`,
    })
  } catch (error) {
    console.error("FULL ERROR:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch movies",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}