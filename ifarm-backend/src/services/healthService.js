import { testDbConnection } from '../config/database.js';

export const collectHealth = async () => {
  const database = await testDbConnection();
  return {
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
    database,
  };
};
