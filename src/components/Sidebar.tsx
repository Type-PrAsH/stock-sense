import React from 'react';
import {
  Newspaper,
  TrendingUp,
  Building2,
  Bookmark,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  onOpenSettings,
  activeNav,
  setActiveNav,
}) => {
  const navItems = [
    { id: 'news', label: 'Stock News', icon: Newspaper, isReady: true },
    { id: 'overview', label: 'Market Overview', icon: TrendingUp, isReady: false },
    { id: 'research', label: 'Company Research', icon: Building2, isReady: false },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, isReady: false },
    { id: 'paper_trading', label: 'Paper Trading', icon: Briefcase, isReady: false },
  ];

  const handleNavClick = (id: string, isReady: boolean) => {
    if (isReady) {
      setActiveNav(id);
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close mobile navigation backdrop"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onCloseMobile();
            }
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b0f14] border-r border-[#1e293b] transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e293b]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white text-lg leading-tight">
                  Stock<span className="text-blue-400">Sense</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                  Terminal v1.0
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#121821]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
            {!isCollapsed ? 'Research & Markets' : '•••'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.isReady)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                    : item.isReady
                    ? 'text-slate-300 hover:text-white hover:bg-[#121821]'
                    : 'text-slate-300 cursor-not-allowed hover:bg-[#121821]/40'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && !item.isReady && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Area: Settings & Collapse Toggle */}
        <div className="p-3 border-t border-[#1e293b] space-y-2">
          <button
            onClick={onOpenSettings}
            title={isCollapsed ? 'Settings & Data Provider' : undefined}
            className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#121821] transition-all group ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-200 shrink-0" />
            {!isCollapsed && <span>Settings & API</span>}
          </button>

          {!isCollapsed && (
            <div className="px-3 py-2 rounded-lg bg-[#121821] border border-[#1e293b] text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected Sandbox</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero client API exposure. Pure financial terminal mode.
              </p>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121821] transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
