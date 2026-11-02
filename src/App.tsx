/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MarketIndex, NewsArticle } from './types';
import { getNews, getMarketIndices, getApiStatus } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MarketTicker } from './components/MarketTicker';
import { NewsDashboard } from './components/NewsDashboard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { ComingSoonView } from './components/ComingSoonView';

export default function App() {
  // Navigation & UI States
  const [activeNav, setActiveNav] = useState<string>('news');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('stocksense_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data States
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState<boolean>(true);
  const [statusInfo, setStatusInfo] = useState<{
    status: string;
    configuredProviders: { finnhub: boolean; newsApi: boolean; alphaVantage: boolean; twelveData: boolean };
    usingDemoData: boolean;
  } | null>(null);

  // Toggle desktop sidebar collapse & persist
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('stocksense_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Fetch news
  const loadNews = useCallback(async (forceRefresh = false) => {
    setIsLoadingNews(true);
    setNewsError(null);
    try {
      const res = await getNews(forceRefresh);
      setArticles(res.articles);
      setIsDemoData(res.isDemoData);
      setLastUpdated(res.lastUpdated);
    } catch (err: any) {
      console.error('Failed to load news:', err);
      setNewsError(err.message || 'Unable to connect to market news service');
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  // Fetch market indices
  const loadMarketIndices = useCallback(async () => {
    try {
      const res = await getMarketIndices();
      setIndices(res.indices);
    } catch (err: any) {
      console.warn('Market indices retrieval warning:', err);
    }
  }, []);

  // Fetch status info
  const loadStatus = useCallback(async () => {
    try {
      const res = await getApiStatus();
      setStatusInfo(res);
    } catch (err: any) {
      console.warn('API status check warning:', err);
    }
  }, []);

  useEffect(() => {
    loadNews();
    loadMarketIndices();
    loadStatus();
  }, [loadNews, loadMarketIndices, loadStatus]);

  // Handle ticker or search filter from any child
  const handleFilterByTicker = (ticker: string) => {
    setSearchQuery(ticker);
    setActiveNav('news');
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefreshNews={() => loadNews(true)}
          isRefreshing={isLoadingNews}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isDemoData={isDemoData}
        />

        {/* Market Ticker Strip */}
        <MarketTicker indices={indices} isDemoData={isDemoData} />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeNav === 'news' ? (
            <NewsDashboard
              articles={articles}
              isLoading={isLoadingNews}
              error={newsError}
              lastUpdated={lastUpdated}
              isDemoData={isDemoData}
              onRefresh={() => loadNews(true)}
              onSelectArticle={setSelectedArticle}
              onOpenSettings={() => setIsSettingsOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          ) : (
            <ComingSoonView
              viewId={activeNav}
              onBackToNews={() => setActiveNav('news')}
            />
          )}
        </main>
      </div>

      {/* Article Detail Slide-Over Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onFilterByTicker={handleFilterByTicker}
      />

      {/* Settings & Provider Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        statusInfo={statusInfo}
      />
    </div>
  );
}
