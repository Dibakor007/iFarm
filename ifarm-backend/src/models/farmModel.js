import { getPool } from '../config/database.js';

const DEFAULT_LIMIT = 50;

export const findFarms = async (limit = DEFAULT_LIMIT) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, name, status FROM farms LIMIT ?', [limit]);
  return rows;
};
