'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Star, Calendar, Clock, ChevronDown, Download } from 'lucide-react';
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

// Static movies data (same as API)
const staticMovies: Movie[] = [
  {
    id: '1',
    title: 'Boyz n the Hood',
    year: 1991,
    rating: 7.6,
    duration: 112,
    poster: '/images/boyz-hood.jpg',
    backdrop: '/images/boyz-hood.jpg',
    description: 'A group of young men in South Central Los Angeles navigate life in a neighborhood plagued by violence and drugs.',
    review: 'Boyz n the Hood သည် 1991 ခုနှစ်တွင် ထွက်ရှိခဲ့သော American crime drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး John Singleton မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Crime,Drama',
    quality4k: true,
    director: 'John Singleton',
    fileSize: '7.7 GB / 3.4 GB / 1.5 GB',
    quality: 'Blu-Ray 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.8,
    rtRating: 96,
    casts: [
      { id: '1', name: 'Cuba Gooding Jr.', role: 'Tre Styles', photo: null },
      { id: '2', name: 'Laurence Fishburne', role: 'Furious Styles', photo: null },
      { id: '3', name: 'Ice Cube', role: 'Doughboy', photo: null },
      { id: '4', name: 'Morris Chestnut', role: 'Ricky Baker', photo: null },
    ],
  },
  {
    id: '2',
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    duration: 152,
    poster: '/images/dark-knight.jpg',
    backdrop: '/images/dark-knight.jpg',
    description: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
    review: 'The Dark Knight သည် 2008 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Crime,Drama',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '15.2 GB / 8.4 GB / 4.2 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.0,
    rtRating: 94,
    casts: [
      { id: '5', name: 'Christian Bale', role: 'Bruce Wayne / Batman', photo: null },
      { id: '6', name: 'Heath Ledger', role: 'Joker', photo: null },
      { id: '7', name: 'Aaron Eckhart', role: 'Harvey Dent', photo: null },
      { id: '8', name: 'Michael Caine', role: 'Alfred Pennyworth', photo: null },
    ],
  },
  {
    id: '3',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    duration: 148,
    poster: '/images/inception.jpg',
    backdrop: '/images/inception.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
    review: 'Inception သည် 2010 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi action ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Sci-Fi,Thriller',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '12.8 GB / 6.5 GB / 3.2 GB',
    quality: '4K UHD HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.8,
    rtRating: 87,
    casts: [
      { id: '9', name: 'Leonardo DiCaprio', role: 'Dom Cobb', photo: null },
      { id: '10', name: 'Joseph Gordon-Levitt', role: 'Arthur', photo: null },
      { id: '11', name: 'Ellen Page', role: 'Ariadne', photo: null },
      { id: '12', name: 'Tom Hardy', role: 'Eames', photo: null },
    ],
  },
  {
    id: '4',
    title: 'Interstellar',
    year: 2014,
    rating: 8.7,
    duration: 169,
    poster: '/images/interstellar.jpg',
    backdrop: '/images/interstellar.jpg',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    review: 'Interstellar သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Adventure,Drama,Sci-Fi',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '18.5 GB / 9.2 GB / 4.8 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.7,
    rtRating: 73,
    casts: [
      { id: '13', name: 'Matthew McConaughey', role: 'Cooper', photo: null },
      { id: '14', name: 'Anne Hathaway', role: 'Dr. Amelia Brand', photo: null },
      { id: '15', name: 'Jessica Chastain', role: 'Murph', photo: null },
      { id: '16', name: 'Michael Caine', role: 'Professor Brand', photo: null },
    ],
  },
  {
    id: '5',
    title: 'John Wick',
    year: 2014,
    rating: 7.4,
    duration: 101,
    poster: '/images/john-wick.jpg',
    backdrop: '/images/john-wick.jpg',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog.',
    review: 'John Wick သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော action thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Chad Stahelski မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Thriller',
    quality4k: true,
    director: 'Chad Stahelski',
    fileSize: '8.2 GB / 4.1 GB / 2.0 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.4,
    rtRating: 86,
    casts: [
      { id: '17', name: 'Keanu Reeves', role: 'John Wick', photo: null },
      { id: '18', name: 'Michael Nyqvist', role: 'Viggo Tarasov', photo: null },
      { id: '19', name: 'Alfie Allen', role: 'Iosef Tarasov', photo: null },
      { id: '20', name: 'Willem Dafoe', role: 'Marcus', photo: null },
    ],
  },
  {
    id: '6',
    title: 'Avengers: Endgame',
    year: 2019,
    rating: 8.4,
    duration: 181,
    poster: '/images/avengers-endgame.jpg',
    backdrop: '/images/avengers-endgame.jpg',
    description: 'The Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    review: 'Avengers: Endgame သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Russo Brothers မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    director: 'Anthony Russo, Joe Russo',
    fileSize: '22.5 GB / 11.2 GB / 5.5 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.4,
    rtRating: 94,
    casts: [
      { id: '21', name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man', photo: null },
      { id: '22', name: 'Chris Evans', role: 'Steve Rogers / Captain America', photo: null },
      { id: '23', name: 'Scarlett Johansson', role: 'Natasha Romanoff', photo: null },
      { id: '24', name: 'Chris Hemsworth', role: 'Thor', photo: null },
    ],
  },
  {
    id: '7',
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    duration: 132,
    poster: '/images/parasite.jpg',
    backdrop: '/images/parasite.jpg',
    description: 'A poor family schemes to become employed by a wealthy family and infiltrate their household.',
    review: 'Parasite သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော South Korean black comedy thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Bong Joon-ho မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Comedy,Drama,Thriller',
    quality4k: true,
    director: 'Bong Joon-ho',
    fileSize: '9.8 GB / 4.9 GB / 2.4 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.5,
    rtRating: 99,
    casts: [
      { id: '25', name: 'Song Kang-ho', role: 'Kim Ki-taek', photo: null },
      { id: '26', name: 'Lee Sun-kyun', role: 'Park Dong-ik', photo: null },
      { id: '27', name: 'Cho Yeo-jeong', role: 'Yeon-gyo', photo: null },
      { id: '28', name: 'Choi Woo-shik', role: 'Kim Ki-woo', photo: null },
    ],
  },
  {
    id: '8',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    duration: 142,
    poster: '/images/shawshank.jpg',
    backdrop: '/images/shawshank.jpg',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    review: 'The Shawshank Redemption သည် 1994 ခုနှစ်တွင် ထွက်ရှိခဲ့သော drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး Frank Darabont မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Drama',
    quality4k: true,
    director: 'Frank Darabont',
    fileSize: '10.5 GB / 5.2 GB / 2.6 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.3,
    rtRating: 91,
    casts: [
      { id: '29', name: 'Tim Robbins', role: 'Andy Dufresne', photo: null },
      { id: '30', name: 'Morgan Freeman', role: 'Ellis Boyd Red Redding', photo: null },
      { id: '31', name: 'Bob Gunton', role: 'Warden Norton', photo: null },
      { id: '32', name: 'William Sadler', role: 'Heywood', photo: null },
    ],
  },
  {
    id: '9',
    title: 'Spider-Man: No Way Home',
    year: 2021,
    rating: 8.2,
    duration: 148,
    poster: '/images/spiderman.jpg',
    backdrop: '/images/spiderman.jpg',
    description: 'Spider-Man seeks help from Doctor Strange to make the world forget his identity, leading to multiverse chaos.',
    review: 'Spider-Man: No Way Home သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Jon Watts မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Adventure,Fantasy',
    quality4k: true,
    director: 'Jon Watts',
    fileSize: '16.2 GB / 8.1 GB / 4.0 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.2,
    rtRating: 93,
    casts: [
      { id: '33', name: 'Tom Holland', role: 'Peter Parker / Spider-Man', photo: null },
      { id: '34', name: 'Zendaya', role: 'MJ', photo: null },
      { id: '35', name: 'Benedict Cumberbatch', role: 'Dr. Stephen Strange', photo: null },
      { id: '36', name: 'Jacob Batalon', role: 'Ned Leeds', photo: null },
    ],
  },
  {
    id: '10',
    title: 'Dune',
    year: 2021,
    rating: 8.0,
    duration: 155,
    poster: '/images/dune.jpg',
    backdrop: '/images/dune.jpg',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet.',
    review: 'Dune သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Denis Villeneuve မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Adventure,Sci-Fi',
    quality4k: true,
    director: 'Denis Villeneuve',
    fileSize: '18.8 GB / 9.4 GB / 4.7 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.0,
    rtRating: 83,
    casts: [
      { id: '37', name: 'Timothée Chalamet', role: 'Paul Atreides', photo: null },
      { id: '38', name: 'Rebecca Ferguson', role: 'Lady Jessica', photo: null },
      { id: '39', name: 'Oscar Isaac', role: 'Duke Leto Atreides', photo: null },
      { id: '40', name: 'Zendaya', role: 'Chani', photo: null },
    ],
  },
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
    const id = params.id as string;
    let foundMovie: Movie | null = null;
    let similar: SimilarMovie[] = [];
    
    // First check localStorage for TMDB imported movies
    const tmdbMovies = JSON.parse(localStorage.getItem('tmdb-movies') || '[]');
    const tmdbMovie = tmdbMovies.find((m: Movie) => m.id === id);
    
    if (tmdbMovie) {
      // Convert TMDB movie to our format
      foundMovie = {
        id: tmdbMovie.id,
        title: tmdbMovie.title,
        year: tmdbMovie.year,
        rating: tmdbMovie.rating,
        duration: tmdbMovie.duration || 120,
        poster: tmdbMovie.poster,
        backdrop: tmdbMovie.backdrop,
        description: tmdbMovie.description || tmdbMovie.overview || '',
        review: tmdbMovie.overview || tmdbMovie.description || '',
        genres: tmdbMovie.genres || '',
        quality4k: tmdbMovie.quality4k ?? true,
        director: tmdbMovie.director || '',
        fileSize: tmdbMovie.fileSize || '3.5 GB / 1.8 GB / 900 MB',
        quality: tmdbMovie.quality || '1080p HEVC / 720p HEVC',
        format: tmdbMovie.format || 'MKV / MP4',
        subtitle: tmdbMovie.subtitle || 'Myanmar Subtitle (Hardsub)',
        imdbRating: tmdbMovie.imdbRating || tmdbMovie.rating,
        rtRating: tmdbMovie.rtRating || 0,
        casts: tmdbMovie.casts || [],
      };
      
      // Get similar movies
      const genres = foundMovie.genres.split(',');
      similar = tmdbMovies
        .filter((m: Movie) => m.id !== id && genres.some((g) => m.genres?.includes(g.trim())))
        .slice(0, 6)
        .map((m: Movie) => ({
          id: m.id,
          title: m.title,
          year: m.year,
          rating: m.rating,
          poster: m.poster,
          quality4k: m.quality4k ?? true,
        }));
    } else {
      // Check static movies
      const staticMovie = staticMovies.find((m) => m.id === id);
      
      if (staticMovie) {
        foundMovie = staticMovie;
        
        // Get similar movies from static data
        const genres = staticMovie.genres.split(',');
        similar = staticMovies
          .filter((m) => m.id !== id && genres.some((g) => m.genres.includes(g.trim())))
          .slice(0, 6)
          .map((m) => ({
            id: m.id,
            title: m.title,
            year: m.year,
            rating: m.rating,
            poster: m.poster,
            quality4k: m.quality4k,
          }));
      }
    }
    
    // Set state at the end - using flushSync pattern for initial load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovie(foundMovie);
    setSimilarMovies(similar);
    setLoading(false);
    
    // Add to recent if found
    if (foundMovie) {
      addRecent({
        id: `movie-${foundMovie.id}`,
        type: 'movie',
        movieId: foundMovie.id,
        movie: {
          id: foundMovie.id,
          title: foundMovie.title,
          year: foundMovie.year,
          rating: foundMovie.rating,
          poster: foundMovie.poster,
          quality4k: foundMovie.quality4k,
        },
        viewedAt: new Date().toISOString(),
      });
    }
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
                <span className="text-gray-400 text-sm">{movie.fileSize?.split(' / ')[0] || '7.7 GB'}</span>
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
                <span className="text-gray-400 text-sm">{movie.fileSize?.split(' / ')[1] || '3.4 GB'}</span>
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
                <span className="text-gray-400 text-sm">{movie.fileSize?.split(' / ')[2] || '1.5 GB'}</span>
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
