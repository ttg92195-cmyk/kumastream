'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Genre {
  id: string;
  name: string;
  type: string;
}

interface Collection {
  id: string;
  name: string;
  type: string;
}

interface GenresData {
  genres: {
    movies: Genre[];
    series: Genre[];
  };
  collections: {
    movies: Collection[];
    series: Collection[];
  };
}

export default function GenresPage() {
  const [data, setData] = useState<GenresData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'genres' | 'tags' | 'collections'>('genres');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-[#262626] p-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-gray-800 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4 space-y-6">
          <div className="h-6 w-16 bg-gray-800 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'genres', label: 'Genres' },
    { id: 'tags', label: 'Tags' },
    { id: 'collections', label: 'Collections' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-[#262626]">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => router.back()} className="text-red-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-lg">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeTab === 'genres' && data && (
          <>
            {/* Movies Section */}
            <section>
              <h2 className="text-white font-semibold mb-3">Movies</h2>
              <div className="grid grid-cols-3 gap-2">
                {data.genres.movies.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => router.push(`/movies?genre=${encodeURIComponent(genre.name)}`)}
                    className="px-3 py-3 bg-cyan-900/30 border border-cyan-700/50 text-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-800/40 transition-colors"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Series Section */}
            <section>
              <h2 className="text-white font-semibold mb-3">Series</h2>
              <div className="grid grid-cols-3 gap-2">
                {data.genres.series.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => router.push(`/series?genre=${encodeURIComponent(genre.name)}`)}
                    className="px-3 py-3 bg-cyan-900/30 border border-cyan-700/50 text-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-800/40 transition-colors"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'collections' && data && (
          <>
            {/* Movies Section */}
            <section>
              <h2 className="text-white font-semibold mb-3">Movies</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.collections.movies.map((collection) => (
                  <button
                    key={collection.id}
                    className="px-3 py-3 bg-cyan-900/30 border border-cyan-700/50 text-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-800/40 transition-colors text-left"
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Series Section */}
            <section>
              <h2 className="text-white font-semibold mb-3">Series</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.collections.series.map((collection) => (
                  <button
                    key={collection.id}
                    className="px-3 py-3 bg-cyan-900/30 border border-cyan-700/50 text-cyan-300 rounded-lg text-sm font-medium hover:bg-cyan-800/40 transition-colors text-left"
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'tags' && (
          <div className="text-center py-20">
            <p className="text-gray-500">No tags available</p>
          </div>
        )}
      </div>
    </div>
  );
}
