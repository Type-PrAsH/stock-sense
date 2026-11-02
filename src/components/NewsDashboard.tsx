import React, { useState, useMemo } from 'react';
import { RefreshCw, Clock, Database, Sparkles, AlertCircle } from 'lucide-react';
import { FilterState, NewsArticle, NewsCategory } from '../types';
import {
  deduplicateArticles,
  filterAndSortArticles,
  extractTrendingCompanies,
  extractTrendingTopics,
  formatRelativeTime,
} from '../utils/newsFilters';
import { NewsFilters } from './NewsFilters';
import { FeaturedNews } from './FeaturedNews';
import { NewsFeed } from './NewsFeed';
import { TrendingPanel } from './TrendingPanel';

interface NewsDashboardProps {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isDemoData: boolean;
  onRefresh: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const INITIAL_FILTERS: FilterState = {
  category: 'All News',
  market: 'All',
  timeRange: 'all',
  sortBy: 'recent',
  searchQuery: '',
};

export const NewsDashboard: React.FC<NewsDashboardProps> = ({
  articles,
  isLoading,
  error,
  lastUpdated,
  isDemoData,
  onRefresh,
  onSelectArticle,
  onOpenSettings,
  searchQuery,
  onSearchChange,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync global search query into filters
  const effectiveFilters: FilterState = useMemo(() => {
    return {
      ...filters,
      searchQuery,
    };
  }, [filters, searchQuery]);

  const handleUpdateFilter = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    onSearchChange('');
  };

  const handleFilterByTicker = (ticker: string) => {
    onSearchChange(ticker);
  };

  const handleFilterByTopic = (topic: string) => {
    onSearchChange(topic);
  };

  // 1. Deduplicate raw articles
  const cleanArticles = useMemo(() => {
    return deduplicateArticles(articles);
  }, [articles]);

  // 2. Filter & Sort
  const filteredArticles = useMemo(() => {
    return filterAndSortArticles(cleanArticles, effectiveFilters);
  }, [cleanArticles, effectiveFilters]);

  // 3. Featured Article (picks best candidate from filtered or clean list)
  const featuredArticle = useMemo(() => {
    if (filteredArticles.length === 0) return null;
    const explicitFeatured = filteredArticles.find((a) => a.isFeatured);
    return explicitFeatured || filteredArticles[0];
  }, [filteredArticles]);

  // Remaining articles excluding featured in standard view
  const feedArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    // If user has searched or filtered heavily, keep feed complete, otherwise don't duplicate featured
    if (effectiveFilters.searchQuery.trim() || effectiveFilters.category !== 'All News') {
      return filteredArticles;
    }
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle, effectiveFilters]);

  // 4. Trends derived from the real dataset
  const trendingCompanies = useMemo(() => {
    return extractTrendingCompanies(cleanArticles);
  }, [cleanArticles]);

  const trendingTopics = useMemo(() => {
    return extractTrendingTopics(cleanArticles);
  }, [cleanArticles]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Stock News
            </h1>

            {/* News Count Badge */}
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold">
              {filteredArticles.length} stories
            </span>

            {/* Live or Demo News Indicator */}
            {isDemoData ? (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="Curated research demo dataset. Click for setup."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Demo News</span>
              </button>
            ) : (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="Live NewsAPI Real-Time Wire active. Click to view providers."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live News Wire</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay informed about the stories moving the markets. Real-time intelligence and publisher reporting.
          </p>
        </div>

        {/* Timestamp and Refresh */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {lastUpdated && (
            <div className="text-right text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated {formatRelativeTime(lastUpdated)}</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121821] hover:bg-slate-800 border border-[#1e293b] hover:border-slate-700 text-slate-200 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Refresh news feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Selectors */}
      <NewsFilters
        filters={effectiveFilters}
        onChangeFilter={handleUpdateFilter}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredArticles.length}
      />

      {/* Featured Article (Hero) - Shown on initial / All News view */}
      {featuredArticle && !effectiveFilters.searchQuery && effectiveFilters.category === 'All News' && (
        <FeaturedNews
          article={featuredArticle}
          onSelectArticle={onSelectArticle}
        />
      )}

      {/* Main Grid: Feed + Trending Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: News Feed */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between pb-3 mb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              {effectiveFilters.category === 'All News' ? 'Market Feed' : effectiveFilters.category}
            </h2>
            {effectiveFilters.searchQuery && (
              <span className="text-xs text-blue-400 font-mono">
                Keyword: &quot;{effectiveFilters.searchQuery}&quot;
              </span>
            )}
          </div>

          <NewsFeed
            articles={feedArticles}
            isLoading={isLoading}
            error={error}
            onRetry={onRefresh}
            onSelectArticle={onSelectArticle}
            onFilterByTicker={handleFilterByTicker}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Column: Trending Panel (desktop right side, mobile below) */}
        <div className="lg:col-span-4">
          <TrendingPanel
            trendingCompanies={trendingCompanies}
            trendingTopics={trendingTopics}
            trendingStories={cleanArticles}
            onSelectArticle={onSelectArticle}
            onFilterByTicker={handleFilterByTicker}
            onFilterByTopic={handleFilterByTopic}
          />
        </div>
      </div>
    </div>
  );
};
