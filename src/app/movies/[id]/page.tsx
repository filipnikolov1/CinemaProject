import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

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
            projections: true,
        },
    });

    if (!movie) {
        notFound();
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

            <img src={movie.posterUrl || "/no-image.jpg"}
                 alt={movie.title}
                 className="w-96 rounded-lg shadow-lg"
            />
               <br/>
            <p className="mb-4">{movie.description || "No description available."}</p>

            <p className="text-gray-600 mb-2">
                {movie.genre || "Unknown genre"} • {movie.duration} min
            </p>

            {movie.releaseDate && (
                <p className="text-gray-500 mb-6">
                    Release date: {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
            )}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Projections</h2>

            {movie.projections.length === 0 ? (
                <p>No projections available.</p>
            ) : (
                <div className="space-y-3">
                    {movie.projections.map((projection) => (
                        <div key={projection.id} className="border p-4 rounded-lg">
                            <p>Start time: {new Date(projection.startTime).toLocaleString()}</p>
                            <p>Price: {projection.price} den</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}