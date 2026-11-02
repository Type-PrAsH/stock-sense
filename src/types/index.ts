export type MarketRegion = 'India' | 'US' | 'Global';

export type NewsCategory =
  | 'All News'
  | 'Indian Markets'
  | 'Global Markets'
  | 'Stocks & Companies'
  | 'Economy'
  | 'Earnings'
  | 'IPOs'
  | 'Commodities'
  | 'Technology';

export interface RelatedTicker {
  symbol: string;
  name: string;
  exchange?: string;
  changePercent?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: {
    name: string;
    url?: string;
    domain?: string;
  };
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: NewsCategory;
  market: MarketRegion;
  relatedTickers: RelatedTicker[];
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  isFeatured?: boolean;
  readTimeMinutes?: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  region: 'India' | 'US';
  isDemo: boolean;
  lastUpdated: string;
  currency: string;
}

export interface FilterState {
  category: NewsCategory;
  market: 'All' | MarketRegion;
  timeRange: 'all' | 'today' | 'week';
  sortBy: 'recent' | 'relevance';
  searchQuery: string;
}

export interface MentionedCompany {
  symbol: string;
  name: string;
  exchange?: string;
  mentions: number;
  changePercent?: number;
}

export interface TrendingTopic {
  tag: string;
  count: number;
  category: string;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  isDemoData: boolean;
  sourceType: 'live_api' | 'rss_live' | 'curated_demo';
  sourceName?: string;
  lastUpdated: string;
  totalCount: number;
  error?: string;
}
