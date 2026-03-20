import Link from "next/link";
import { Movie } from "@prisma/client";

type MovieCardProps = {
    movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/movies/${movie.id}`} className="group">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-1">
                <div className="relative">
                    <img
                        src={movie.posterUrl || "/no-image.jpg"}
                        alt={movie.title}
                        className="w-full h-96 object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {movie.isPopular && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                🔥 Popular
              </span>
                        )}

                        {movie.isTopRated && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/90 text-black">
                ⭐ Top Rated
              </span>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-white text-xl font-bold mb-2 line-clamp-2">
                            {movie.title}
                        </h2>

                        <p className="text-sm text-gray-300 mb-3">
                            {movie.genre || "Unknown genre"} • {movie.duration} min
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white font-medium group-hover:bg-pink-500 transition">
                            View details
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}