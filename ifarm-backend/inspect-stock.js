import { getPool, waitForDbReady } from './src/config/database.js';

const run = async () => {
  try {
    await waitForDbReady();
    const pool = getPool();
    const [desc] = await pool.query('DESCRIBE stockinventory');
    console.log('stockinventory schema:', desc);
    const [rows] = await pool.query('SELECT * FROM stockinventory LIMIT 5');
    console.log('stockinventory sample:', rows);
  } catch (err) {
    console.error('inspect-stock failed:', err);
  } finally {
    process.exit(0);
  }
};

run();
