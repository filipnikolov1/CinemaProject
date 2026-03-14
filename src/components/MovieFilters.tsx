"use client";

import { useRouter } from "next/navigation";

export default function MovieFilters() {
    const router = useRouter();

    return (
        <div className="flex gap-6 mb-8 flex-wrap text-lg">
      <span
          onClick={() => router.push("/movies")}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        🎬 All
      </span>

            <span
                onClick={() => router.push("/movies?filter=popular")}
                className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded hover:bg-red-100 transition"
            >
        🔥 Popular
      </span>

            <span
                onClick={() => router.push("/movies?filter=topRated")}
                className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded hover:bg-yellow-100 transition"
            >
        ⭐ Top Rated
      </span>

            <span
                onClick={() => router.push("/movies?filter=nowPlaying")}
                className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded hover:bg-green-100 transition"
            >
        🎥 Now Playing
      </span>

            <span
                onClick={() => router.push("/movies?filter=upcoming")}
                className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded hover:bg-purple-100 transition"
            >
        🔜 Upcoming
      </span>
        </div>
    );
}