import React from 'react';
import { TrendingUp, BarChart2, Globe, Activity } from 'lucide-react';

interface FinancialGraphicPlaceholderProps {
  category?: string;
  symbol?: string;
  className?: string;
  isHero?: boolean;
}

export const FinancialGraphicPlaceholder: React.FC<FinancialGraphicPlaceholderProps> = ({
  category = 'Markets',
  symbol,
  className = '',
  isHero = false,
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c121a] via-[#121a24] to-[#0e1622] select-none ${className}`}
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Candlestick & Sparkline Silhouette SVG */}
      <svg
        className={`absolute inset-0 w-full h-full opacity-20 text-blue-500`}
        preserveAspectRatio="none"
        viewBox="0 0 400 200"
      >
        <path
          d="M0,150 Q80,120 140,140 T260,80 T360,110 T400,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M0,150 Q80,120 140,140 T260,80 T360,110 T400,60 L400,200 L0,200 Z"
          fill="url(#blue-grad)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Icon & Badge */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
          {symbol ? (
            <span className="font-mono font-bold text-sm tracking-wider">${symbol.slice(0, 4)}</span>
          ) : (
            <Activity className="w-6 h-6" />
          )}
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
          {category} Intelligence
        </span>
      </div>
    </div>
  );
};
