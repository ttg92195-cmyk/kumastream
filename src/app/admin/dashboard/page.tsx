'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/movie/Header';
import { Plus, Film, Tv, Grid3X3, Users, LogOut, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster?: string;
}

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster?: string;
}

const ITEMS_PER_PAGE = 20;

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
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string; type: 'movie' | 'series' } | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    if (activeTab === 'movies') {
      fetch(`/api/movies?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.movies || []);
          setTotal(data.total || 0);
          setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
          setStats((prev) => ({ ...prev, movies: data.total || 0 }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      fetch(`/api/series?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
        .then((res) => res.json())
        .then((data) => {
          setSeries(data.series || []);
          setTotal(data.total || 0);
          setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
          setStats((prev) => ({ ...prev, series: data.total || 0 }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [admin, router, fetchData]);

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    
    return pages;
  };

  const handleEdit = (id: string) => {
    if (activeTab === 'movies') {
      router.push(`/admin/edit/movie/${id}`);
    } else {
      router.push(`/admin/edit/series/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    setDeleting(deleteConfirm.id);
    try {
      const endpoint = deleteConfirm.type === 'movie' 
        ? `/api/movies/${deleteConfirm.id}` 
        : `/api/series/${deleteConfirm.id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        if (deleteConfirm.type === 'movie') {
          setMovies(movies.filter((m) => m.id !== deleteConfirm.id));
          setStats((prev) => ({ ...prev, movies: prev.movies - 1 }));
        } else {
          setSeries(series.filter((s) => s.id !== deleteConfirm.id));
          setStats((prev) => ({ ...prev, series: prev.series - 1 }));
        }
        setTotal((prev) => prev - 1);
      } else {
        alert('Error: ' + (data.error || 'Failed to delete'));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete');
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const canEdit = (id: string) => id.startsWith('tmdb-');

  if (!admin) return null;

  const currentItems = activeTab === 'movies' ? movies : series;

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
            onClick={() => { setActiveTab('movies'); setCurrentPage(1); }}
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
            onClick={() => { setActiveTab('series'); setCurrentPage(1); }}
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
          <button 
            onClick={() => router.push('/admin/tmdb')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Info banner */}
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-xs">
            💡 Only TMDB imported items (starting with "tmdb-") can be edited or deleted. Static items are read-only.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Content List */}
            <div className="space-y-2">
              {currentItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">No {activeTab} found</p>
                </div>
              ) : (
                currentItems.map((item) => {
                  const isEditable = canEdit(item.id);
                  const isDeleting = deleting === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.poster && (
                          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.poster} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-gray-500 text-xs">
                            {item.year} • Rating: {item.rating?.toFixed?.(1) || 'N/A'}
                            {!isEditable && <span className="ml-2 text-yellow-500">(Static)</span>}
                          </p>
                          <p className="text-gray-600 text-xs truncate max-w-[200px]">{item.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(item.id)}
                          disabled={!isEditable}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            isEditable 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                              : 'text-gray-600 cursor-not-allowed'
                          )}
                          title={isEditable ? 'Edit' : 'Cannot edit static items'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ 
                            id: item.id, 
                            title: item.title, 
                            type: activeTab === 'movies' ? 'movie' : 'series' 
                          })}
                          disabled={!isEditable || isDeleting}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            isEditable && !isDeleting
                              ? 'text-gray-400 hover:text-red-500 hover:bg-gray-700' 
                              : 'text-gray-600 cursor-not-allowed'
                          )}
                          title={isEditable ? 'Delete' : 'Cannot delete static items'}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pb-4">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    className={cn(
                      'min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      page === currentPage
                        ? 'bg-red-500 text-white'
                        : page === '...'
                        ? 'bg-transparent text-gray-400 cursor-default'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPage === totalPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-center text-gray-500 text-xs pb-4">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} {activeTab}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-white font-bold text-lg mb-2">Delete {deleteConfirm.type === 'movie' ? 'Movie' : 'Series'}?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting === deleteConfirm.id}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-2"
              >
                {deleting === deleteConfirm.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
