# 📈 StockSense — Modern Stock Research & Financial News Terminal

> *"Understand the Market. Make Smarter Decisions."*

StockSense is a high-density, professional financial research and market news terminal designed with a dark-first aesthetic inspired by Bloomberg Terminal and TradingView. It provides real-time market indices, categorized financial intelligence, data-driven company sentiment, and trending market insights across Indian and global equities.

---

## ⚡ Quick Start on Localhost

StockSense is completely configured to run locally out-of-the-box. **No API keys or complex setups are required to get started.**

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18, v20, or v22 recommended)
- npm (installed with Node)

### 2. Installation
Clone or navigate into the project directory and install dependencies:
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

That's it! StockSense will boot up the full-stack Express server and Vite frontend on `localhost:3000`.

---

## 🔑 API Keys & Data Providers (Do You Need Any?)

### Short Answer: **NO, an API key is completely optional!**

StockSense includes an **automatic multi-tier data engine**:
1. **Tier 1 (Official Financial APIs)**: If you provide an API key, the terminal directly streams from that provider.
2. **Tier 2 (Live Market RSS)**: When running on localhost with an internet connection and no API keys, StockSense can fetch live market RSS feeds (e.g. Yahoo Finance) without needing an account.
3. **Tier 3 (Offline / Curated Intelligence)**: If offline or without any network keys, StockSense automatically provides high-fidelity, curated market intelligence covering Indian equities (Reliance, Tata Motors, HDFC Bank, TCS, Zomato, RBI policy) and US/Global equities (Nvidia, Apple, Microsoft, Tesla, Fed rate cuts).

---

### Optional: How to Connect Real Live Financial APIs (Free)

If you'd like to stream live data directly from official financial data providers, you can obtain a **100% free** API key from any of the following:

| Provider | What It Covers | Free Tier Limit | Get Key Link |
| :--- | :--- | :--- | :--- |
| **Twelve Data** *(Indices)* | **Real-time Live Quotes** for NIFTY 50, SENSEX, BANK NIFTY, S&P 500, NASDAQ, Dow | 800 requests/day | [twelvedata.com](https://twelvedata.com) |
| **NewsAPI** *(News)* | **Real-time Live News** from Indian wires (ET, Mint, Moneycontrol) and US wires | 100 requests/day | [newsapi.org](https://newsapi.org) |
| **Finnhub** *(News)* | Global equities news, tech earnings, company updates | 60 calls/min | [finnhub.io](https://finnhub.io) |
| **Alpha Vantage** *(Sentiment)* | Financial market news with machine learning sentiment scores | 25 requests/day | [alphavantage.co](https://www.alphavantage.co) |

#### Setting Your API Key:
Open `.env` in the root of the project and add your key(s):
```env
# Real live market indices (Nifty, Sensex, S&P 500, Nasdaq, Dow)
TWELVE_DATA_API_KEY="your_twelvedata_key"

# Real live business news
NEWS_API_KEY="your_newsapi_key"
FINNHUB_API_KEY=""
ALPHA_VANTAGE_API_KEY=""
```

Restart `npm run dev` or click **Refresh** in the top bar. The terminal will automatically detect the key, proxy requests server-side, and stream live news!

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts full-stack Express backend + Vite dev server on `http://localhost:3000` |
| `npm run build` | Compiles frontend assets for production into `/dist` |
| `npm start` | Runs the production server (`dist` build mode) |
| `npm test` | Runs the test suite via Node's native test runner (`node:test`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans build artifacts (`dist/`) |

---

## 🏗️ Project Architecture

```
├── .env                  # Local environment configuration
├── .env.example          # Environment template
├── server.ts             # Express full-stack entry point & Vite middleware
├── server/
│   ├── newsService.ts    # Provider abstraction (Finnhub, NewsAPI, Alpha Vantage, RSS, fallback)
│   └── sampleData.ts     # High-fidelity curated financial research dataset
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx                   # Collapsible terminal sidebar with route management
│   │   ├── Topbar.tsx                    # Search bar, market hours indicator, refresh
│   │   ├── MarketTicker.tsx              # Indices strip (NIFTY 50, SENSEX, S&P 500, NASDAQ, Dow)
│   │   ├── NewsDashboard.tsx             # Primary news terminal view
│   │   ├── NewsFilters.tsx               # 9 category tabs, region, timeframe, and sort controls
│   │   ├── FeaturedNews.tsx              # Prominent hero article with terminal graphics
│   │   ├── NewsCard.tsx                  # Dense, readable financial cards with ticker tags
│   │   ├── NewsFeed.tsx                  # Feed list with skeletons, pagination, empty states
│   │   ├── TrendingPanel.tsx             # Data-driven most mentioned tickers and market topics
│   │   ├── ArticleDetailModal.tsx        # Slide-over reader with full excerpt & publisher link
│   │   ├── FinancialGraphicPlaceholder.tsx # High-tech candlestick/sparkline graphic fallback
│   │   └── SettingsModal.tsx             # API status checker and connection guide
│   ├── services/
│   │   └── api.ts                        # Frontend client API client
│   ├── utils/
│   │   ├── newsFilters.ts                # Pure filtering, ranking, deduplication, and trend algorithms
│   │   └── newsFilters.test.ts           # Unit tests
│   ├── types/
│   │   └── index.ts                      # Domain TypeScript types
│   ├── App.tsx                           # Root terminal view
│   └── main.tsx                          # React entry point
└── package.json
```

---

## 🔒 Security Guarantee
- **Zero Frontend Key Exposure**: API keys are only read in Node.js server routes (`server/newsService.ts`). No secrets are ever bundled into client-side code.
- **Intellectual Property Respect**: StockSense displays fair-use summaries, headlines, and metadata, providing direct links to the original publisher for full reporting.
