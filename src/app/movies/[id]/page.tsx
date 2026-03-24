import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./movieDetail.module.scss";

type MoviePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
    const { id } = await params;

    const movie = await prisma.movie.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            projections: {
                where: {
                    startTime: { gt: new Date() },
                },
                orderBy: {
                    startTime: "asc",
                },
            },
        },
    });

    if (!movie) {
        notFound();
    }

    const genres = movie.genre ? movie.genre.split(",").map(g => g.trim()).filter(Boolean) : [];

    return (
        <div className={styles.page}>
            {/* Hero with backdrop */}
            <div className={styles.hero}>
                <div
                    className={styles.backdrop}
                    style={{
                        backgroundImage: movie.backdropUrl
                            ? `url(${movie.backdropUrl})`
                            : movie.posterUrl
                            ? `url(${movie.posterUrl})`
                            : undefined,
                    }}
                />
                <div className={styles.overlay} />
                <div className={styles.vignette} />

                <div className={styles.heroContent}>
                    <div className={styles.poster}>
                        <img
                            src={movie.posterUrl || "/no-image.jpg"}
                            alt={movie.title}
                            className={styles.posterImg}
                        />
                    </div>

                    <div className={styles.heroInfo}>
                        {genres.length > 0 && (
                            <div className={styles.genres}>
                                {genres.map(g => (
                                    <span key={g} className={styles.genreBadge}>{g}</span>
                                ))}
                            </div>
                        )}

                        <h1 className={styles.movieTitle}>{movie.title}</h1>

                        {movie.description && (
                            <p className={styles.description}>{movie.description}</p>
                        )}

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>{movie.duration} min</span>
                            </div>
                            {movie.releaseDate && (
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>
                                        {new Date(movie.releaseDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className={styles.badges}>
                            {movie.isPopular && (
                                <span className={`${styles.badge} ${styles.badgePopular}`}>Popular</span>
                            )}
                            {movie.isTopRated && (
                                <span className={`${styles.badge} ${styles.badgeTopRated}`}>Top Rated</span>
                            )}
                            {movie.isNowPlaying && (
                                <span className={`${styles.badge} ${styles.badgeNowPlaying}`}>Now Playing</span>
                            )}
                            {movie.isUpcoming && (
                                <span className={`${styles.badge} ${styles.badgeUpcoming}`}>Upcoming</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projections */}
            <div className={styles.body}>
                <h2 className={styles.sectionTitle}>Available Projections</h2>

                {movie.projections.length === 0 ? (
                    <p className={styles.emptyProjections}>No projections available.</p>
                ) : (
                    <div className={styles.projectionsGrid}>
                        {movie.projections.map((projection) => (
                            <div key={projection.id} className={styles.ticket}>
                                <div className={styles.ticketAccent} />

                                <div className={styles.ticketMain}>
                                    <p className={styles.ticketDate}>
                                        {new Date(projection.startTime).toLocaleDateString("en-GB", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </p>
                                    <p className={styles.ticketMeta}>
                                        {new Date(projection.startTime).toLocaleTimeString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {" · "}
                                        &euro;{Number(projection.price).toFixed(2)}
                                    </p>
                                </div>

                                <div className={styles.ticketDivider}>
                                    <div className={styles.ticketNotchTop} />
                                    <div className={styles.ticketNotchBottom} />
                                </div>

                                <Link
                                    href={`/bookings/${projection.id}/seats`}
                                    className={styles.ticketStub}
                                >
                                    <p className={styles.ticketStubLabel}>Book</p>
                                    <span className={styles.ticketStubIcon}>&rarr;</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
