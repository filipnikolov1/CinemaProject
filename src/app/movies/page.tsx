// import { prisma } from "@/lib/db";
// import MovieCard from "@/components/MovieCard";
//
// export default async function MoviesPage() {
//     const movies = await prisma.movie.findMany();
//
//     return (
//         <div className="p-10">
//             <h1 className="text-3xl font-bold mb-6">Movies</h1>
//
//             <div className="grid grid-cols-4 gap-6">
//                 {movies.map((movie) => (
//                     <MovieCard key={movie.id} movie={movie} />
//                 ))}
//             </div>
//         </div>
//     );
// }
import { prisma } from "@/lib/db";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@prisma/client";

export default async function MoviesPage() {
    const movies: Movie[] = await prisma.movie.findMany();

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Movies</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}