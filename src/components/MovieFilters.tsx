"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "../app/movies/movies.module.scss";

export default function MovieFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeFilter = searchParams.get("filter");
    const currentSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState(currentSearch);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filters = [
        { key: null, label: "All" },
        { key: "popular", label: "Popular" },
        { key: "topRated", label: "Top Rated" },
        { key: "nowPlaying", label: "Now Playing" },
        { key: "upcoming", label: "Upcoming" },
    ];

    const buildUrl = (filterKey: string | null, searchValue?: string) => {
        const params = new URLSearchParams();
        if (filterKey) params.set("filter", filterKey);
        const s = searchValue ?? search;
        if (s.trim()) params.set("search", s.trim());
        const qs = params.toString();
        return `/movies${qs ? `?${qs}` : ""}`;
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (search !== currentSearch) {
                router.push(buildUrl(activeFilter, search));
            }
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [search]);

    return (
        <div className={styles.filtersWrap}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search movies..."
                    className={styles.searchInput}
                />
                {search && (
                    <button
                        type="button"
                        className={styles.searchClear}
                        onClick={() => setSearch("")}
                    >
                        &times;
                    </button>
                )}
            </div>
            <div className={styles.filters}>
                {filters.map(({ key, label }) => (
                    <button
                        key={label}
                        onClick={() => router.push(buildUrl(key))}
                        className={`${styles.filterBtn} ${
                            activeFilter === key || (!activeFilter && !key)
                                ? styles.filterBtnActive
                                : ""
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
