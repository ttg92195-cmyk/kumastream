'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/movie/Header';
import { MovieCard } from '@/components/movie/MovieCard';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const url = searchQuery
      ? `/api/movies?search=${encodeURIComponent(searchQuery)}`
      : '/api/movies?limit=50';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Merge with TMDB imported movies from localStorage
        const tmdbMovies = JSON.parse(localStorage.getItem('tmdb-movies') || '[]');
        const allMovies = [...tmdbMovies, ...(data.movies || [])];
        
        // Filter by search query if present
        let filtered = allMovies;
        if (searchQuery) {
          filtered = allMovies.filter((m: Movie) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setMovies(filtered);
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
        title="Movies"
        searchPlaceholder="Search Movies"
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
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No movies found</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
