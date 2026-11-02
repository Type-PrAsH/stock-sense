import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, Building, Globe, Shield, TrendingUp, TrendingDown, Clock, Share2, Check } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatRelativeTime } from '../utils/newsFilters';
import { FinancialGraphicPlaceholder } from './FinancialGraphicPlaceholder';

interface ArticleDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onFilterByTicker: (ticker: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onFilterByTicker,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedExactDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(new Date(article.publishedAt));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#121821] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0e141c]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-blue-400">{article.source.name}</span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {article.category}
            </span>
            <span className="text-slate-400 font-mono text-[11px] uppercase">
              {article.market}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to clipboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Share story"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Article Headline */}
          <h1 id="article-detail-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
            {article.title}
          </h1>

          {/* Publishing Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 border-b border-[#1e293b]">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{formattedExactDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
            {article.readTimeMinutes && (
              <span className="text-slate-500">• {article.readTimeMinutes} min read</span>
            )}
          </div>

          {/* Article Image or Terminal Graphic */}
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-[#1e293b] max-h-80 min-h-[220px]">
            {article.imageUrl && !imgError ? (
              <img
                src={article.imageUrl}
                alt=""
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <FinancialGraphicPlaceholder
                category={article.category}
                symbol={article.relatedTickers[0]?.symbol}
                isHero
              />
            )}
          </div>

          {/* Related Company Tickers */}
          {article.relatedTickers.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1e293b] space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Related Equities & Tickers
              </span>
              <div className="flex flex-wrap gap-2">
                {article.relatedTickers.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      onFilterByTicker(t.symbol);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121821] hover:bg-[#1a2330] border border-[#1e293b] hover:border-blue-500/40 text-xs transition-colors group cursor-pointer"
                  >
                    <span className="font-mono font-bold text-blue-400">${t.symbol}</span>
                    <span className="text-slate-300 font-medium">{t.name}</span>
                    {t.changePercent !== undefined && (
                      <span
                        className={`font-mono text-[11px] ${
                          t.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.changePercent >= 0 ? '+' : ''}
                        {t.changePercent}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary and Content Excerpt */}
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            <p className="font-medium text-slate-200 bg-blue-950/20 p-4 rounded-xl border border-blue-900/30">
              {article.summary}
            </p>
            {article.content && article.content !== article.summary && (
              <p className="text-slate-300">{article.content}</p>
            )}
          </div>

          {/* Publisher Notice & Direct Source Link */}
          <div className="p-4 rounded-xl bg-[#0e141c] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">
                Original Reporting by {article.source.name}
              </span>
              <p className="text-[11px] text-slate-400 max-w-md">
                StockSense terminal respects intellectual property and provides licensed summaries &amp; metadata. Read full editorial coverage directly at the publisher.
              </p>
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Read Original Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1e293b] bg-[#0e141c] flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">StockSense Research Desk</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
