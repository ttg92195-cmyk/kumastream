'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/movie/Header';
import { MovieCard } from '@/components/movie/MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  quality4k: boolean;
}

const ITEMS_PER_PAGE = 20;

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(() => {
    setLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const url = searchQuery
      ? `/api/series?search=${encodeURIComponent(searchQuery)}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
      : `/api/series?limit=${ITEMS_PER_PAGE}&offset=${offset}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSeries(data.series || []);
        setTotal(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <>
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
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} series
            </div>
          </>
        )}
      </div>
    </div>
  );
}
