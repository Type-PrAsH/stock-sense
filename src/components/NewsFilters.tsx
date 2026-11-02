import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Clock, Globe } from 'lucide-react';
import { FilterState, NewsCategory, MarketRegion } from '../types';

interface NewsFiltersProps {
  filters: FilterState;
  onChangeFilter: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const CATEGORIES: NewsCategory[] = [
  'All News',
  'Indian Markets',
  'Global Markets',
  'Stocks & Companies',
  'Economy',
  'Earnings',
  'IPOs',
  'Commodities',
  'Technology',
];

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isFiltered =
    filters.category !== 'All News' ||
    filters.market !== 'All' ||
    filters.timeRange !== 'all' ||
    filters.sortBy !== 'recent' ||
    Boolean(filters.searchQuery);

  return (
    <div className="space-y-3 mb-6">
      {/* Category Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1e293b]/80 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onChangeFilter({ category: cat })}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121821]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Market, Time, Sort & Active Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Market Region Filter */}
          <div className="flex items-center gap-1.5 bg-[#121821] px-2.5 py-1.5 rounded-lg border border-[#1e293b] text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-400 font-medium">Market:</span>
            <select
              value={filters.market}
              onChange={(e) => onChangeFilter({ market: e.target.value as 'All' | MarketRegion })}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
              aria-label="Filter by market region"
            >
              <option value="All" className="bg-[#121821] text-slate-200">All Regions</option>
              <option value="India" className="bg-[#121821] text-slate-200">India (NSE/BSE)</option>
              <option value="US" className="bg-[#121821] text-slate-200">US Markets</option>
              <option value="Global" className="bg-[#121821] text-slate-200">Global</option>
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1.5 bg-[#121821] px-2.5 py-1.5 rounded-lg border border-[#1e293b] text-xs">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-400 font-medium">Time:</span>
            <select
              value={filters.timeRange}
              onChange={(e) => onChangeFilter({ timeRange: e.target.value as 'all' | 'today' | 'week' })}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
              aria-label="Filter by time range"
            >
              <option value="all" className="bg-[#121821] text-slate-200">All Time</option>
              <option value="today" className="bg-[#121821] text-slate-200">Today (24h)</option>
              <option value="week" className="bg-[#121821] text-slate-200">This Week</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 bg-[#121821] px-2.5 py-1.5 rounded-lg border border-[#1e293b] text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilter({ sortBy: e.target.value as 'recent' | 'relevance' })}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
              aria-label="Sort articles"
            >
              <option value="recent" className="bg-[#121821] text-slate-200">Most Recent</option>
              <option value="relevance" className="bg-[#121821] text-slate-200">Relevance</option>
            </select>
          </div>
        </div>

        {/* Counter and Reset Filters */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white font-mono">{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'story' : 'stories'}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-400 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
