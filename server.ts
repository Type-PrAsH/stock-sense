import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { fetchNewsArticles, getMarketIndices } from './server/newsService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

  app.use(express.json());

  // 1. API: News Articles
  app.get('/api/news', async (req: Request, res: Response) => {
    try {
      dotenv.config({ override: true });
      const forceRefresh = req.query.refresh === 'true';
      const result = await fetchNewsArticles(forceRefresh);
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      res.status(500).json({
        error: 'Failed to fetch financial news',
        message: err.message,
      });
    }
  });

  // 2. API: Market Indices (NIFTY 50, SENSEX, BANK NIFTY, S&P 500, NASDAQ, Dow Jones)
  app.get('/api/market-indices', async (_req: Request, res: Response) => {
    try {
      dotenv.config({ override: true });
      const result = await getMarketIndices();
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching market indices:', err);
      res.status(500).json({ error: 'Failed to retrieve market indices' });
    }
  });

  // 3. API: Status & Configuration Info
  app.get('/api/status', (_req: Request, res: Response) => {
    dotenv.config({ override: true });
    const hasFinnhub = Boolean(process.env.FINNHUB_API_KEY?.trim());
    const hasNewsApi = Boolean(process.env.NEWS_API_KEY?.trim());
    const hasAlphaVantage = Boolean(process.env.ALPHA_VANTAGE_API_KEY?.trim());
    const hasTwelveData = Boolean(process.env.TWELVE_DATA_API_KEY?.trim());

    res.json({
      status: 'operational',
      app: 'StockSense Terminal',
      configuredProviders: {
        finnhub: hasFinnhub,
        newsApi: hasNewsApi,
        alphaVantage: hasAlphaVantage,
        twelveData: hasTwelveData,
      },
      usingDemoData: !hasFinnhub && !hasNewsApi && !hasTwelveData,
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(` 📈 StockSense Financial Research & News Terminal`);
    console.log(`======================================================`);
    console.log(` 🚀 Local:   http://localhost:${PORT}`);
    console.log(` 🌐 Network: http://0.0.0.0:${PORT}`);
    console.log(` ⚙️  Mode:    ${isProd ? 'Production' : 'Development'}`);
    console.log(`======================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
