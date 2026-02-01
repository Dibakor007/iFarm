import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import apiRouter from './src/routes/index.js';
import { requestLogger } from './src/middleware/requestLogger.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { testDbConnection, waitForDbReady } from './src/config/database.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const apiBasePath = process.env.API_BASE_PATH ?? '/api/v1';

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(morgan('tiny'));

// Root info endpoint for quick sanity checks
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'iFarm backend is running',
    apiBasePath,
    health: {
      api: `${apiBasePath}/health`,
      root: '/health',
    },
  });
});

app.use(apiBasePath, apiRouter);

app.get('/health', async (req, res, next) => {
  try {
    const dbStatus = await testDbConnection();
    res.json({ status: 'ok', database: dbStatus });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const startServer = async () => {
  try {
    const dbInfo = await waitForDbReady();
    console.log(
      `[ifarm-backend] connected to MySQL ${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`,
    );
    app.listen(port, () => {
      console.log(`[ifarm-backend] listening on port ${port}`);
    });
  } catch (error) {
    console.error('[ifarm-backend] failed to start', error);
    process.exit(1);
  }
};

startServer();
