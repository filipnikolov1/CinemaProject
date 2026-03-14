import { prisma } from "@/lib/db";
import MovieCard from "@/components/MovieCard";
import MovieFilters from "@/components/MovieFilters";
import { Movie } from "@prisma/client";

type MoviesPageProps = {
    searchParams: Promise<{
        filter?: string;
    }>;
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
    const params = await searchParams;
    const filter = params.filter;

    let where = {};

    if (filter === "popular") {
        where = { isPopular: true };
    }

    if (filter === "topRated") {
        where = { isTopRated: true };
    }

    if (filter === "nowPlaying") {
        where = { isNowPlaying: true };
    }

    if (filter === "upcoming") {
        where = { isUpcoming: true };
    }

    const movies: Movie[] = await prisma.movie.findMany({
        where,
    });

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Movies</h1>

            <MovieFilters />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}