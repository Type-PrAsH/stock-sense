import React, { useState } from 'react';
import { ExternalLink, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatRelativeTime } from '../utils/newsFilters';
import { FinancialGraphicPlaceholder } from './FinancialGraphicPlaceholder';

interface FeaturedNewsProps {
  article: NewsArticle;
  onSelectArticle: (article: NewsArticle) => void;
}

export const FeaturedNews: React.FC<FeaturedNewsProps> = ({ article, onSelectArticle }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="mb-8" aria-label="Featured Story">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#121821] to-[#0e141c] border border-blue-500/20 shadow-lg shadow-black/30 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Article Image Container */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-900">
            {article.imageUrl && !imgError ? (
              <img
                src={article.imageUrl}
                alt=""
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                loading="eager"
              />
            ) : (
              <FinancialGraphicPlaceholder
                category={article.category}
                symbol={article.relatedTickers[0]?.symbol}
                isHero
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e141c] via-transparent to-transparent lg:hidden" />
          </div>

          {/* Article Content Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Badges: Featured Tag & Category */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Featured Story
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                  {article.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {article.market}
                </span>
              </div>

              {/* Headline */}
              <h2
                onClick={() => onSelectArticle(article)}
                className="text-xl sm:text-2xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer leading-snug line-clamp-3"
              >
                {article.title}
              </h2>

              {/* Short Summary */}
              <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>

              {/* Related Tickers if present */}
              {article.relatedTickers.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-400 font-medium">Tickers:</span>
                  {article.relatedTickers.map((t) => (
                    <span
                      key={t.symbol}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono font-medium text-blue-300"
                    >
                      ${t.symbol}
                      {t.changePercent !== undefined && (
                        <span
                          className={`text-[10px] ${
                            t.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {t.changePercent >= 0 ? '+' : ''}
                          {t.changePercent}%
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-6 mt-6 border-t border-[#1e293b] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-200">{article.source.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectArticle(article)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
