import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Inbox, ChevronDown } from 'lucide-react';
import { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface NewsFeedProps {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  onFilterByTicker: (ticker: string) => void;
  onResetFilters: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  articles,
  isLoading,
  error,
  onRetry,
  onSelectArticle,
  onFilterByTicker,
  onResetFilters,
}) => {
  const [displayCount, setDisplayCount] = useState(8);

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  // Loading Skeleton State
  if (isLoading && articles.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-[#121821] border border-[#1e293b] animate-pulse space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-slate-800 rounded"></div>
              <div className="h-3 w-16 bg-slate-800 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-4/5 bg-slate-800 rounded"></div>
              <div className="h-3 w-full bg-slate-850 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-850 rounded"></div>
            </div>
            <div className="pt-2 flex gap-2">
              <div className="h-4 w-16 bg-slate-800 rounded"></div>
              <div className="h-4 w-20 bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error && articles.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-[#121821] border border-rose-500/30 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">Failed to Load Market News</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  // Empty State
  if (articles.length === 0) {
    return (
      <div className="p-12 rounded-xl bg-[#121821] border border-[#1e293b] text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <Inbox className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">No News Stories Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No matching articles were found for the selected category, region, or search keyword.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold transition-colors"
        >
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feed list */}
      <div className="space-y-3.5">
        {visibleArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onSelectArticle={onSelectArticle}
            onFilterByTicker={onFilterByTicker}
          />
        ))}
      </div>

      {/* Load More Pagination */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#121821] hover:bg-slate-800 border border-[#1e293b] hover:border-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            <span>Load More News ({articles.length - displayCount} remaining)</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
};
