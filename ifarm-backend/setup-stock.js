import { getPool } from './src/config/database.js';

async function setupStockTable() {
  const pool = getPool();
  
  try {
    // Check if table exists
    const [tables] = await pool.query('SHOW TABLES LIKE "stockinventory"');
    
    if (tables.length === 0) {
      console.log('Creating stockinventory table...');
      await pool.query(`
        CREATE TABLE stockinventory (
          stock_id INT AUTO_INCREMENT PRIMARY KEY,
          storage_id INT,
          farmer_id INT,
          crop_type VARCHAR(100) NOT NULL,
          quantity_kg DECIMAL(10,2) NOT NULL,
          entry_date DATE NOT NULL,
          expiry_date DATE,
          status VARCHAR(50) DEFAULT 'stored'
        )
      `);
      console.log('✓ stockinventory table created');
    } else {
      console.log('✓ stockinventory table already exists');
    }

    // Insert sample data if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM stockinventory');
    if (rows[0].count === 0) {
      console.log('Inserting sample stock data...');
      await pool.query(`
        INSERT INTO stockinventory (storage_id, farmer_id, crop_type, quantity_kg, entry_date, expiry_date, status) VALUES
        (501, 101, 'Potato', 5000, '2026-01-15', '2026-04-15', 'stored'),
        (501, 102, 'Onion', 3000, '2026-01-20', '2026-03-20', 'stored'),
        (502, 103, 'Tomato', 1500, '2026-01-25', '2026-02-25', 'stored')
      `);
      console.log('✓ Sample stock data inserted');
    }

    console.log('Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

setupStockTable();
