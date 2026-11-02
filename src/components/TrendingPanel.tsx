import React from 'react';
import { Flame, Building2, Hash, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import { MentionedCompany, NewsArticle, TrendingTopic } from '../types';
import { formatRelativeTime } from '../utils/newsFilters';

interface TrendingPanelProps {
  trendingCompanies: MentionedCompany[];
  trendingTopics: TrendingTopic[];
  trendingStories: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onFilterByTicker: (ticker: string) => void;
  onFilterByTopic: (topic: string) => void;
}

export const TrendingPanel: React.FC<TrendingPanelProps> = ({
  trendingCompanies,
  trendingTopics,
  trendingStories,
  onSelectArticle,
  onFilterByTicker,
  onFilterByTopic,
}) => {
  return (
    <aside className="space-y-6" aria-label="Market Trends & Intelligence">
      {/* 1. Most Mentioned Companies (Derived directly from dataset) */}
      <div className="bg-[#121821] border border-[#1e293b] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Most Mentioned Companies
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-300">Live Mentions</span>
        </div>

        <div className="mt-3 space-y-2">
          {trendingCompanies.length > 0 ? (
            trendingCompanies.map((company) => (
              <button
                key={company.symbol}
                onClick={() => onFilterByTicker(company.symbol)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2330] transition-colors group text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-blue-400 shrink-0">
                    {company.symbol.slice(0, 3)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {company.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-300">
                      ${company.symbol} {company.exchange ? `• ${company.exchange}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {company.changePercent !== undefined && (
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        company.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {company.changePercent >= 0 ? '+' : ''}
                      {company.changePercent}%
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                    {company.mentions} {company.mentions === 1 ? 'story' : 'stories'}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-300 py-2">No company mentions detected.</p>
          )}
        </div>
      </div>

      {/* 2. Trending Market Topics */}
      <div className="bg-[#121821] border border-[#1e293b] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Popular Market Topics
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-300">Key Themes</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => onFilterByTopic(topic.tag)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e141c] hover:bg-[#1a2330] border border-[#1e293b] hover:border-blue-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <span>{topic.tag}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {topic.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Trending Stories */}
      <div className="bg-[#121821] border border-[#1e293b] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Key Market Stories
            </h3>
          </div>
        </div>

        <div className="mt-3 divide-y divide-[#1e293b]/60">
          {trendingStories.slice(0, 4).map((story, idx) => (
            <div
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="py-3 first:pt-1 last:pb-1 group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-sm font-mono font-bold text-slate-600 group-hover:text-blue-400">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-2 leading-relaxed">
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300">
                    <span>{story.source.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(story.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Terminal Disclaimer */}
      <div className="p-3.5 rounded-lg bg-[#0e131a] border border-[#1e293b] text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          <span>Research Terminal Standard</span>
        </div>
        <p className="leading-relaxed">
          Aggregated headlines, metadata, and fair-use excerpts for financial research. Real-time paper trading and backtesting engines launching in upcoming releases.
        </p>
      </div>
    </aside>
  );
};
