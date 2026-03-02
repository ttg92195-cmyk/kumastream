'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/movie/Header';
import { MovieCard } from '@/components/movie/MovieCard';

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const url = searchQuery
      ? `/api/series?search=${encodeURIComponent(searchQuery)}`
      : '/api/series?limit=50';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSeries(data.series || []);
        setLoading(false);
      })
      .catch(console.error);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header
        title="Series"
        searchPlaceholder="Search Series"
        onSearch={handleSearch}
      />

      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse" />
                <div className="mt-1.5 h-3 bg-gray-800 rounded animate-pulse w-3/4" />
                <div className="mt-1 h-2 bg-gray-800 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No series found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {series.map((s) => (
              <MovieCard
                key={s.id}
                id={s.id}
                title={s.title}
                year={s.year}
                rating={s.rating}
                poster={s.poster}
                quality4k={s.quality4k}
                type="series"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
