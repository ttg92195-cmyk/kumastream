'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/movie/Header';
import { Plus, Film, Tv, Grid3X3, Users, LogOut, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
}

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
}

export default function AdminDashboardPage() {
  const { admin, logoutAdmin } = useAppStore();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [stats, setStats] = useState({
    movies: 0,
    series: 0,
    genres: 0,
    users: 0,
  });
  const [activeTab, setActiveTab] = useState<'movies' | 'series'>('movies');

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Fetch data
    fetch('/api/movies?limit=100')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || []);
        setStats((prev) => ({ ...prev, movies: data.total || 0 }));
      });

    fetch('/api/series?limit=100')
      .then((res) => res.json())
      .then((data) => {
        setSeries(data.series || []);
        setStats((prev) => ({ ...prev, series: data.total || 0 }));
      });
  }, [admin, router]);

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header title="Admin Dashboard" showSearch={false} />

      <div className="p-4">
        {/* Admin Info */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{admin.username.charAt(0)}</span>
            </div>
            <div>
              <p className="text-white font-medium">{admin.username}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <Film className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-white text-xl font-bold">{stats.movies}</p>
            <p className="text-gray-500 text-xs">Movies</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <Tv className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-white text-xl font-bold">{stats.series}</p>
            <p className="text-gray-500 text-xs">Series</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <Grid3X3 className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-white text-xl font-bold">18</p>
            <p className="text-gray-500 text-xs">Genres</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <Users className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-white text-xl font-bold">1</p>
            <p className="text-gray-500 text-xs">Users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('movies')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'movies'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400'
            )}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'series'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400'
            )}
          >
            Series
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-2">
          {activeTab === 'movies' &&
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{movie.title}</p>
                  <p className="text-gray-500 text-xs">
                    {movie.year} • Rating: {movie.rating}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'series' &&
            series.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{s.title}</p>
                  <p className="text-gray-500 text-xs">
                    {s.year} • Rating: {s.rating}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
