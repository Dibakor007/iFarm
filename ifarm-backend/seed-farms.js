
import { getPool, waitForDbReady } from './src/config/database.js';

const seedFarms = async () => {
  try {
    await waitForDbReady();
    const pool = getPool();
    
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM farms');
    const count = rows[0].count;
    
    if (count === 0) {
        console.log('Seeding farms...');
        await pool.query(`
            INSERT INTO farms (name, status) VALUES 
            ('Green Valley Farm', 'Active'),
            ('Sunny Side Fields', 'Review'),
            ('River Delta Crops', 'Active'),
            ('Golden Harvest', 'Inactive'),
            ('Agro Future Ltd', 'Active')
        `);
        console.log('Farms seeded.');
    } else {
        console.log('Farms already has data.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed Failed:', error);
    process.exit(1);
  }
};

seedFarms();
