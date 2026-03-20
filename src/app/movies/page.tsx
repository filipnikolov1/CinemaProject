import { prisma } from "@/lib/db";
import MovieCard from "@/components/MovieCard";
import MovieFilters from "@/components/MovieFilters";
import Link from "next/link";
import { Movie } from "@prisma/client";

type MoviesPageProps = {
    searchParams: Promise<{
        filter?: string;
        page?: string;
    }>;
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
    const params = await searchParams;
    const filter = params.filter;
    const currentPage = Number(params.page) || 1;

    const moviesPerPage = 16;

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

    const totalMovies = await prisma.movie.count({ where });

    const movies: Movie[] = await prisma.movie.findMany({
        where,
        skip: (currentPage - 1) * moviesPerPage,
        take: moviesPerPage,
        orderBy: {
            createdAt: "asc",
        },
    });

    const totalPages = Math.ceil(totalMovies / moviesPerPage);

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    const buildPageLink = (page: number) => {
        if (filter) {
            return `/movies?filter=${filter}&page=${page}`;
        }
        return `/movies?page=${page}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-purple-950 text-white">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <p className="text-pink-400 uppercase tracking-[0.3em] text-sm mb-2">
                        Cinema Collection
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Movies</h1>
                    <p className="text-gray-400 text-lg">
                        Discover popular, top rated, now playing and upcoming movies.
                    </p>
                </div>

                <MovieFilters />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-8">
                    {movies.map((movie: Movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                        {currentPage > 1 && (
                            <Link
                                href={buildPageLink(currentPage - 1)}
                                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                            >
                                &lt;
                            </Link>
                        )}

                        {startPage > 1 && (
                            <>
                                <Link
                                    href={buildPageLink(1)}
                                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                                >
                                    1
                                </Link>
                                {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
                            </>
                        )}

                        {visiblePages.map((page) => (
                            <Link
                                key={page}
                                href={buildPageLink(page)}
                                className={`px-4 py-2 rounded-lg border transition ${
                                    currentPage === page
                                        ? "bg-pink-600 border-pink-600 text-white"
                                        : "bg-white/10 border-white/10 hover:bg-white/20 text-white"
                                }`}
                            >
                                {page}
                            </Link>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                                <Link
                                    href={buildPageLink(totalPages)}
                                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                                >
                                    {totalPages}
                                </Link>
                            </>
                        )}

                        {currentPage < totalPages && (
                            <Link
                                href={buildPageLink(currentPage + 1)}
                                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
                            >
                                &gt;
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}