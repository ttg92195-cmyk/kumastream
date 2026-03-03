'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Search, Check, Loader2, Download, Film, Tv, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface TMDBItem {
  id: number;
  title: string;
  originalTitle: string;
  year: number;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  overview: string;
  genres: string;
  type: string;
  duration: number;
  seasons: number;
  totalEpisodes: number;
  casts: Array<{ name: string; role: string }>;
  director: string;
}

interface Genre {
  id: number;
  name: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export default function TMDBGeneratorPage() {
  const router = useRouter();
  const { admin } = useAppStore();
  
  // Filters
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [year, setYear] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [count, setCount] = useState<string>('20');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data
  const [genres, setGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  // Check admin authentication
  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, router]);

  // Fetch genres when type changes
  useEffect(() => {
    fetch(`/api/tmdb/genres?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.genres || []);
      })
      .catch(console.error);
  }, [type]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSelectedIds(new Set());
    
    try {
      const params = new URLSearchParams();
      params.set('type', type);
      if (year) params.set('year', year);
      if (genre) params.set('genre', genre);
      if (searchQuery) params.set('query', searchQuery);
      params.set('count', count === 'all' ? '100' : count);

      const response = await fetch(`/api/tmdb/search?${params.toString()}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [type, year, genre, count, searchQuery]);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(results.map((r) => r.id)));
    }
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    
    setImporting(true);
    setImportProgress({ current: 0, total: selectedIds.size });

    const selectedItems = results.filter((r) => selectedIds.has(r.id));
    
    try {
      const response = await fetch('/api/tmdb/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems.map(item => ({ id: item.id, type: item.type })) }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Data is now saved on the server, no need for localStorage
        const message = data.errors && data.errors.length > 0
          ? `Successfully imported ${data.count} items! (${data.errors.length} failed)`
          : `Successfully imported ${data.count} items!`;
        
        alert(message);
        
        // Remove imported items from results
        setResults(results.filter((r) => !selectedIds.has(r.id)));
        setSelectedIds(new Set());
      } else {
        alert('Import failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import items');
    } finally {
      setImporting(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0f0f0f] border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-red-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white font-bold text-lg">TMDB Generator</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Selected: {selectedIds.size}</span>
            <button
              onClick={handleImport}
              disabled={selectedIds.size === 0 || importing}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors',
                selectedIds.size > 0 && !importing
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              )}
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Import ({selectedIds.size})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h2 className="text-white font-semibold">Search Filters</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setType('movie'); setSelectedIds(new Set()); }}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                    type === 'movie' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                  )}
                >
                  <Film className="w-4 h-4" />
                  Movies
                </button>
                <button
                  onClick={() => { setType('tv'); setSelectedIds(new Set()); }}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                    type === 'tv' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                  )}
                >
                  <Tv className="w-4 h-4" />
                  TV Series
                </button>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Count (Post Limit)</label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">No Limit (All)</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Search by Title (Optional)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${type === 'movie' ? 'movies' : 'TV series'}...`}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center justify-between">
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-red-500 text-sm font-medium"
              >
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  selectedIds.size === results.length ? 'bg-red-500 border-red-500' : 'border-gray-500'
                )}>
                  {selectedIds.size === results.length && <Check className="w-3 h-3 text-white" />}
                </div>
                Select All ({results.length})
              </button>
              <span className="text-gray-400 text-sm">
                {selectedIds.size} selected
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={cn(
                    'relative rounded-md overflow-hidden cursor-pointer transition-all',
                    selectedIds.has(item.id) ? 'ring-2 ring-red-500' : ''
                  )}
                >
                  <div className="aspect-[2/3] relative">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Film className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    
                    {/* Overlay when selected */}
                    {selectedIds.has(item.id) && (
                      <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Rating */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded text-xs">
                      <span className="text-yellow-500">★</span>
                      <span className="text-white text-[10px]">{item.rating != null ? Number(item.rating).toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-2 bg-gray-800">
                    <h3 className="text-white text-xs font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-gray-400 text-[10px]">{item.year} • {item.type === 'movie' ? `${item.duration} min` : `${item.seasons} Season${item.seasons > 1 ? 's' : ''}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Use the filters above to search for {type === 'movie' ? 'movies' : 'TV series'}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Fetching from TMDB...</p>
          </div>
        )}
      </div>
    </div>
  );
}
