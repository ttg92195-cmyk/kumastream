'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Star, Calendar, Clock, ChevronDown, ChevronRight, Download } from 'lucide-react';
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

interface Episode {
  id: string;
  season: number;
  episode: number;
  title: string;
  duration: number;
  fileSize: string | null;
  quality: string | null;
  format: string | null;
}

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  backdrop: string | null;
  description: string;
  genres: string;
  quality4k: boolean;
  seasons: number;
  totalEpisodes: number;
  casts: Cast[];
  episodes?: Episode[];
}

interface SimilarSeries {
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

// Static series data
const staticSeries: Series[] = [
  {
    id: '1',
    title: 'Breaking Bad',
    year: 2008,
    rating: 9.5,
    poster: '/images/breaking-bad.jpg',
    backdrop: '/images/breaking-bad.jpg',
    description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
    genres: 'Crime,Drama,Thriller',
    quality4k: true,
    seasons: 5,
    totalEpisodes: 62,
    casts: [
      { id: '1', name: 'Bryan Cranston', role: 'Walter White', photo: null },
      { id: '2', name: 'Aaron Paul', role: 'Jesse Pinkman', photo: null },
      { id: '3', name: 'Anna Gunn', role: 'Skyler White', photo: null },
      { id: '4', name: 'Dean Norris', role: 'Hank Schrader', photo: null },
    ],
    episodes: [
      { id: 'e1', season: 1, episode: 1, title: 'Pilot', duration: 58, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e2', season: 1, episode: 2, title: 'Cat\'s in the Bag...', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e3', season: 1, episode: 3, title: '...And the Bag\'s in the River', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
    ],
  },
  {
    id: '2',
    title: 'Game of Thrones',
    year: 2011,
    rating: 9.2,
    poster: '/images/got.jpg',
    backdrop: '/images/got.jpg',
    description: 'Nine noble families fight for control of the mythical lands of Westeros.',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    seasons: 8,
    totalEpisodes: 73,
    casts: [
      { id: '5', name: 'Emilia Clarke', role: 'Daenerys Targaryen', photo: null },
      { id: '6', name: 'Kit Harington', role: 'Jon Snow', photo: null },
      { id: '7', name: 'Peter Dinklage', role: 'Tyrion Lannister', photo: null },
      { id: '8', name: 'Lena Headey', role: 'Cersei Lannister', photo: null },
    ],
    episodes: [
      { id: 'e4', season: 1, episode: 1, title: 'Winter Is Coming', duration: 62, fileSize: '2.1 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e5', season: 1, episode: 2, title: 'The Kingsroad', duration: 56, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
    ],
  },
  {
    id: '3',
    title: 'Stranger Things',
    year: 2016,
    rating: 8.7,
    poster: '/images/stranger-things.jpg',
    backdrop: '/images/stranger-things.jpg',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
    genres: 'Drama,Fantasy,Horror',
    quality4k: true,
    seasons: 4,
    totalEpisodes: 34,
    casts: [
      { id: '9', name: 'Millie Bobby Brown', role: 'Eleven', photo: null },
      { id: '10', name: 'Finn Wolfhard', role: 'Mike Wheeler', photo: null },
      { id: '11', name: 'Winona Ryder', role: 'Joyce Byers', photo: null },
      { id: '12', name: 'David Harbour', role: 'Jim Hopper', photo: null },
    ],
    episodes: [
      { id: 'e6', season: 1, episode: 1, title: 'Chapter One: The Vanishing of Will Byers', duration: 47, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
    ],
  },
  {
    id: '4',
    title: 'The Witcher',
    year: 2019,
    rating: 8.2,
    poster: '/images/witcher.jpg',
    backdrop: '/images/witcher.jpg',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    genres: 'Action,Adventure,Fantasy',
    quality4k: true,
    seasons: 3,
    totalEpisodes: 24,
    casts: [
      { id: '13', name: 'Henry Cavill', role: 'Geralt of Rivia', photo: null },
      { id: '14', name: 'Anya Chalotra', role: 'Yennefer', photo: null },
      { id: '15', name: 'Freya Allan', role: 'Ciri', photo: null },
    ],
    episodes: [],
  },
  {
    id: '5',
    title: 'Money Heist',
    year: 2017,
    rating: 8.2,
    poster: '/images/money-heist.jpg',
    backdrop: '/images/money-heist.jpg',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.',
    genres: 'Action,Crime,Drama',
    quality4k: true,
    seasons: 5,
    totalEpisodes: 48,
    casts: [
      { id: '17', name: 'Úrsula Corberó', role: 'Tokyo', photo: null },
      { id: '18', name: 'Álvaro Morte', role: 'The Professor', photo: null },
    ],
    episodes: [],
  },
];

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [series, setSeries] = useState<Series | null>(null);
  const [similarSeries, setSimilarSeries] = useState<SimilarSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMore, setViewMore] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [expandedSeasons, setExpandedSeasons] = useState<Record<number, boolean>>({});
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<string, boolean>>({});

  const { bookmarks, addBookmark, removeBookmark, isBookmarked, addRecent } = useAppStore();

  useEffect(() => {
    const id = params.id as string;
    let foundSeries: Series | null = null;
    let similar: SimilarSeries[] = [];
    
    // First check localStorage for TMDB imported series
    const tmdbSeries = JSON.parse(localStorage.getItem('tmdb-series') || '[]');
    const tmdbShow = tmdbSeries.find((s: Series) => s.id === id);
    
    if (tmdbShow) {
      foundSeries = {
        id: tmdbShow.id,
        title: tmdbShow.title,
        year: tmdbShow.year,
        rating: tmdbShow.rating,
        poster: tmdbShow.poster,
        backdrop: tmdbShow.backdrop,
        description: tmdbShow.description || tmdbShow.overview || '',
        genres: tmdbShow.genres || '',
        quality4k: tmdbShow.quality4k ?? true,
        seasons: tmdbShow.seasons || 1,
        totalEpisodes: tmdbShow.totalEpisodes || 0,
        casts: tmdbShow.casts || [],
        episodes: tmdbShow.episodes || [],
      };
      
      // Get similar series
      const genres = foundSeries.genres.split(',');
      similar = tmdbSeries
        .filter((s: Series) => s.id !== id && genres.some((g) => s.genres?.includes(g.trim())))
        .slice(0, 6)
        .map((s: Series) => ({
          id: s.id,
          title: s.title,
          year: s.year,
          rating: s.rating,
          poster: s.poster,
          quality4k: s.quality4k ?? true,
        }));
    } else {
      // Check static series
      const staticShow = staticSeries.find((s) => s.id === id);
      
      if (staticShow) {
        foundSeries = staticShow;
        
        const genres = staticShow.genres.split(',');
        similar = staticSeries
          .filter((s) => s.id !== id && genres.some((g) => s.genres.includes(g.trim())))
          .slice(0, 6)
          .map((s) => ({
            id: s.id,
            title: s.title,
            year: s.year,
            rating: s.rating,
            poster: s.poster,
            quality4k: s.quality4k,
          }));
      }
    }
    
    // Set state at the end - using flushSync pattern for initial load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeries(foundSeries);
    setSimilarSeries(similar);
    setLoading(false);
    
    // Add to recent if found
    if (foundSeries) {
      addRecent({
        id: `series-${foundSeries.id}`,
        type: 'series',
        seriesId: foundSeries.id,
        series: {
          id: foundSeries.id,
          title: foundSeries.title,
          year: foundSeries.year,
          rating: foundSeries.rating,
          poster: foundSeries.poster,
          quality4k: foundSeries.quality4k,
        },
        viewedAt: new Date().toISOString(),
      });
    }
  }, [params.id, addRecent]);

  const bookmarked = series ? isBookmarked(series.id, 'series') : false;

  const handleBookmark = () => {
    if (!series) return;

    if (bookmarked) {
      const bookmark = bookmarks.find((b) => b.seriesId === series.id);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark({
        id: `series-${series.id}`,
        type: 'series',
        seriesId: series.id,
        series: {
          id: series.id,
          title: series.title,
          year: series.year,
          rating: series.rating,
          poster: series.poster,
          quality4k: series.quality4k,
        },
      });
    }
  };

  const toggleSeason = (season: number) => {
    setExpandedSeasons((prev) => ({
      ...prev,
      [season]: !prev[season],
    }));
  };

  const toggleEpisode = (episodeId: string) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };

  // Group episodes by season
  const episodesBySeason = series?.episodes?.reduce((acc, ep) => {
    if (!acc[ep.season]) {
      acc[ep.season] = [];
    }
    acc[ep.season].push(ep);
    return acc;
  }, {} as Record<number, Episode[]>) || {};

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

  if (!series) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500">Series not found</p>
      </div>
    );
  }

  const genreList = series.genres.split(',');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail':
        return (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-white font-semibold mb-2">Overview</h3>
              <p className={cn('text-gray-300 text-sm leading-relaxed', !viewMore && 'line-clamp-4')}>
                {series.description}
              </p>
              <button
                onClick={() => setViewMore(!viewMore)}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                {viewMore ? 'View Less' : 'View More'}
                <ChevronDown className={cn('w-4 h-4 transition-transform', viewMore && 'rotate-180')} />
              </button>
            </div>

            {/* Series Info */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-sm min-w-[100px]">Seasons</span>
                <span className="text-white text-sm">{series.seasons}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-sm min-w-[100px]">Episodes</span>
                <span className="text-white text-sm">{series.totalEpisodes}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-sm min-w-[100px]">Genre</span>
                <span className="text-white text-sm">{series.genres}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {series.quality4k && (
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
            {series.casts.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Casts</h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {series.casts.map((cast) => (
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
            <h3 className="text-white font-semibold">Download Episodes</h3>
            
            {Object.keys(episodesBySeason).length === 0 ? (
              <div className="text-center py-10 bg-gray-800 rounded-lg">
                <Download className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-2">No episodes available</p>
                <p className="text-gray-500 text-xs">Episodes will appear here when available</p>
              </div>
            ) : (
              Object.entries(episodesBySeason)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([season, episodes]) => (
                  <div key={season} className="border border-gray-800 rounded-lg overflow-hidden">
                    {/* Season Header */}
                    <button
                      onClick={() => toggleSeason(Number(season))}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-white font-medium">Season {season}</span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm">{episodes.length} episodes</span>
                        <ChevronRight
                          className={cn(
                            'w-5 h-5 transition-transform',
                            expandedSeasons[Number(season)] && 'rotate-90'
                          )}
                        />
                      </div>
                    </button>

                    {/* Episodes List */}
                    {expandedSeasons[Number(season)] && (
                      <div className="divide-y divide-gray-800">
                        {episodes.map((ep) => (
                          <div key={ep.id}>
                            {/* Episode Header */}
                            <button
                              onClick={() => toggleEpisode(ep.id)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm font-medium">
                                  {ep.episode}
                                </div>
                                <div className="text-left">
                                  <p className="text-white text-sm">{ep.title}</p>
                                  <p className="text-gray-500 text-xs">
                                    {ep.duration} min • {ep.fileSize || '1.2 GB'}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                className={cn(
                                  'w-5 h-5 text-gray-400 transition-transform',
                                  expandedEpisodes[ep.id] && 'rotate-90'
                                )}
                              />
                            </button>

                            {/* Download Links */}
                            {expandedEpisodes[ep.id] && (
                              <div className="px-4 pb-4 space-y-2">
                                <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
                                  <div>
                                    <p className="text-white text-sm font-medium">1080p</p>
                                    <p className="text-gray-500 text-xs">HEVC • {ep.fileSize || '1.2 GB'}</p>
                                  </div>
                                  <button className="px-3 py-1.5 bg-red-500 text-white text-xs rounded font-medium flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    Download
                                  </button>
                                </div>
                                
                                <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
                                  <div>
                                    <p className="text-white text-sm font-medium">720p</p>
                                    <p className="text-gray-500 text-xs">HEVC • 600 MB</p>
                                  </div>
                                  <button className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded font-medium flex items-center gap-1">
                                    <Download className="w-3 h-3" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        );

      case 'explore':
        return (
          <div>
            <h3 className="text-white font-semibold mb-4">You may also like</h3>
            <div className="grid grid-cols-3 gap-3">
              {similarSeries.map((s) => (
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
            {similarSeries.length === 0 && (
              <p className="text-gray-500 text-center py-10">No similar series found</p>
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
        {series.backdrop ? (
          <Image
            src={series.backdrop}
            alt={series.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src={series.poster}
            alt={series.title}
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

      {/* Series Info */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          {/* Poster */}
          <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
            <Image
              src={series.poster}
              alt={series.title}
              fill
              className="object-cover"
            />
            {series.quality4k && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                4K
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 pb-2">
            <h1 className="text-white text-xl font-bold mb-2">{series.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{series.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-red-500 fill-red-500" />
                <span>{series.rating != null ? Number(series.rating).toFixed(1) : '0.0'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{series.seasons} Seasons</span>
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
