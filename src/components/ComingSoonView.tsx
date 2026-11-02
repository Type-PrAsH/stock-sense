import React from 'react';
import { TrendingUp, Building2, Bookmark, Briefcase, ArrowLeft, Clock } from 'lucide-react';

interface ComingSoonViewProps {
  viewId: string;
  onBackToNews: () => void;
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({ viewId, onBackToNews }) => {
  const metaMap: Record<string, { title: string; subtitle: string; icon: any; plannedPhase: string }> = {
    overview: {
      title: 'Market Overview',
      subtitle: 'Comprehensive multi-asset macro dashboard with sector heatmaps and global advance-decline ratios.',
      icon: TrendingUp,
      plannedPhase: 'Phase 2 (Terminal Beta)',
    },
    research: {
      title: 'Company Research & Fundamentals',
      subtitle: 'In-depth financial statements, balance sheet health scores, and automated valuation models for Indian and global equities.',
      icon: Building2,
      plannedPhase: 'Phase 2 (Terminal Beta)',
    },
    watchlist: {
      title: 'Equities Watchlist',
      subtitle: 'Real-time custom watchlists, price alert webhooks, and portfolio tagging.',
      icon: Bookmark,
      plannedPhase: 'Phase 3',
    },
    paper_trading: {
      title: 'Paper Trading Simulator',
      subtitle: 'Risk-free simulated execution engine with virtual capital, market order routing, and execution latency simulation.',
      icon: Briefcase,
      plannedPhase: 'Phase 3',
    },
  };

  const meta = metaMap[viewId] || {
    title: 'Module in Development',
    subtitle: 'This research capability is currently under active architecture.',
    icon: Clock,
    plannedPhase: 'Future Roadmap',
  };

  const Icon = meta.icon;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Planned Roadmap • {meta.plannedPhase}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{meta.title}</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {meta.subtitle}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#121821] border border-[#1e293b] text-xs text-slate-400 text-left space-y-2">
        <div className="font-semibold text-slate-200">Terminal Architecture Status</div>
        <p className="leading-relaxed">
          StockSense MVP is intentionally dedicated to the <strong>Stock News &amp; Market Intelligence Engine</strong>. As financial research models settle, this module will seamlessly dock into the unified terminal.
        </p>
      </div>

      <button
        onClick={onBackToNews}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Stock News Terminal</span>
      </button>
    </div>
  );
};
