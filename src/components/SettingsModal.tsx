import React from 'react';
import { X, Key, Shield, CheckCircle2, AlertTriangle, ExternalLink, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusInfo: {
    status: string;
    configuredProviders: { finnhub: boolean; newsApi: boolean; alphaVantage: boolean; twelveData: boolean };
    usingDemoData: boolean;
  } | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  statusInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-xl bg-[#121821] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0e141c]">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 id="settings-modal-title" className="text-base font-bold text-white">
              Data Providers &amp; Terminal Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Current Provider Status Card */}
          <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                Active Feed Status
              </span>
              {statusInfo?.usingDemoData ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Curated Demo Mode
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live API Connected
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {statusInfo?.usingDemoData
                ? 'StockSense is currently streaming from the curated financial research dataset containing realistic Indian & Global market intelligence. Values and stories are clearly designated as demo data.'
                : 'StockSense is connected to your configured live market news provider. Headlines and coverage stream directly from provider servers.'}
            </p>
          </div>

          {/* Provider Integrations Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Supported News Providers
            </h3>

            <div className="space-y-2">
              {/* Finnhub */}
              <div className="p-3.5 rounded-lg bg-[#0e141c] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Finnhub Stock API</span>
                    {statusInfo?.configuredProviders.finnhub ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                        Not configured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Provides general market &amp; company news. Key: <code className="text-blue-400">FINNHUB_API_KEY</code>
                  </span>
                </div>
                <a
                  href="https://finnhub.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                >
                  <span>finnhub.io</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* NewsAPI */}
              <div className="p-3.5 rounded-lg bg-[#0e141c] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">NewsAPI Business Desk</span>
                    {statusInfo?.configuredProviders.newsApi ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                        Not configured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Global business headlines. Key: <code className="text-blue-400">NEWS_API_KEY</code>
                  </span>
                </div>
                <a
                  href="https://newsapi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                >
                  <span>newsapi.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Alpha Vantage */}
              <div className="p-3.5 rounded-lg bg-[#0e141c] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Alpha Vantage Market News</span>
                    {statusInfo?.configuredProviders.alphaVantage ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                        Not configured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Financial sentiment &amp; company news. Key: <code className="text-blue-400">ALPHA_VANTAGE_API_KEY</code>
                  </span>
                </div>
                <a
                  href="https://www.alphavantage.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                >
                  <span>alphavantage.co</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Twelve Data */}
              <div className="p-3.5 rounded-lg bg-[#0e141c] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Twelve Data (Live Indices)</span>
                    {statusInfo?.configuredProviders.twelveData ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                        Not configured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Live NIFTY 50, SENSEX, BANK NIFTY, S&amp;P 500, NASDAQ, Dow. Key: <code className="text-blue-400">TWELVE_DATA_API_KEY</code>
                  </span>
                </div>
                <a
                  href="https://twelvedata.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
                >
                  <span>twelvedata.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              How to Connect a Live API
            </div>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>
                Obtain a free API key from{' '}
                <a href="https://finnhub.io" target="_blank" rel="noreferrer" className="text-blue-400 underline">
                  Finnhub
                </a>{' '}
                or{' '}
                <a href="https://newsapi.org" target="_blank" rel="noreferrer" className="text-blue-400 underline">
                  NewsAPI
                </a>.
              </li>
              <li>
                Add <code className="text-blue-300 bg-blue-950 px-1 py-0.5 rounded">FINNHUB_API_KEY=your_key</code> in your environment variables.
              </li>
              <li>
                Restart or refresh the terminal. The backend will automatically detect the key, proxy requests server-side, and stream live articles.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e293b] bg-[#0e141c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
