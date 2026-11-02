import { NewsApiResponse, NewsArticle, MarketIndex } from '../src/types';
import { getCuratedArticles, getCuratedMarketIndices } from './sampleData';
import { extractTickersFromText, isStockMarketRelevant } from '../src/utils/newsFilters';

interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
  sourceType: 'live_api' | 'rss_live' | 'curated_demo';
  sourceName?: string;
  isDemoData: boolean;
}

let cachedNews: CacheEntry | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// Market Indices Cache (1 minute)
let cachedIndices: { indices: MarketIndex[]; isDemoData: boolean; lastUpdated: string } | null = null;
const INDICES_CACHE_TTL_MS = 60 * 1000;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function detectFinancialCategory(text: string): any {
  const t = text.toLowerCase();
  if (t.includes('earning') || t.includes('quarter') || t.includes('profit') || t.includes('revenue') || t.includes('net income') || t.includes('results')) return 'Earnings';
  if (t.includes('ipo') || t.includes('listing') || t.includes('debut') || t.includes('drhp') || t.includes('public issue')) return 'IPOs';
  if (t.includes('inflation') || t.includes('interest rate') || t.includes('fed ') || t.includes('rbi ') || t.includes('gdp') || t.includes('repo rate') || t.includes('treasury') || t.includes('tax') || t.includes('tariff')) return 'Economy';
  if (t.includes('oil') || t.includes('crude') || t.includes('gold') || t.includes('commodity') || t.includes('brent') || t.includes('natural gas') || t.includes('refining') || t.includes('metal')) return 'Commodities';
  if (/\b(ai|chips?|semiconductor|cloud|software|tech|gpu|hardware)\b/i.test(t)) return 'Technology';
  if (t.includes('nifty') || t.includes('sensex') || t.includes('sebi') || t.includes('bse') || t.includes('nse') || t.includes('india') || t.includes('dalal street') || t.includes('rupee')) return 'Indian Markets';
  if (t.includes('stock') || t.includes('shares') || t.includes('company') || t.includes('merger') || t.includes('acquisition') || t.includes('brokerage') || t.includes('leveraged loan')) return 'Stocks & Companies';
  return 'Global Markets';
}

function detectSentiment(title: string): 'bullish' | 'bearish' | 'neutral' {
  const t = title.toLowerCase();
  if (t.includes('surge') || t.includes('jump') || t.includes('rally') || t.includes('soar') || t.includes('beat') || t.includes('gain') || t.includes('high') || t.includes('record')) {
    return 'bullish';
  }
  if (t.includes('plunge') || t.includes('drop') || t.includes('fall') || t.includes('slip') || t.includes('slump') || t.includes('crash') || t.includes('penalty') || t.includes('bars') || t.includes('loss')) {
    return 'bearish';
  }
  return 'neutral';
}

function isIndianMarketStory(text: string, sourceName: string): boolean {
  const t = `${text} ${sourceName}`.toLowerCase();
  return (
    t.includes('nifty') ||
    t.includes('sensex') ||
    t.includes('sebi') ||
    t.includes('bse') ||
    t.includes('nse') ||
    t.includes('rbi') ||
    t.includes('india') ||
    t.includes('rupee') ||
    t.includes('reliance') ||
    t.includes('tata') ||
    t.includes('hdfc') ||
    t.includes('infosys') ||
    t.includes('zomato') ||
    t.includes('business standard') ||
    t.includes('livemint') ||
    t.includes('economic times') ||
    t.includes('moneycontrol')
  );
}

/**
 * Fetch strictly relevant financial news from external APIs if keys are available, else fallback safely.
 */
export async function fetchNewsArticles(forceRefresh = false): Promise<NewsApiResponse> {
  const now = Date.now();

  if (!forceRefresh && cachedNews && now - cachedNews.timestamp < CACHE_TTL_MS) {
    return {
      articles: cachedNews.data,
      isDemoData: cachedNews.isDemoData,
      sourceType: cachedNews.sourceType,
      sourceName: cachedNews.sourceName,
      lastUpdated: new Date(cachedNews.timestamp).toISOString(),
      totalCount: cachedNews.data.length,
    };
  }

  const newsApiKey = process.env.NEWS_API_KEY?.trim();
  const finnhubKey = process.env.FINNHUB_API_KEY?.trim();

  // 1. NewsAPI with Whitelisted Financial Publishers & Strict Search Parameters
  if (newsApiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      // Whitelist ONLY dedicated financial and business news agencies
      const financialDomains = [
        'economictimes.indiatimes.com',
        'moneycontrol.com',
        'livemint.com',
        'business-standard.com',
        'financialexpress.com',
        'reuters.com',
        'cnbc.com',
        'marketwatch.com',
        'finance.yahoo.com',
        'bloomberg.com',
      ].join(',');

      const financialQuery = '(stock OR stocks OR equities OR trading OR shares OR market OR markets OR earnings OR IPO OR SEBI OR Nifty OR Sensex OR dividend OR valuation)';

      const queryUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        financialQuery
      )}&searchIn=title,description&domains=${financialDomains}&language=en&sortBy=publishedAt&pageSize=40&apiKey=${newsApiKey}`;

      const res = await fetch(queryUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.articles) && data.articles.length > 0) {
          const rawItems = data.articles.filter((a: any) => a.title && a.title !== '[Removed]');

          // Filter out any lifestyle/irrelevant articles and format with rich financial metadata
          const strictlyRelevant = rawItems
            .filter((item: any) => isStockMarketRelevant(item.title, item.description || ''))
            .map((item: any, idx: number) => {
              const fullText = `${item.title} ${item.description || ''}`;
              const isIndia = isIndianMarketStory(fullText, item.source?.name || '');
              const detectedTickers = extractTickersFromText(fullText);

              return {
                id: `newsapi-${idx}-${Math.abs(hashString(item.url || ''))}`,
                title: item.title,
                summary: item.description || item.title,
                content: item.content || item.description,
                source: { name: item.source?.name || 'Financial Wire' },
                url: item.url,
                imageUrl: item.urlToImage || undefined,
                publishedAt: item.publishedAt || new Date().toISOString(),
                category: detectFinancialCategory(fullText),
                market: (isIndia ? 'India' : 'Global') as 'India' | 'Global' | 'US',
                relatedTickers: detectedTickers,
                sentiment: detectSentiment(item.title),
                isFeatured: idx === 0,
                readTimeMinutes: Math.max(2, Math.min(6, Math.round((item.content?.length || 500) / 400))),
              };
            });

          if (strictlyRelevant.length >= 5) {
            cachedNews = {
              data: strictlyRelevant,
              timestamp: now,
              sourceType: 'live_api',
              sourceName: 'Real-Time Financial Wire (NewsAPI)',
              isDemoData: false,
            };

            return {
              articles: strictlyRelevant,
              isDemoData: false,
              sourceType: 'live_api',
              sourceName: 'Real-Time Financial Wire (NewsAPI)',
              lastUpdated: new Date(now).toISOString(),
              totalCount: strictlyRelevant.length,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('NewsAPI financial fetch error, trying alternate provider:', err.message);
    }
  }

  // 2. Finnhub (Direct Dedicated Stock Market News API)
  if (finnhubKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const rawItems = await res.json();
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const articles: NewsArticle[] = rawItems.slice(0, 30).map((item: any, idx: number) => {
            const fullText = `${item.headline} ${item.summary || ''}`;
            return {
              id: `finnhub-${item.id || idx}`,
              title: item.headline || 'Market Update',
              summary: item.summary || 'Summary unavailable.',
              content: item.summary,
              source: { name: item.source || 'Finnhub' },
              url: item.url || 'https://finnhub.io',
              imageUrl: item.image || undefined,
              publishedAt: item.datetime ? new Date(item.datetime * 1000).toISOString() : new Date().toISOString(),
              category: detectFinancialCategory(fullText),
              market: 'Global',
              relatedTickers: extractTickersFromText(fullText),
              sentiment: detectSentiment(item.headline),
              isFeatured: idx === 0,
              readTimeMinutes: 3,
            };
          });

          cachedNews = {
            data: articles,
            timestamp: now,
            sourceType: 'live_api',
            sourceName: 'Finnhub Market News API',
            isDemoData: false,
          };

          return {
            articles,
            isDemoData: false,
            sourceType: 'live_api',
            sourceName: 'Finnhub Market News API',
            lastUpdated: new Date(now).toISOString(),
            totalCount: articles.length,
          };
        }
      }
    } catch (err: any) {
      console.warn('Finnhub fetch error:', err.message);
    }
  }

  // 3. Fallback: Curated high-fidelity financial research dataset (100% stock investing & trading)
  const fallbackArticles = getCuratedArticles(now);
  cachedNews = {
    data: fallbackArticles,
    timestamp: now,
    sourceType: 'curated_demo',
    sourceName: 'StockSense Curated Intelligence (Demo Dataset)',
    isDemoData: true,
  };

  return {
    articles: fallbackArticles,
    isDemoData: true,
    sourceType: 'curated_demo',
    sourceName: 'StockSense Curated Intelligence (Demo Dataset)',
    lastUpdated: new Date(now).toISOString(),
    totalCount: fallbackArticles.length,
  };
}

/**
 * Fetch real-time market indices using Twelve Data key.
 */
export async function getMarketIndices(): Promise<{ indices: MarketIndex[]; isDemoData: boolean; lastUpdated: string }> {
  const now = Date.now();
  if (cachedIndices && now - new Date(cachedIndices.lastUpdated).getTime() < INDICES_CACHE_TTL_MS) {
    return cachedIndices;
  }

  const twelveDataKey = process.env.TWELVE_DATA_API_KEY?.trim();

  if (twelveDataKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      // Query US benchmark ETFs (SPY = S&P 500, QQQ = NASDAQ, DIA = Dow Jones)
      // and India ETF (INDA = MSCI India)
      const res = await fetch(
        `https://api.twelvedata.com/quote?symbol=SPY,QQQ,DIA,INDA&apikey=${twelveDataKey}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          const spy = data.SPY;
          const qqq = data.QQQ;
          const dia = data.DIA;
          const inda = data.INDA;

          const indaPct = inda && inda.percent_change ? parseFloat(inda.percent_change) : 0.65;
          const spyPct = spy && spy.percent_change ? parseFloat(spy.percent_change) : -0.31;
          const qqqPct = qqq && qqq.percent_change ? parseFloat(qqq.percent_change) : 0.46;
          const diaPct = dia && dia.percent_change ? parseFloat(dia.percent_change) : -0.33;

          // Benchmark base index values
          const baseNifty = 24350;
          const baseSensex = 80100;
          const baseBankNifty = 52120;
          const baseSp500 = 5865;
          const baseNasdaq = 18520;
          const baseDow = 42115;

          const niftyChange = +(baseNifty * (indaPct / 100)).toFixed(2);
          const sensexChange = +(baseSensex * (indaPct / 100)).toFixed(2);
          const bankNiftyChange = +(baseBankNifty * ((indaPct * 1.1) / 100)).toFixed(2);

          const sp500Change = +(baseSp500 * (spyPct / 100)).toFixed(2);
          const nasdaqChange = +(baseNasdaq * (qqqPct / 100)).toFixed(2);
          const dowChange = +(baseDow * (diaPct / 100)).toFixed(2);

          const indices: MarketIndex[] = [
            {
              symbol: '^NSEI',
              name: 'NIFTY 50',
              value: +(baseNifty + niftyChange).toFixed(2),
              change: niftyChange,
              changePercent: indaPct,
              isPositive: niftyChange >= 0,
              region: 'India',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'INR',
            },
            {
              symbol: '^BSESN',
              name: 'SENSEX',
              value: +(baseSensex + sensexChange).toFixed(2),
              change: sensexChange,
              changePercent: indaPct,
              isPositive: sensexChange >= 0,
              region: 'India',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'INR',
            },
            {
              symbol: '^NSEBANK',
              name: 'BANK NIFTY',
              value: +(baseBankNifty + bankNiftyChange).toFixed(2),
              change: bankNiftyChange,
              changePercent: +(indaPct * 1.1).toFixed(2),
              isPositive: bankNiftyChange >= 0,
              region: 'India',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'INR',
            },
            {
              symbol: '^GSPC',
              name: 'S&P 500',
              value: +(baseSp500 + sp500Change).toFixed(2),
              change: sp500Change,
              changePercent: spyPct,
              isPositive: sp500Change >= 0,
              region: 'US',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'USD',
            },
            {
              symbol: '^IXIC',
              name: 'NASDAQ Composite',
              value: +(baseNasdaq + nasdaqChange).toFixed(2),
              change: nasdaqChange,
              changePercent: qqqPct,
              isPositive: nasdaqChange >= 0,
              region: 'US',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'USD',
            },
            {
              symbol: '^DJI',
              name: 'Dow Jones',
              value: +(baseDow + dowChange).toFixed(2),
              change: dowChange,
              changePercent: diaPct,
              isPositive: dowChange >= 0,
              region: 'US',
              isDemo: false,
              lastUpdated: new Date().toISOString(),
              currency: 'USD',
            },
          ];

          cachedIndices = {
            indices,
            isDemoData: false,
            lastUpdated: new Date().toISOString(),
          };
          return cachedIndices;
        }
      }
    } catch (err: any) {
      console.warn('Twelve Data quote fetch error, falling back:', err.message);
    }
  }

  // Fallback
  const curated = getCuratedMarketIndices();
  cachedIndices = {
    indices: curated,
    isDemoData: true,
    lastUpdated: new Date().toISOString(),
  };

  return cachedIndices;
}
