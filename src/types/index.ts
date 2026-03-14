export interface Movie {
  id: number
  title: string
  posterUrl: string | null
  releaseDate: string | null
  duration: number
}

export interface Hall {
  id: number
  name: string
  totalSeats: number
}

export interface Projection {
  id: number
  movieId: number
  hallId: number
  startTime: string
  price: number
  movie: Movie
  hall: Hall
}