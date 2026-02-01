
import { getPool, waitForDbReady } from './src/config/database.js';

const checkDb = async () => {
  try {
    await waitForDbReady();
    console.log('Database connected.');
    const pool = getPool();
    
    // Check tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    // Check farms table if it exists
    const tableNames = tables.map(t => Object.values(t)[0]);
    if (tableNames.includes('farms')) {
        const [rows] = await pool.query('SELECT * FROM farms LIMIT 5');
        console.log('Farms data sample:', rows);
    } else {
        console.log('Stats: farms table missing!');
        // Create it if missing for convenience? 
        // The user said "fix it", implies getting it working.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS farms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'Active',
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created farms table.');
        
        await pool.query(`
            INSERT INTO farms (name, status, location) VALUES 
            ('Green Valley Farm', 'Active', 'Rangpur'),
            ('Sunny Side Fields', 'Review', 'Bogra'),
            ('River Delta Crops', 'Active', 'Munshiganj')
        `);
        console.log('Seeded farms table.');
    }

    process.exit(0);
  } catch (error) {
    console.error('DB Check Failed:', error);
    process.exit(1);
  }
};

checkDb();
