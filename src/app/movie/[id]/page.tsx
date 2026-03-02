'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Star, Calendar, Clock, ChevronDown, Download, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CastCard } from '@/components/movie/CastCard';
import { MovieCard } from '@/components/movie/MovieCard';
import { useAppStore } from '@/store/useAppStore';

interface Cast {
  id: string;
  name: string;
  role: string;
  photo: string | null;
}

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: number;
  poster: string;
  backdrop: string | null;
  description: string;
  review: string | null;
  genres: string;
  quality4k: boolean;
  director: string | null;
  fileSize: string | null;
  quality: string | null;
  format: string | null;
  subtitle: string | null;
  imdbRating: number | null;
  rtRating: number | null;
  casts: Cast[];
}

interface SimilarMovie {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

const tabs = [
  { id: 'detail', label: 'Detail' },
  { id: 'download', label: 'Download' },
  { id: 'explore', label: 'Explore' },
];

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMore, setViewMore] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

  const { bookmarks, addBookmark, removeBookmark, isBookmarked, addRecent } = useAppStore();

  useEffect(() => {
    const id = params.id;
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data.movie);
        setSimilarMovies(data.similarMovies || []);
        setLoading(false);

        // Add to recent views
        if (data.movie) {
          addRecent({
            id: `movie-${data.movie.id}`,
            type: 'movie',
            movieId: data.movie.id,
            movie: {
              id: data.movie.id,
              title: data.movie.title,
              year: data.movie.year,
              rating: data.movie.rating,
              poster: data.movie.poster,
              quality4k: data.movie.quality4k,
            },
            viewedAt: new Date().toISOString(),
          });
        }
      })
      .catch(console.error);
  }, [params.id, addRecent]);

  const bookmarked = movie ? isBookmarked(movie.id, 'movie') : false;

  const handleBookmark = () => {
    if (!movie) return;

    if (bookmarked) {
      const bookmark = bookmarks.find((b) => b.movieId === movie.id);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark({
        id: `movie-${movie.id}`,
        type: 'movie',
        movieId: movie.id,
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          rating: movie.rating,
          poster: movie.poster,
          quality4k: movie.quality4k,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="w-full h-[300px] bg-gray-800 animate-pulse" />
        <div className="p-4 space-y-4">
          <div className="h-8 w-2/3 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-800 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500">Movie not found</p>
      </div>
    );
  }

  const genreList = movie.genres.split(',');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail':
        return (
          <div className="space-y-6">
            {/* Review/Description */}
            <div>
              <h3 className="text-white font-semibold mb-2">Review</h3>
              <p className="text-sm text-white mb-1">
                {movie.title} ({movie.year})
              </p>
              <p className="text-xs text-gray-400 mb-3">
                IMDb Rating ({movie.imdbRating}) / Rotten Tomatoes ({movie.rtRating}%)
              </p>
              <p className={cn('text-gray-300 text-sm leading-relaxed', !viewMore && 'line-clamp-4')}>
                {movie.review || movie.description}
              </p>
              <button
                onClick={() => setViewMore(!viewMore)}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                {viewMore ? 'View Less' : 'View More'}
                <ChevronDown className={cn('w-4 h-4 transition-transform', viewMore && 'rotate-180')} />
              </button>
            </div>

            {/* Technical Info */}
            <div className="space-y-2">
              {movie.fileSize && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm min-w-[100px]">File Size</span>
                  <span className="text-white text-sm">{movie.fileSize}</span>
                </div>
              )}
              {movie.quality && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm min-w-[100px]">Quality</span>
                  <span className="text-white text-sm">{movie.quality}</span>
                </div>
              )}
              {movie.format && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm min-w-[100px]">Format</span>
                  <span className="text-white text-sm">{movie.format}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-sm min-w-[100px]">Genre</span>
                <span className="text-white text-sm">{movie.genres}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-sm min-w-[100px]">Duration</span>
                <span className="text-white text-sm">{formatDuration(movie.duration)}</span>
              </div>
              {movie.subtitle && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm min-w-[100px]">Subtitle</span>
                  <span className="text-white text-sm">{movie.subtitle}</span>
                </div>
              )}
              {movie.director && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm min-w-[100px]">Director</span>
                  <span className="text-white text-sm">{movie.director}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {movie.quality4k && (
                <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded">
                  4K
                </span>
              )}
              {genreList.map((genre) => (
                <span key={genre} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  {genre.trim()}
                </span>
              ))}
            </div>

            {/* Casts */}
            {movie.casts.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Casts</h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {movie.casts.map((cast) => (
                    <CastCard
                      key={cast.id}
                      name={cast.name}
                      role={cast.role}
                      photo={cast.photo || undefined}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'download':
        return (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Download Options</h3>
            
            {/* 4K Option */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">4K</span>
                  <span className="text-white font-medium">Ultra HD</span>
                </div>
                <span className="text-gray-400 text-sm">7.7 GB</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">HEVC • MKV • Myanmar Subtitle</p>
              <button className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* 1080p Option */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">1080p</span>
                  <span className="text-white font-medium">Full HD</span>
                </div>
                <span className="text-gray-400 text-sm">3.4 GB</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">HEVC • MKV • Myanmar Subtitle</p>
              <button className="w-full py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* 720p Option */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">720p</span>
                  <span className="text-white font-medium">HD</span>
                </div>
                <span className="text-gray-400 text-sm">1.5 GB</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">HEVC • MP4 • Myanmar Subtitle</p>
              <button className="w-full py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        );

      case 'explore':
        return (
          <div>
            <h3 className="text-white font-semibold mb-4">You may also like</h3>
            <div className="grid grid-cols-3 gap-3">
              {similarMovies.map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  year={m.year}
                  rating={m.rating}
                  poster={m.poster}
                  quality4k={m.quality4k}
                  type="movie"
                />
              ))}
            </div>
            {similarMovies.length === 0 && (
              <p className="text-gray-500 text-center py-10">No similar movies found</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Backdrop */}
      <div className="relative w-full h-[280px]">
        {movie.backdrop ? (
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

        {/* Navigation Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleBookmark}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              bookmarked ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
            )}
          >
            <Heart className={cn('w-5 h-5', bookmarked && 'fill-current')} />
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          {/* Poster */}
          <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover"
            />
            {movie.quality4k && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                4K
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 pb-2">
            <h1 className="text-white text-xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-red-500 fill-red-500" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {genreList.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
            >
              {genre.trim()}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${0}`;
}
