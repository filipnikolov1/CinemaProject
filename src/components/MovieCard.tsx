import Link from "next/link";
import { Movie } from "@prisma/client";

type MovieCardProps = {
    movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/movies/${movie.id}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:scale-105 transition">
                <img
                    src={movie.posterUrl || "/no-image.jpg"}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                />

                <div className="p-3">
                    <h2 className="font-bold text-lg">{movie.title}</h2>

                    <p className="text-sm text-gray-500">
                        {movie.genre || "Unknown genre"} • {movie.duration} min
                    </p>
                </div>
            </div>
        </Link>
    );
}