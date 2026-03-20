import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

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
                orderBy: {
                    startTime: "asc",
                },
            },
        },
    });

    if (!movie) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-950 via-black to-purple-900 text-white">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                    <div className="flex justify-center lg:justify-start">
                        <img
                            src={movie.posterUrl || "/no-image.jpg"}
                            alt={movie.title}
                            className="w-80 rounded-2xl shadow-2xl object-cover"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                            {movie.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-lg text-gray-300 mb-6">
                            <span>🎬 {movie.genre || "Unknown genre"}</span>
                            <span>•</span>
                            <span>⏱ {movie.duration} min</span>
                            {movie.releaseDate && (
                                <>
                                    <span>•</span>
                                    <span>
                    📅 {new Date(movie.releaseDate).toLocaleDateString("en-GB")}
                  </span>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 flex-wrap mb-8">
                            {movie.isPopular && (
                                <span className="px-4 py-2 bg-red-500/20 border border-red-400 text-red-300 rounded-full text-sm font-medium">
                  🔥 Popular
                </span>
                            )}

                            {movie.isTopRated && (
                                <span className="px-4 py-2 bg-yellow-500/20 border border-yellow-400 text-yellow-300 rounded-full text-sm font-medium">
                  ⭐ Top Rated
                </span>
                            )}

                            {movie.isNowPlaying && (
                                <span className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-300 rounded-full text-sm font-medium">
                  🎥 Now Playing
                </span>
                            )}

                            {movie.isUpcoming && (
                                <span className="px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-300 rounded-full text-sm font-medium">
                  🏆 Upcoming
                </span>
                            )}
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10">
                            <h2 className="text-2xl font-bold mb-4 text-pink-300">
                                About the movie
                            </h2>
                            <p className="text-lg leading-8 text-gray-200">
                                {movie.description || "No description available."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-14">
                    <h2 className="text-3xl font-bold mb-6 text-white">Available Projections</h2>

                    {movie.projections.length === 0 ? (
                        <p className="text-gray-300">No projections available.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {movie.projections.map((projection) => (
                                <div
                                    key={projection.id}
                                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg hover:scale-105 hover:bg-white/15 transition"
                                >
                                    <p className="text-lg font-semibold mb-2 text-pink-300">
                                        📅 {new Date(projection.startTime).toLocaleDateString("en-GB")}
                                    </p>

                                    <p className="text-gray-200 mb-2">
                                        🕒{" "}
                                        {new Date(projection.startTime).toLocaleTimeString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>

                                    <p className="text-gray-200 mb-4">
                                        💲 {projection.price}
                                    </p>

                                    <Link
                                        href={`/bookings/${projection.id}/seats`}
                                        className="inline-block bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl font-semibold transition"
                                    >
                                        Book seats
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}