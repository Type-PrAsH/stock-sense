import React, { useRef, useEffect } from 'react';
import { Search, RefreshCw, Menu, X, User } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefreshNews: () => void;
  isRefreshing: boolean;
  onOpenMobileSidebar: () => void;
  onOpenSettings: () => void;
  isDemoData: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onRefreshNews,
  isRefreshing,
  onOpenMobileSidebar,
  onOpenSettings,
  isDemoData,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b0f14]/90 backdrop-blur-md border-b border-[#1e293b] px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#121821] focus:outline-hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search stocks, companies, or news (e.g., NVDA, Reliance, RBI)..."
            className="w-full pl-9 pr-9 py-2 bg-[#121821] text-sm text-slate-100 placeholder-slate-400 rounded-lg border border-[#1e293b] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-hidden transition-all shadow-xs"
            aria-label="Search stocks, companies, or news"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 hidden sm:flex items-center pointer-events-none">
              <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                /
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Market Status, Date, Refresh, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Market Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121821] border border-[#1e293b] text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Markets Live</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono text-[11px]">{todayFormatted}</span>
        </div>

        {/* Live or Demo Data Pill */}
        {isDemoData ? (
          <button
            onClick={onOpenSettings}
            title="Click to configure live news APIs"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium hover:bg-amber-500/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Demo Feed
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            title="Live API connected. Click to view status."
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Feed
          </button>
        )}

        {/* Refresh News Button */}
        <button
          onClick={onRefreshNews}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121821] hover:bg-slate-800 border border-[#1e293b] hover:border-slate-700 text-slate-200 text-xs font-medium transition-all disabled:opacity-50"
          aria-label="Refresh news feed"
          title="Refresh news"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* User Profile / Terminal Operator Placeholder */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenSettings}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpenSettings();
          }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:border-blue-400 transition-colors cursor-pointer"
          title="Account / Terminal Settings"
          aria-label="User settings"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
