'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function Header({
  title = 'CINE',
  showSearch = true,
  searchPlaceholder = 'Search...',
  onSearch,
}: HeaderProps) {
  const { toggleSidebar, searchQuery, setSearchQuery, _hasHydrated } = useAppStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Only render after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use hydrated data if available, otherwise use defaults
  const currentSearchQuery = (mounted && _hasHydrated) ? searchQuery : '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSearchQuery.trim()) {
      if (onSearch) {
        onSearch(currentSearchQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(currentSearchQuery)}`);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Don't render search value until hydrated
  const displaySearchQuery = mounted && _hasHydrated ? searchQuery : '';

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-[#262626]">
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Menu Button */}
        <button
          onClick={toggleSidebar}
          className="text-red-500 hover:text-red-400 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo or Title */}
        {!isSearchFocused && (
          <h1 className="text-white font-bold text-lg">{title}</h1>
        )}

        {/* Search */}
        {showSearch && (
          <form onSubmit={handleSearch} className="flex-1 flex items-center">
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={displaySearchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#1f1f1f] text-white placeholder-gray-500 pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              {displaySearchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
