import { MarketIndex, NewsApiResponse } from '../types';

export async function getNews(forceRefresh = false): Promise<NewsApiResponse> {
  const url = forceRefresh ? '/api/news?refresh=true' : '/api/news';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch news: ${res.statusText}`);
  }
  return res.json();
}

export async function getMarketIndices(): Promise<{ indices: MarketIndex[]; isDemoData: boolean; lastUpdated: string }> {
  const res = await fetch('/api/market-indices');
  if (!res.ok) {
    throw new Error(`Failed to fetch market indices: ${res.statusText}`);
  }
  return res.json();
}

export async function getApiStatus(): Promise<{
  status: string;
  configuredProviders: { finnhub: boolean; newsApi: boolean; alphaVantage: boolean; twelveData: boolean };
  usingDemoData: boolean;
}> {
  const res = await fetch('/api/status');
  if (!res.ok) {
    throw new Error(`Failed to fetch API status: ${res.statusText}`);
  }
  return res.json();
}
