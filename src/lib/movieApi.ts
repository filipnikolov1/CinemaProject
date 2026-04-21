const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original"

const headers = {
  Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  "Content-Type": "application/json",
}

export type MovieListType = "popular" | "top_rated" | "now_playing" | "upcoming"

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  runtime: number
  release_date: string
  genres: { id: number; name: string }[]
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_dates?: {
    results: {
      iso_3166_1: string
      release_dates: { certification: string }[]
    }[]
  }
}

export async function fetchMovieList(type: MovieListType, page = 1) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${type}?page=${page}`, { headers })
  const data = await res.json()
  return {
    movies: data.results as { id: number; title: string }[],
    totalPages: data.total_pages as number,
  }
}

export async function fetchMovieDetails(tmdbId: number): Promise<TMDBMovie> {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${tmdbId}?append_to_response=release_dates`,
    { headers }
  )
  return res.json()
}

export function getUSCertification(details: TMDBMovie): string | null {
  const us = details.release_dates?.results?.find(r => r.iso_3166_1 === "US")
  const cert = us?.release_dates?.find(rd => rd.certification)?.certification
  return cert || null
}

export function getPosterUrl(posterPath: string | null): string | null {
  return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : null
}

export function getBackdropUrl(backdropPath: string | null): string | null {
  return backdropPath ? `${TMDB_BACKDROP_BASE}${backdropPath}` : null
}