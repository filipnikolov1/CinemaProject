import { prisma } from "@/lib/db";
import Link from "next/link";
import { Movie } from "@prisma/client";
import MovieFilters from "@/components/MovieFilters";
import styles from "./movies.module.scss";

type MoviesPageProps = {
    searchParams: Promise<{
        filter?: string;
        page?: string;
        search?: string;
    }>;
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
    const params = await searchParams;
    const filter = params.filter;
    const search = params.search?.trim() || "";
    const currentPage = Number(params.page) || 1;

    const moviesPerPage = 16;

    let where: Record<string, unknown> = {};

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

    if (search) {
        where.title = { contains: search, mode: "insensitive" };
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
        <div className={styles.page}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Cinema Collection</p>
                    <h1 className={styles.title}>Movies</h1>
                    <p className={styles.subtitle}>
                        Discover popular, top rated, now playing and upcoming movies.
                    </p>
                </div>

                <MovieFilters />

                <div className={styles.grid}>
                    {movies.map((movie: Movie) => (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className={styles.card}>
                            <img
                                src={movie.posterUrl || "/no-image.jpg"}
                                alt={movie.title}
                                className={styles.cardPoster}
                            />
                            <div className={styles.cardBody}>
                                <h2 className={styles.cardTitle}>{movie.title}</h2>
                                <p className={styles.cardMeta}>
                                    {movie.genre || "Unknown genre"} &middot; {movie.duration} min
                                </p>
                            </div>
                            <span className={styles.cardButton}>View details</span>
                        </Link>
                    ))}
                </div>

                {movies.length === 0 && (
                    <p className={styles.empty}>No movies found.</p>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {currentPage > 1 && (
                            <Link
                                href={buildPageLink(currentPage - 1)}
                                className={styles.pageBtn}
                            >
                                &lt;
                            </Link>
                        )}

                        {startPage > 1 && (
                            <>
                                <Link
                                    href={buildPageLink(1)}
                                    className={styles.pageBtn}
                                >
                                    1
                                </Link>
                                {startPage > 2 && <span className={styles.pageEllipsis}>&hellip;</span>}
                            </>
                        )}

                        {visiblePages.map((page) => (
                            <Link
                                key={page}
                                href={buildPageLink(page)}
                                className={`${styles.pageBtn} ${
                                    currentPage === page ? styles.pageBtnActive : ""
                                }`}
                            >
                                {page}
                            </Link>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className={styles.pageEllipsis}>&hellip;</span>
                                )}
                                <Link
                                    href={buildPageLink(totalPages)}
                                    className={styles.pageBtn}
                                >
                                    {totalPages}
                                </Link>
                            </>
                        )}

                        {currentPage < totalPages && (
                            <Link
                                href={buildPageLink(currentPage + 1)}
                                className={styles.pageBtn}
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
