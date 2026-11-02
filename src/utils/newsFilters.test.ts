import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deduplicateArticles,
  filterAndSortArticles,
  extractTrendingCompanies,
  extractTrendingTopics,
  calculateRelevanceScore,
  formatRelativeTime,
  isStockMarketRelevant,
  extractTickersFromText,
} from './newsFilters';
import { NewsArticle } from '../types';

const sampleArticles: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Reliance Industries Reports 11% Rise in Q3 Net Profit',
    summary: 'Reliance Industries reported a strong quarter led by retail and telecom operations.',
    source: { name: 'The Economic Times' },
    url: 'https://economictimes.indiatimes.com/markets/stocks/news/reliance-q3-results',
    publishedAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1h ago
    category: 'Earnings',
    market: 'India',
    relatedTickers: [{ symbol: 'RELIANCE', name: 'Reliance Industries', changePercent: 1.85 }],
    sentiment: 'bullish',
  },
  {
    id: 'art-2',
    title: 'Reliance Industries Reports 11% Rise in Q3 Net Profit', // Duplicate title
    summary: 'Reliance quarterly net profit rises 11 percent.',
    source: { name: 'Moneycontrol' },
    url: 'https://moneycontrol.com/news/reliance-q3-results-duplicate',
    publishedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    category: 'Earnings',
    market: 'India',
    relatedTickers: [{ symbol: 'RELIANCE', name: 'Reliance Industries' }],
  },
  {
    id: 'art-3',
    title: 'Fed Signals Potential Rate Cut As Inflation Cools',
    summary: 'The Federal Reserve indicated benchmark rate adjustments could be considered.',
    source: { name: 'Reuters' },
    url: 'https://reuters.com/markets/us/fed-rate-cut-signals',
    publishedAt: new Date(Date.now() - 86400 * 1000 * 2).toISOString(), // 2 days ago
    category: 'Economy',
    market: 'US',
    relatedTickers: [{ symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', changePercent: 0.45 }],
  },
  {
    id: 'art-4',
    title: 'Nvidia Unveils Next-Gen AI Chip Architecture for Datacenters',
    summary: 'Nvidia announced its latest GPU architecture with higher efficiency for generative AI workloads.',
    source: { name: 'Bloomberg' },
    url: 'https://bloomberg.com/technology/nvidia-next-gen-chips',
    publishedAt: new Date(Date.now() - 10000 * 1000).toISOString(),
    category: 'Technology',
    market: 'US',
    relatedTickers: [{ symbol: 'NVDA', name: 'Nvidia Corp', changePercent: 3.2 }],
    sentiment: 'bullish',
  },
  {
    id: 'art-5',
    title: 'Tata Motors EV Sales Jump 34% in Robust Festive Quarter',
    summary: 'Tata Motors experienced heavy demand for its electric vehicle portfolio across metro cities.',
    source: { name: 'Livemint' },
    url: 'https://livemint.com/auto/tata-motors-ev-sales',
    publishedAt: new Date(Date.now() - 7200 * 1000).toISOString(), // 2h ago
    category: 'Stocks & Companies',
    market: 'India',
    relatedTickers: [
      { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', changePercent: 2.1 },
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
    ],
  },
];

test('isStockMarketRelevant excludes irrelevant sports/lifestyle and keeps financial news', () => {
  assert.equal(
    isStockMarketRelevant('The Wesleys in Oxford-Part Two', 'There were some disappointments in Oxford'),
    false,
    'Should reject Oxford travel blog'
  );
  assert.equal(
    isStockMarketRelevant('Wales in fight to retain rising female stars', 'Wales football face battle'),
    false,
    'Should reject football sports news'
  );
  assert.equal(
    isStockMarketRelevant(
      'Apple overtakes Nvidia to become world most valuable company at $5trn',
      'Market capitalization reaches new record after earnings'
    ),
    true,
    'Should accept Apple and Nvidia stock market news'
  );
  assert.equal(
    isStockMarketRelevant(
      'Reddit stock plunges 30% after weak outlook, heads for worst day ever',
      'Shares drop in heavy trading volume on Wall Street'
    ),
    true,
    'Should accept stock trading plunge news'
  );
});

test('extractTickersFromText identifies companies from headlines', () => {
  const detected = extractTickersFromText('Apple overtakes Nvidia in market cap surge while Tata Motors posts record revenue');
  const symbols = detected.map((d) => d.symbol);
  assert.ok(symbols.includes('AAPL'), 'Should detect Apple (AAPL)');
  assert.ok(symbols.includes('NVDA'), 'Should detect Nvidia (NVDA)');
  assert.ok(symbols.includes('TATAMOTORS'), 'Should detect Tata Motors (TATAMOTORS)');
});

test('deduplicateArticles removes duplicate titles and URLs', () => {
  const result = deduplicateArticles(sampleArticles);
  assert.equal(result.length, 4, 'Should eliminate 1 duplicate article');
  assert.equal(result[0].id, 'art-1');
});

test('filterAndSortArticles filters by category correctly', () => {
  const deduped = deduplicateArticles(sampleArticles);
  const filtered = filterAndSortArticles(deduped, {
    category: 'Earnings',
    market: 'All',
    timeRange: 'all',
    sortBy: 'recent',
    searchQuery: '',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'Reliance Industries Reports 11% Rise in Q3 Net Profit');
});

test('filterAndSortArticles filters by market correctly', () => {
  const deduped = deduplicateArticles(sampleArticles);
  const filteredIndia = filterAndSortArticles(deduped, {
    category: 'All News',
    market: 'India',
    timeRange: 'all',
    sortBy: 'recent',
    searchQuery: '',
  });
  assert.equal(filteredIndia.length, 2);
  assert.ok(filteredIndia.every((a) => a.market === 'India'));
});

test('filterAndSortArticles filters by search query and relevance', () => {
  const deduped = deduplicateArticles(sampleArticles);
  const searchResults = filterAndSortArticles(deduped, {
    category: 'All News',
    market: 'All',
    timeRange: 'all',
    sortBy: 'relevance',
    searchQuery: 'NVDA',
  });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].relatedTickers[0].symbol, 'NVDA');
});

test('extractTrendingCompanies counts ticker mentions accurately', () => {
  const deduped = deduplicateArticles(sampleArticles);
  const trending = extractTrendingCompanies(deduped);
  assert.ok(trending.length >= 2);
  // RELIANCE is mentioned in art-1 and art-5
  const reliance = trending.find((c) => c.symbol === 'RELIANCE');
  assert.ok(reliance);
  assert.equal(reliance?.mentions, 2);
});

test('extractTrendingTopics identifies financial themes', () => {
  const deduped = deduplicateArticles(sampleArticles);
  const topics = extractTrendingTopics(deduped);
  assert.ok(topics.length > 0);
  const earningsTopic = topics.find((t) => t.tag === 'Q3 Earnings');
  assert.ok(earningsTopic, 'Should find Q3 Earnings topic');
  assert.ok(earningsTopic!.count >= 1);
});

test('formatRelativeTime produces accurate compact labels', () => {
  const now = Date.now();
  assert.equal(formatRelativeTime(new Date(now - 30 * 1000).toISOString(), now), 'Just now');
  assert.equal(formatRelativeTime(new Date(now - 15 * 60 * 1000).toISOString(), now), '15m ago');
  assert.equal(formatRelativeTime(new Date(now - 4 * 3600 * 1000).toISOString(), now), '4h ago');
  assert.equal(formatRelativeTime(new Date(now - 2 * 86400 * 1000).toISOString(), now), '2d ago');
});
