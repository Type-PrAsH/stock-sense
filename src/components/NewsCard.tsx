import React, { useState } from 'react';
import { ExternalLink, Clock, Building, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatRelativeTime } from '../utils/newsFilters';
import { FinancialGraphicPlaceholder } from './FinancialGraphicPlaceholder';

interface NewsCardProps {
  article: NewsArticle;
  onSelectArticle: (article: NewsArticle) => void;
  onFilterByTicker?: (ticker: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSelectArticle,
  onFilterByTicker,
}) => {
  const [imgError, setImgError] = useState(false);
  const getSentimentBadge = () => {
    if (!article.sentiment) return null;
    if (article.sentiment === 'bullish') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <TrendingUp className="w-2.5 h-2.5" />
          Bullish
        </span>
      );
    }
    if (article.sentiment === 'bearish') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <TrendingDown className="w-2.5 h-2.5" />
          Bearish
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
        <Minus className="w-2.5 h-2.5" />
        Neutral
      </span>
    );
  };

  return (
    <article className="group bg-[#121821] hover:bg-[#161e2a] border border-[#1e293b] hover:border-blue-500/40 rounded-xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Source Header & Tags */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold text-blue-400 truncate max-w-[140px] sm:max-w-none">
              {article.source.name}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {getSentimentBadge()}
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {article.market}
            </span>
          </div>
        </div>

        {/* Headline & Thumbnail Layout */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <h3
              onClick={() => onSelectArticle(article)}
              className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors cursor-pointer text-base sm:text-lg leading-snug line-clamp-2"
            >
              {article.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>

          {article.imageUrl && !imgError ? (
            <div
              onClick={() => onSelectArticle(article)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer border border-[#1e293b]"
            >
              <img
                src={article.imageUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div
              onClick={() => onSelectArticle(article)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer border border-[#1e293b] hidden sm:block"
            >
              <FinancialGraphicPlaceholder
                category={article.category}
                symbol={article.relatedTickers[0]?.symbol}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer: Related Tickers & Actions */}
      <div className="mt-4 pt-3 border-t border-[#1e293b]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Ticker Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-300 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
            {article.category}
          </span>

          {article.relatedTickers.map((t) => (
            <button
              key={t.symbol}
              onClick={() => onFilterByTicker && onFilterByTicker(t.symbol)}
              title={`Filter news by ${t.name} (${t.symbol})`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/40 font-mono text-[11px] transition-colors cursor-pointer"
            >
              <span>${t.symbol}</span>
              {t.changePercent !== undefined && (
                <span
                  className={t.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                >
                  {t.changePercent >= 0 ? '+' : ''}
                  {t.changePercent}%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Read Article & External Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectArticle(article)}
            className="text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Details
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Read original source"
            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
            aria-label="Open original article in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
