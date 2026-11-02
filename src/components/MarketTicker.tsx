import React, { useRef } from 'react';
import { TrendingUp, TrendingDown, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { MarketIndex } from '../types';

interface MarketTickerProps {
  indices: MarketIndex[];
  isDemoData: boolean;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ indices, isDemoData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0e131a] border-b border-[#1e293b] py-2 px-3 sm:px-4 select-none relative flex items-center group">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll indices left"
        className="hidden md:flex p-1 rounded-md bg-[#121821] text-slate-400 hover:text-white border border-[#1e293b] mr-1 shrink-0 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-none scroll-smooth flex-1"
      >
        {/* Strip Header Label */}
        <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-[#1e293b]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Indices
          </span>
          {isDemoData ? (
            <span
              className="flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30"
              title="Reference demo data: live prices not verified"
            >
              <Info className="w-2.5 h-2.5 inline" />
              DEMO
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              title="Real-time live quotes via Twelve Data"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Index Chips */}
        <div className="flex items-center gap-4 shrink-0">
          {indices.map((idx) => {
            const isPos = idx.change >= 0;
            const Arrow = isPos ? TrendingUp : TrendingDown;
            const changeColor = isPos ? 'text-emerald-400' : 'text-rose-400';
            const changeBg = isPos ? 'bg-emerald-500/10' : 'bg-rose-500/10';

            return (
              <div
                key={idx.symbol}
                className="flex items-center gap-2.5 px-3 py-1 rounded bg-[#121821]/80 border border-[#1e293b] hover:border-slate-700 transition-colors shrink-0"
              >
                {/* Index Name & Region */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">{idx.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {idx.region}
                  </span>
                </div>

                {/* Index Value */}
                <span className="font-mono text-xs font-medium text-slate-100">
                  {idx.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                {/* Change & Percentage */}
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium ${changeColor} ${changeBg}`}
                >
                  <Arrow className="w-3 h-3" />
                  <span>
                    {isPos ? '+' : ''}
                    {idx.change.toFixed(2)}
                  </span>
                  <span>({isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll indices right"
        className="hidden md:flex p-1 rounded-md bg-[#121821] text-slate-400 hover:text-white border border-[#1e293b] ml-1 shrink-0 cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
