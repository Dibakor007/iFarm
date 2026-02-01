
import { getPool, waitForDbReady } from './src/config/database.js';

const setupHarvestTable = async () => {
  try {
    await waitForDbReady();
    const pool = getPool();
    
    console.log('Setting up harvests table...');
    await pool.query(`
        CREATE TABLE IF NOT EXISTS harvests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            farmerName VARCHAR(255) NOT NULL,
            cropType VARCHAR(100) NOT NULL,
            quantity DECIMAL(10, 2) NOT NULL,
            unit VARCHAR(20) DEFAULT 'KG',
            date DATE NOT NULL,
            location VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Harvests table created (if not exists).');

    // Seed some data if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM harvests');
    const count = rows[0].count;
    
    if (count === 0) {
        console.log('Seeding harvests...');
        await pool.query(`
            INSERT INTO harvests (farmerName, cropType, quantity, unit, date, location) VALUES 
            ('Rahim Uddin', 'Potato', 500.5, 'KG', '2023-10-25', 'Rangpur'),
            ('Karim Mia', 'Onion', 120, 'KG', '2023-10-26', 'Pabna')
        `);
        console.log('Harvests seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Setup Failed:', error);
    process.exit(1);
  }
};

setupHarvestTable();
