'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import {
  Home,
  Film,
  Tv,
  Bookmark,
  Grid3X3,
  Clock,
  Download,
  Settings,
  Shield,
  X,
  LogOut,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, admin, logoutAdmin } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  // Base menu items (always visible)
  const baseMenuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'Series', href: '/series', icon: Tv },
    { name: 'Bookmark', href: '/bookmark', icon: Bookmark },
    { name: 'Genres/Tags/Collections', href: '/genres', icon: Grid3X3 },
    { name: 'Recent', href: '/recent', icon: Clock },
    { name: 'Downloads', href: '/downloads', icon: Download },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Admin only items
  const adminMenuItems = [
    { name: 'TMDB Generator', href: '/admin/tmdb', icon: Database },
  ];

  const handleLogout = () => {
    logoutAdmin();
    setSidebarOpen(false);
    router.push('/');
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f0f0f] z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">CINE</h1>
              <p className="text-gray-500 text-xs">STREAMING</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Badge */}
        {admin && (
          <div className="mx-4 mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/50">
            <p className="text-red-400 text-sm font-medium">Admin Mode</p>
            <p className="text-gray-400 text-xs">Logged in as {admin.username}</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {baseMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-red-500/20 text-red-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-red-500')} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Admin Only Items */}
          {admin && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-gray-500 text-xs font-medium px-4">Admin Tools</p>
              </div>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-red-500/20 text-red-500'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive && 'text-red-500')} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}

          {/* Login/Logout */}
          <div className="pt-4 border-t border-gray-800 mt-4">
            {admin ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  pathname === '/admin/login'
                    ? 'bg-red-500/20 text-red-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <Shield className={cn('w-5 h-5', pathname === '/admin/login' && 'text-red-500')} />
                <span className="text-sm font-medium">Admin Login</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] mt-4">
          <p className="text-gray-500 text-xs text-center">
            © 2024 CINE STREAM
          </p>
        </div>
      </aside>
    </>
  );
}
