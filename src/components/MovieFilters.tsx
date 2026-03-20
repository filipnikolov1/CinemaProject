"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function MovieFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeFilter = searchParams.get("filter");

    const baseClass =
        "cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full border transition text-sm font-medium";

    return (
        <div className="flex gap-3 flex-wrap">
            <button
                onClick={() => router.push("/movies")}
                className={`${baseClass} ${
                    !activeFilter
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
            >
                🎬 All
            </button>

            <button
                onClick={() => router.push("/movies?filter=popular")}
                className={`${baseClass} ${
                    activeFilter === "popular"
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white/5 text-white border-white/10 hover:bg-red-500/20"
                }`}
            >
                🔥 Popular
            </button>

            <button
                onClick={() => router.push("/movies?filter=topRated")}
                className={`${baseClass} ${
                    activeFilter === "topRated"
                        ? "bg-yellow-500 text-black border-yellow-500"
                        : "bg-white/5 text-white border-white/10 hover:bg-yellow-500/20"
                }`}
            >
                ⭐ Top Rated
            </button>

            <button
                onClick={() => router.push("/movies?filter=nowPlaying")}
                className={`${baseClass} ${
                    activeFilter === "nowPlaying"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white/5 text-white border-white/10 hover:bg-green-500/20"
                }`}
            >
                🎥 Now Playing
            </button>

            <button
                onClick={() => router.push("/movies?filter=upcoming")}
                className={`${baseClass} ${
                    activeFilter === "upcoming"
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white/5 text-white border-white/10 hover:bg-purple-500/20"
                }`}
            >
                🏆 Upcoming
            </button>
        </div>
    );
}