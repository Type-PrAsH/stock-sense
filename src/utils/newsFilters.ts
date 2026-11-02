import { FilterState, MentionedCompany, NewsArticle, RelatedTicker, TrendingTopic } from '../types';

/**
 * Master financial entities & equities dictionary for automatic stock & company recognition.
 */
export const COMPREHENSIVE_TICKERS: { symbol: string; name: string; aliases: string[]; exchange?: string }[] = [
  // US Equities & Tech Bellwethers
  { symbol: 'NVDA', name: 'Nvidia Corp', aliases: ['nvidia', 'blackwell'], exchange: 'NASDAQ' },
  { symbol: 'AAPL', name: 'Apple Inc', aliases: ['apple', 'iphone'], exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp', aliases: ['microsoft', 'azure'], exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc', aliases: ['tesla', 'elon musk'], exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', aliases: ['alphabet', 'google'], exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', aliases: ['amazon', 'aws'], exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms', aliases: ['meta', 'facebook', 'instagram'], exchange: 'NASDAQ' },
  { symbol: 'BRK.A', name: 'Berkshire Hathaway', aliases: ['berkshire', 'warren buffett'], exchange: 'NYSE' },
  { symbol: 'RDDT', name: 'Reddit Inc', aliases: ['reddit'], exchange: 'NYSE' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp', aliases: ['exxon', 'exxonmobil'], exchange: 'NYSE' },
  { symbol: 'CVX', name: 'Chevron Corp', aliases: ['chevron'], exchange: 'NYSE' },
  { symbol: 'KKR', name: 'KKR & Co Inc', aliases: ['kkr'], exchange: 'NYSE' },
  { symbol: 'CG', name: 'The Carlyle Group', aliases: ['carlyle'], exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', aliases: ['amd'], exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel Corp', aliases: ['intel'], exchange: 'NASDAQ' },
  { symbol: 'COIN', name: 'Coinbase Global', aliases: ['coinbase'], exchange: 'NASDAQ' },
  { symbol: 'PLTR', name: 'Palantir Technologies', aliases: ['palantir'], exchange: 'NYSE' },

  // Indian Leaders (NSE / BSE)
  { symbol: 'RELIANCE', name: 'Reliance Industries', aliases: ['reliance', 'ril', 'jio', 'mukesh ambani'], exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', aliases: ['tcs', 'tata consultancy'], exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', aliases: ['tata motors', 'tata group', 'jlr', 'tata'], exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', aliases: ['hdfc', 'hdfc bank'], exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', aliases: ['icici', 'icici bank'], exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', aliases: ['sbi', 'state bank of india'], exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', aliases: ['infosys'], exchange: 'NSE' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', aliases: ['zomato', 'blinkit'], exchange: 'NSE' },
  { symbol: 'SWIGGY', name: 'Swiggy Ltd', aliases: ['swiggy', 'instamart'], exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', aliases: ['airtel', 'bharti airtel'], exchange: 'NSE' },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd', aliases: ['gail'], exchange: 'NSE' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', aliases: ['adani'], exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', aliases: ['itc'], exchange: 'NSE' },
  { symbol: 'LT', name: 'Larsen & Toubro', aliases: ['larsen & toubro', 'l&t'], exchange: 'NSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', aliases: ['bajaj finance', 'bajaj finserv'], exchange: 'NSE' },
  { symbol: 'TITAN', name: 'Titan Company', aliases: ['titan'], exchange: 'NSE' },
  { symbol: 'EKI', name: 'EKI Energy Services', aliases: ['eki energy', 'eki'], exchange: 'BSE' },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance', aliases: ['muthoot finance', 'muthoot'], exchange: 'NSE' },
  { symbol: 'CDSL', name: 'Central Depository Services (India)', aliases: ['cdsl'], exchange: 'NSE' },
  { symbol: 'NTPC', name: 'NTPC Ltd', aliases: ['ntpc'], exchange: 'NSE' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', aliases: ['ongc'], exchange: 'NSE' },

  // Market Benchmarks & Regulatory Bodies
  { symbol: 'NIFTY50', name: 'Nifty 50 Index', aliases: ['nifty', 'nifty 50'], exchange: 'NSE' },
  { symbol: 'SENSEX', name: 'BSE Sensex', aliases: ['sensex', 'bse'], exchange: 'BSE' },
  { symbol: 'SEBI', name: 'Securities and Exchange Board of India', aliases: ['sebi'], exchange: 'REGULATOR' },
  { symbol: 'SPX', name: 'S&P 500', aliases: ['s&p', 's&p 500', 'sp500'], exchange: 'NYSE' },
  { symbol: 'IXIC', name: 'NASDAQ Composite', aliases: ['nasdaq'], exchange: 'NASDAQ' },
  { symbol: 'DJI', name: 'Dow Jones', aliases: ['dow jones', 'dow'], exchange: 'NYSE' },
];

/**
 * Extracts recognized stock tickers and company entities from text.
 */
export function extractTickersFromText(text: string): RelatedTicker[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = new Map<string, RelatedTicker>();

  for (const item of COMPREHENSIVE_TICKERS) {
    const isMatch = item.aliases.some((alias) => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lower);
    });

    if (isMatch) {
      matched.set(item.symbol, {
        symbol: item.symbol,
        name: item.name,
        exchange: item.exchange,
      });
    }
  }

  return Array.from(matched.values()).slice(0, 4);
}

/**
 * Checks whether an article is strictly relevant to financial markets, stock investing, or trading.
 */
export function isStockMarketRelevant(title: string, summary: string): boolean {
  const combined = `${title} ${summary}`.toLowerCase();

  // Negative patterns: eliminate lifestyle, gossip, recipes, sports, casual drama
  const blacklist = [
    'dining room',
    'took on $',
    'career advice',
    'recruiter',
    'recipe',
    'cooking',
    'football',
    'soccer',
    'nba',
    'wnba',
    'cricket',
    'hollywood',
    'bollywood',
    'celebrity',
    'dating',
    'marriage',
    'wedding',
    'diet',
    'weight loss',
    'tv series',
    'movie review',
    'vacation home',
    'priciest home',
    'fashion week',
    'album review',
  ];

  if (blacklist.some((term) => combined.includes(term))) {
    return false;
  }

  // 1. If it mentions any recognized stock ticker/company entity, it's directly relevant
  if (extractTickersFromText(combined).length > 0) {
    return true;
  }

  // 2. Positive financial indicators: must contain at least one market signal
  const financialSignals = [
    'stock', 'stocks', 'share', 'shares', 'equity', 'equities',
    'trading', 'trader', 'investor', 'investing', 'investment',
    'earnings', 'revenue', 'profit', 'dividend', 'ipo', 'listing',
    'nifty', 'sensex', 'bse', 'nse', 'sebi', 'nasdaq', 'nyse',
    's&p', 'dow', 'fed', 'rbi', 'inflation', 'yield', 'bull', 'bear',
    'rally', 'plunge', 'soar', 'quarter', 'q1', 'q2', 'q3', 'q4',
    'valuation', 'market cap', 'brokerage', 'target price', 'etf',
    'treasury', 'commodity', 'crude', 'gold', 'forex', 'hedge fund',
    'leverage', 'acquisition', 'merger', 'demerger', 'capex',
    'debt', 'mutual fund', 'portfolio', 'semiconductor', 'chip'
  ];

  return financialSignals.some((term) => combined.includes(term));
}

/**
 * Normalizes text for comparison (removes punctuation, extra spaces, lowercase).
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deduplicates articles by normalized URL or normalized title.
 */
export function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const result: NewsArticle[] = [];

  for (const article of articles) {
    const cleanUrl = article.url.toLowerCase().split('?')[0].trim();
    const cleanTitle = normalizeText(article.title);

    if (cleanUrl && seenUrls.has(cleanUrl)) continue;
    if (cleanTitle && seenTitles.has(cleanTitle)) continue;

    if (cleanUrl) seenUrls.add(cleanUrl);
    if (cleanTitle) seenTitles.add(cleanTitle);

    result.push(article);
  }

  return result;
}

/**
 * Calculates a relevance score for an article given a search query.
 */
export function calculateRelevanceScore(article: NewsArticle, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  const qTerms = q.split(/\s+/).filter(Boolean);
  let score = 0;

  const titleLower = article.title.toLowerCase();
  const summaryLower = article.summary.toLowerCase();
  const sourceLower = article.source.name.toLowerCase();

  // Exact full query match
  if (titleLower.includes(q)) score += 50;
  if (summaryLower.includes(q)) score += 20;

  // Check ticker matches
  for (const ticker of article.relatedTickers) {
    if (ticker.symbol.toLowerCase() === q) score += 60;
    else if (ticker.symbol.toLowerCase().includes(q)) score += 30;
    if (ticker.name.toLowerCase().includes(q)) score += 25;
  }

  // Term-level scoring
  for (const term of qTerms) {
    if (titleLower.includes(term)) score += 15;
    if (summaryLower.includes(term)) score += 8;
    if (sourceLower.includes(term)) score += 10;
  }

  if (article.isFeatured) score += 5;

  return score;
}

/**
 * Filters and sorts articles based on category, market, time, search query, and market relevance.
 */
export function filterAndSortArticles(
  articles: NewsArticle[],
  filters: FilterState,
  referenceNow?: number
): NewsArticle[] {
  const now = referenceNow ?? Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  const filtered = articles.filter((article) => {
    // 0. Ensure article is strictly relevant to financial markets/investing
    if (!isStockMarketRelevant(article.title, article.summary)) {
      return false;
    }

    // 1. Category filter
    if (filters.category !== 'All News' && article.category !== filters.category) {
      return false;
    }

    // 2. Market filter
    if (filters.market !== 'All' && article.market !== filters.market) {
      return false;
    }

    // 3. Time filter
    if (filters.timeRange !== 'all') {
      const pubTime = new Date(article.publishedAt).getTime();
      const diff = now - pubTime;
      if (filters.timeRange === 'today') {
        if (diff > dayMs || diff < -1000) return false;
      } else if (filters.timeRange === 'week') {
        if (diff > weekMs || diff < -1000) return false;
      }
    }

    // 4. Search Query
    if (filters.searchQuery.trim()) {
      const score = calculateRelevanceScore(article, filters.searchQuery);
      if (score === 0) return false;
    }

    return true;
  });

  // Sort
  return filtered.sort((a, b) => {
    if (filters.sortBy === 'relevance' && filters.searchQuery.trim()) {
      const scoreA = calculateRelevanceScore(a, filters.searchQuery);
      const scoreB = calculateRelevanceScore(b, filters.searchQuery);
      if (scoreA !== scoreB) return scoreB - scoreA;
    }

    // Default / tie-break: most recent
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });
}

/**
 * Extracts trending companies mentioned in the current article collection.
 * Scans both explicit relatedTickers and full article text for company entity matches.
 */
export function extractTrendingCompanies(articles: NewsArticle[]): MentionedCompany[] {
  const companyMap = new Map<string, MentionedCompany>();

  for (const article of articles) {
    const articleTickers = new Map<string, RelatedTicker>();

    // 1. From article's declared tickers
    for (const ticker of article.relatedTickers) {
      if (ticker.symbol !== 'SEBI') {
        articleTickers.set(ticker.symbol, ticker);
      }
    }

    // 2. From text scan
    const detected = extractTickersFromText(`${article.title} ${article.summary}`);
    for (const t of detected) {
      if (t.symbol !== 'SEBI' && !articleTickers.has(t.symbol)) {
        articleTickers.set(t.symbol, t);
      }
    }

    // Count 1 mention per article for each company
    for (const [sym, ticker] of articleTickers.entries()) {
      const existing = companyMap.get(sym);
      if (existing) {
        existing.mentions += 1;
        if (ticker.changePercent !== undefined) {
          existing.changePercent = ticker.changePercent;
        }
      } else {
        companyMap.set(sym, {
          symbol: ticker.symbol,
          name: ticker.name,
          exchange: ticker.exchange,
          mentions: 1,
          changePercent: ticker.changePercent,
        });
      }
    }
  }

  return Array.from(companyMap.values())
    .sort((a, b) => b.mentions - a.mentions || a.symbol.localeCompare(b.symbol))
    .slice(0, 7);
}

/**
 * Common financial keywords/topics to track trends in article headlines and summaries.
 */
const TRACKED_TOPIC_KEYWORDS = [
  { tag: 'Q3 Earnings', keywords: ['q3', 'earnings', 'quarterly', 'profit', 'revenue'], category: 'Earnings' },
  { tag: 'Interest Rates', keywords: ['rbi', 'fed', 'interest rate', 'rate cut', 'inflation', 'repo rate', 'yield'], category: 'Economy' },
  { tag: 'AI & Semiconductors', keywords: ['ai', 'semiconductor', 'chip', 'nvidia', 'datacenter'], category: 'Technology' },
  { tag: 'Crude Oil & Energy', keywords: ['crude', 'oil', 'brent', 'opec', 'energy', 'refining'], category: 'Commodities' },
  { tag: 'IPOs & Listings', keywords: ['ipo', 'listing', 'debut', 'drhp', 'public issue'], category: 'IPOs' },
  { tag: 'Banking & Credit', keywords: ['banking', 'npa', 'credit growth', 'hdfc', 'sbi', 'icici'], category: 'Indian Markets' },
  { tag: 'Electric Vehicles', keywords: ['ev', 'electric vehicle', 'battery', 'tata motors', 'tesla'], category: 'Technology' },
  { tag: 'Foreign Inflows (FII)', keywords: ['fii', 'fpi', 'dii', 'inflows', 'outflows', 'institutional'], category: 'Global Markets' },
];

/**
 * Extracts trending financial topics from articles based on actual occurrences.
 */
export function extractTrendingTopics(articles: NewsArticle[]): TrendingTopic[] {
  const counts: Record<string, { tag: string; category: string; count: number }> = {};

  for (const topic of TRACKED_TOPIC_KEYWORDS) {
    counts[topic.tag] = { tag: topic.tag, category: topic.category, count: 0 };
  }

  for (const article of articles) {
    const text = (article.title + ' ' + article.summary).toLowerCase();
    for (const topic of TRACKED_TOPIC_KEYWORDS) {
      const matches = topic.keywords.some((kw) => text.includes(kw));
      if (matches) {
        counts[topic.tag].count += 1;
      }
    }
  }

  return Object.values(counts)
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Human-readable relative time formatting (e.g., '15m ago', '3h ago', '2d ago').
 */
export function formatRelativeTime(isoString: string, referenceNow?: number): string {
  try {
    const pub = new Date(isoString).getTime();
    if (isNaN(pub)) return 'Recently';

    const now = referenceNow ?? Date.now();
    const diffSeconds = Math.floor((now - pub) / 1000);

    if (diffSeconds < 60) return 'Just now';
    const mins = Math.floor(diffSeconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}
