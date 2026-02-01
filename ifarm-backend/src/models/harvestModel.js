
import { getPool } from '../config/database.js';

export const createHarvest = async (data) => {
  const pool = getPool();
  const { farmerName, cropType, quantity, unit, date, location } = data;
  const [result] = await pool.query(
    'INSERT INTO harvests (farmerName, cropType, quantity, unit, date, location) VALUES (?, ?, ?, ?, ?, ?)',
    [farmerName, cropType, quantity, unit, date, location]
  );
  return { id: result.insertId, ...data };
};

export const findAllHarvests = async (limit = 100) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM harvests ORDER BY date DESC LIMIT ?', [limit]);
  return rows;
};
