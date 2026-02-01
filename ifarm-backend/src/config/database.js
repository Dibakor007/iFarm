import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES ?? 5);
const DB_CONNECT_RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS ?? 2000);

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'cold_storage_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getPool = () => pool;

export const testDbConnection = async () => {
  const host = pool.config?.connectionConfig?.host ?? process.env.DB_HOST ?? '127.0.0.1';
  const port = pool.config?.connectionConfig?.port ?? Number(process.env.DB_PORT ?? 3306);
  const database = pool.config?.connectionConfig?.database ?? process.env.DB_NAME ?? 'cold_storage_db';
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.ping();
    return {
      host,
      port,
      database,
    };
  } catch (error) {
    const err = new Error(`Unable to reach MySQL at ${host}:${port}/${database}`);
    err.cause = error;
    err.statusCode = 503;
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForDbReady = async (
  retries = DB_CONNECT_RETRIES,
  retryDelayMs = DB_CONNECT_RETRY_DELAY_MS,
) => {
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      return await testDbConnection();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await delay(retryDelayMs);
      attempt += 1;
    }
  }

  throw lastError ?? new Error('Database connection failed after retries');
};