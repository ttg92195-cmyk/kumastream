'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/movie/Header';
import { MovieCard } from '@/components/movie/MovieCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed database first
    fetch('/api/seed')
      .then(() => {
        // Fetch movies
        return fetch('/api/movies?limit=10');
      })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || []);
      })
      .catch(console.error);

    // Fetch series
    fetch('/api/series?limit=10')
      .then((res) => res.json())
      .then((data) => {
        setSeries(data.series || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header title="CINE" />
        <div className="p-4 space-y-6">
          {/* Movies Section Skeleton */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse" />
                  <div className="mt-1.5 h-3 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="mt-1 h-2 w-1/2 bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          {/* Series Section Skeleton */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse" />
                  <div className="mt-1.5 h-3 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="mt-1 h-2 w-1/2 bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header title="CINE" />

      <div className="p-4 space-y-6">
        {/* Movies Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Movies</h2>
            <Link 
              href="/movies"
              className="flex items-center text-red-500 text-xs font-medium"
            >
              More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                poster={movie.poster}
                quality4k={movie.quality4k}
                type="movie"
              />
            ))}
          </div>
        </section>

        {/* Series Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Series</h2>
            <Link 
              href="/series"
              className="flex items-center text-red-500 text-xs font-medium"
            >
              More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
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
        </section>
      </div>
    </div>
  );
}
